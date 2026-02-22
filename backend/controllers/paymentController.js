import orderModel from "../models/orderModel.js";
import crypto from "crypto";

const getItemQuantity = (item) => {
  const parsed = Number(item?.qty);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const getItemPrice = (item) => {
  const parsed = Number(item?.price);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const calculateCartTotal = (cart = []) =>
  cart.reduce((total, item) => total + getItemPrice(item) * getItemQuantity(item), 0);

const getCartProductIds = (cart = []) =>
  cart
    .map((item) => item?._id)
    .filter(Boolean);

const normalizeCartItems = (cart = []) =>
  cart
    .map((item) => ({
      productId: String(item?._id || ""),
      name: item?.name || "",
      qty: getItemQuantity(item),
      price: getItemPrice(item),
    }))
    .filter((item) => item.productId);

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
    const { cart } = req.body;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).send({
        success: false,
        message: "Razorpay is not configured on server",
      });
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Cart is empty",
      });
    }

    const total = calculateCartTotal(cart);
    const amount = Math.round(total * 100);

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
        items: String(cart.length),
      },
    });

    return res.status(200).send({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (error) {
    console.log("Razorpay create order error:", error);
    return res.status(500).send({
      success: false,
      message: error.message || "Unable to create payment order",
    });
  }
};

// razorpay payment verification + order save
export const verifyRazorpayPaymentController = async (req, res) => {
  try {
    const { cart, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Cart is empty",
      });
    }

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

    const totalAmount = calculateCartTotal(cart);
    const productIds = getCartProductIds(cart);

    if (!productIds.length) {
      return res.status(400).send({
        success: false,
        message: "Invalid products in cart",
      });
    }

    const order = await new orderModel({
      products: productIds,
      payment: {
        success: true,
        provider: "razorpay",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        amount: totalAmount,
        currency: "INR",
        items: normalizeCartItems(cart),
      },
      buyer: req.user._id,
    }).save();

    return res.status(200).send({
      success: true,
      message: "Payment verified successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.log("Razorpay verify payment error:", error);
    return res.status(500).send({
      success: false,
      message: error.message || "Unable to verify payment",
    });
  }
};
