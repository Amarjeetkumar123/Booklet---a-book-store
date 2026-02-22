import orderModel from "../models/orderModel.js";
import crypto from "crypto";
import productModel from "../models/productModel.js";
import serviceAreaModel from "../models/serviceAreaModel.js";
import {
  isLocationSupportedByProduct,
  normalizeLocationKey,
  normalizePincode,
  isWithinServiceRadius,
  toNumberOrNull,
} from "../utils/locationUtils.js";

const createHttpError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getItemQuantity = (item) => {
  const parsed = Number(item?.qty);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const getItemPrice = (item) => {
  const parsed = Number(item?.price);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const normalizeCartItems = (cart = []) =>
  cart
    .map((item) => ({
      productId: String(item?._id || ""),
      name: item?.name || "",
      qty: getItemQuantity(item),
      price: getItemPrice(item),
    }))
    .filter((item) => item.productId);

const parseCustomerLocation = (customerLocation = {}) => ({
  pincode: normalizePincode(customerLocation?.pincode || ""),
  latitude: toNumberOrNull(customerLocation?.latitude),
  longitude: toNumberOrNull(customerLocation?.longitude),
});

const validateCartForLocation = async (
  cart = [],
  selectedLocation = "",
  customerLocation = {}
) => {
  if (!Array.isArray(cart) || cart.length === 0) {
    throw createHttpError("Cart is empty");
  }

  const locationKey = normalizeLocationKey(selectedLocation);
  if (!locationKey || locationKey === "all") {
    throw createHttpError("Please select a valid delivery location");
  }

  const serviceArea = await serviceAreaModel
    .findOne({ key: locationKey, isActive: true })
    .select("key label pincode latitude longitude radiusKm");

  if (!serviceArea) {
    throw createHttpError("Selected location is not serviceable right now");
  }

  const parsedCustomerLocation = parseCustomerLocation(customerLocation);
  let distanceKm = null;

  if (
    parsedCustomerLocation.latitude !== null &&
    parsedCustomerLocation.longitude !== null
  ) {
    const rangeStatus = isWithinServiceRadius({
      customerLatitude: parsedCustomerLocation.latitude,
      customerLongitude: parsedCustomerLocation.longitude,
      areaLatitude: serviceArea.latitude,
      areaLongitude: serviceArea.longitude,
      radiusKm: serviceArea.radiusKm,
    });

    distanceKm = rangeStatus.distanceKm;
    if (!rangeStatus.inRange) {
      throw createHttpError(
        `Delivery is outside range for ${serviceArea.label}. Supported radius is ${serviceArea.radiusKm} km.`
      );
    }
  } else if (
    parsedCustomerLocation.pincode &&
    normalizePincode(serviceArea.pincode) !== parsedCustomerLocation.pincode
  ) {
    throw createHttpError(
      `Selected location does not match your current pincode ${parsedCustomerLocation.pincode}`
    );
  }

  const normalizedCartItems = normalizeCartItems(cart);
  if (!normalizedCartItems.length) {
    throw createHttpError("Invalid products in cart");
  }

  const mergedQtyMap = new Map();
  normalizedCartItems.forEach((item) => {
    const existingQty = mergedQtyMap.get(item.productId) || 0;
    mergedQtyMap.set(item.productId, existingQty + item.qty);
  });

  const productIds = Array.from(mergedQtyMap.keys());
  const products = await productModel
    .find({ _id: { $in: productIds } })
    .select("_id name price quantity serviceLocations");

  const productMap = new Map(products.map((product) => [String(product._id), product]));

  const missingProductIds = productIds.filter((id) => !productMap.has(id));
  if (missingProductIds.length) {
    throw createHttpError("Some products are no longer available");
  }

  const unavailableInLocation = [];
  const outOfStockProducts = [];
  const orderItems = [];
  let totalAmount = 0;

  mergedQtyMap.forEach((requestedQty, productId) => {
    const product = productMap.get(productId);
    if (!product) return;

    if (!isLocationSupportedByProduct(product.serviceLocations, locationKey)) {
      unavailableInLocation.push(product.name || "Product");
      return;
    }

    const stockQty = Number(product.quantity);
    if (Number.isFinite(stockQty) && stockQty >= 0 && requestedQty > stockQty) {
      outOfStockProducts.push(product.name || "Product");
      return;
    }

    const price = Number(product.price) || 0;
    totalAmount += price * requestedQty;
    orderItems.push({
      productId: String(product._id),
      name: product.name || "",
      qty: requestedQty,
      price,
    });
  });

  if (unavailableInLocation.length) {
    throw createHttpError(
      `These books are not available in your location: ${unavailableInLocation.join(", ")}`
    );
  }

  if (outOfStockProducts.length) {
    throw createHttpError(
      `These books are out of stock for requested quantity: ${outOfStockProducts.join(", ")}`
    );
  }

  if (!orderItems.length) {
    throw createHttpError("No valid items available for checkout");
  }

  return {
    locationKey,
    locationLabel: serviceArea.label,
    locationPincode: normalizePincode(serviceArea.pincode),
    distanceKm,
    totalAmount,
    productIds: orderItems.map((item) => item.productId),
    orderItems,
  };
};

const createRazorpayAuthHeader = () =>
  `Basic ${Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString("base64")}`;

const createRazorpayOrder = async (payload) => {
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: createRazorpayAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      data?.error?.description ||
      data?.error?.reason ||
      data?.message ||
      "Unable to create Razorpay order";
    throw new Error(message);
  }
  return data;
};

// razorpay payment order creation
export const createRazorpayOrderController = async (req, res) => {
  try {
    const { cart, selectedLocation, customerLocation } = req.body;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).send({
        success: false,
        message: "Razorpay is not configured on server",
      });
    }

    const validatedCart = await validateCartForLocation(
      cart,
      selectedLocation,
      customerLocation
    );
    const amount = Math.round(validatedCart.totalAmount * 100);

    if (!amount || amount < 100) {
      return res.status(400).send({
        success: false,
        message: "Invalid order amount",
      });
    }

    const receipt = `rcpt_${Date.now()}_${String(req.user?._id || "").slice(-6)}`;
    const order = await createRazorpayOrder({
      amount,
      currency: "INR",
      receipt,
      notes: {
        buyerId: String(req.user?._id || ""),
        items: String(validatedCart.orderItems.length),
        deliveryLocation: validatedCart.locationKey,
        deliveryPincode: validatedCart.locationPincode,
      },
    });

    return res.status(200).send({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (error) {
    console.log("Razorpay create order error:", error);
    const statusCode = Number(error?.statusCode) || 500;
    return res.status(statusCode).send({
      success: false,
      message: error.message || "Unable to create payment order",
    });
  }
};

// razorpay payment verification + order save
export const verifyRazorpayPaymentController = async (req, res) => {
  try {
    const {
      cart,
      selectedLocation,
      customerLocation,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).send({
        success: false,
        message: "Missing payment verification fields",
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).send({
        success: false,
        message: "Razorpay secret is not configured",
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    const receivedSignature = String(razorpay_signature);
    const isValidSignature =
      expectedSignature.length === receivedSignature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(receivedSignature)
      );

    if (!isValidSignature) {
      return res.status(400).send({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    const validatedCart = await validateCartForLocation(
      cart,
      selectedLocation,
      customerLocation
    );

    const order = await new orderModel({
      products: validatedCart.productIds,
      payment: {
        success: true,
        provider: "razorpay",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        amount: validatedCart.totalAmount,
        currency: "INR",
        items: validatedCart.orderItems,
        deliveryLocation: validatedCart.locationKey,
        deliveryLocationLabel: validatedCart.locationLabel,
        deliveryPincode: validatedCart.locationPincode,
        deliveryDistanceKm: validatedCart.distanceKm,
      },
      buyer: req.user._id,
      deliveryLocation: validatedCart.locationKey,
      deliveryLocationLabel: validatedCart.locationLabel,
      deliveryPincode: validatedCart.locationPincode,
      deliveryDistanceKm: validatedCart.distanceKm,
    }).save();

    return res.status(200).send({
      success: true,
      message: "Payment verified successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.log("Razorpay verify payment error:", error);
    const statusCode = Number(error?.statusCode) || 500;
    return res.status(statusCode).send({
      success: false,
      message: error.message || "Unable to verify payment",
    });
  }
};
