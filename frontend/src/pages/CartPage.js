import React, { useEffect, useMemo, useState } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useLocationContext } from "../context/location";
import { useNavigate } from "react-router-dom";
import {
  FiAlertTriangle,
  FiArrowRight,
  FiCheckCircle,
  FiCreditCard,
  FiGlobe,
  FiLayers,
  FiMapPin,
  FiMinus,
  FiPlus,
  FiShield,
  FiShoppingCart,
  FiSmartphone,
  FiTrash2,
} from "react-icons/fi";
import axios from "../config/axios";
import toast from "react-hot-toast";
import { isProductAvailableInLocation } from "../utils/locationUtils";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
let razorpayScriptPromise;

const PAYMENT_OPTIONS = [
  {
    id: "all",
    title: "All Methods",
    subtitle: "UPI, cards, wallets, netbanking",
    icon: FiLayers,
  },
  {
    id: "upi",
    title: "UPI",
    subtitle: "GPay, PhonePe, Paytm",
    icon: FiSmartphone,
  },
  {
    id: "card",
    title: "Card",
    subtitle: "Credit / Debit cards",
    icon: FiCreditCard,
  },
  {
    id: "netbanking",
    title: "NetBanking",
    subtitle: "All major banks",
    icon: FiGlobe,
  },
  {
    id: "wallet",
    title: "Wallet",
    subtitle: "Paytm, Mobikwik, etc.",
    icon: FiShield,
  },
];

const RAZORPAY_METHOD_MAP = {
  upi: {
    upi: true,
    card: false,
    netbanking: false,
    wallet: false,
    emi: false,
    paylater: false,
  },
  card: {
    upi: false,
    card: true,
    netbanking: false,
    wallet: false,
    emi: false,
    paylater: false,
  },
  netbanking: {
    upi: false,
    card: false,
    netbanking: true,
    wallet: false,
    emi: false,
    paylater: false,
  },
  wallet: {
    upi: false,
    card: false,
    netbanking: false,
    wallet: true,
    emi: false,
    paylater: false,
  },
};

const loadRazorpayScript = () => {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);

  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = RAZORPAY_SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        razorpayScriptPromise = null;
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  return razorpayScriptPromise;
};

const formatCurrency = (value) => `₹${(Number(value) || 0).toLocaleString("en-IN")}`;

const normalizedQty = (item) => {
  const qty = Number(item?.qty);
  return Number.isFinite(qty) && qty > 0 ? qty : 1;
};

const normalizedPrice = (item) => {
  const price = Number(item?.price);
  return Number.isFinite(price) && price > 0 ? price : 0;
};

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const {
    selectedLocation,
    selectedLocationLabel,
    customerLocation,
    selectedAreaDistanceKm,
    selectedServiceArea,
    isSelectedAreaInRange,
  } = useLocationContext();
  const [loading, setLoading] = useState(false);
  const [checkoutReady, setCheckoutReady] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    loadRazorpayScript().then((ready) => {
      if (active) setCheckoutReady(ready);
    });
    return () => {
      active = false;
    };
  }, []);

  const cartItems = useMemo(
    () =>
      (cart || []).map((item) => ({
        ...item,
        qty: normalizedQty(item),
        price: normalizedPrice(item),
      })),
    [cart]
  );

  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.qty, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cartItems]
  );

  const shipping = 0;
  const total = subtotal + shipping;
  const unavailableItems = useMemo(
    () =>
      cartItems.filter(
        (item) => !isProductAvailableInLocation(item, selectedLocation)
      ),
    [cartItems, selectedLocation]
  );
  const hasUnavailableItems = unavailableItems.length > 0;
  const hasDistanceRangeConflict =
    selectedAreaDistanceKm !== null && !isSelectedAreaInRange;

  const paymentLocationMeta = {
    latitude: customerLocation?.latitude ?? null,
    longitude: customerLocation?.longitude ?? null,
    pincode: customerLocation?.pincode || "",
  };

  const persistCart = (nextCart) => {
    setCart(nextCart);
    localStorage.setItem("cart", JSON.stringify(nextCart));
  };

  const clearCart = () => {
    persistCart([]);
    toast.success("Cart cleared");
  };

  const removeCartItem = (pid) => {
    try {
      const nextCart = cart.filter((item) => item._id !== pid);
      persistCart(nextCart);
      toast.success("Item removed from cart");
    } catch (error) {
      console.log(error);
      toast.error("Unable to remove item");
    }
  };

  const updateQuantity = (pid, delta) => {
    const nextCart = cart.map((item) => {
      if (item._id !== pid) return item;
      const nextQty = Math.max(1, normalizedQty(item) + delta);
      return { ...item, qty: nextQty };
    });
    persistCart(nextCart);
  };

  const getPaymentCartPayload = () =>
    cartItems.map((item) => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      qty: item.qty,
    }));

  const getRazorpayMethodConfig = () => {
    if (selectedPaymentOption === "all") return undefined;
    return RAZORPAY_METHOD_MAP[selectedPaymentOption];
  };

  const handleRazorpayPayment = async () => {
    if (!auth?.token) {
      navigate("/login", { state: "/cart" });
      return;
    }

    if (!auth?.user?.address) {
      toast.error("Please add your delivery address first");
      navigate("/dashboard/user/profile");
      return;
    }

    if (!cartItems.length) {
      toast.error("Your cart is empty");
      return;
    }

    if (!selectedLocation) {
      toast.error("Please select your delivery location first");
      return;
    }

    if (hasUnavailableItems) {
      toast.error("Remove unavailable books for current location to continue");
      return;
    }

    if (hasDistanceRangeConflict) {
      toast.error("Selected delivery area is outside service radius");
      return;
    }

    try {
      setLoading(true);

      const isScriptReady = await loadRazorpayScript();
      if (!isScriptReady || !window.Razorpay) {
        throw new Error("Razorpay SDK failed to load");
      }

      const paymentCart = getPaymentCartPayload();
      const { data: orderData } = await axios.post(
        "/api/v1/payment/razorpay/create-order",
        {
          cart: paymentCart,
          selectedLocation,
          customerLocation: paymentLocationMeta,
        }
      );

      if (!orderData?.success || !orderData?.order?.id) {
        throw new Error(orderData?.message || "Unable to initialize payment");
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency || "INR",
        name: "Booklet",
        description: `Checkout for ${itemCount} item${itemCount === 1 ? "" : "s"}`,
        order_id: orderData.order.id,
        prefill: {
          name: auth?.user?.name || "",
          email: auth?.user?.email || "",
          contact: auth?.user?.phone || "",
        },
        notes: {
          address: auth?.user?.address || "",
        },
        theme: {
          color: "#f97316",
        },
        handler: async (response) => {
          try {
            const { data: verifyData } = await axios.post(
              "/api/v1/payment/razorpay/verify-payment",
              {
                cart: paymentCart,
                selectedLocation,
                customerLocation: paymentLocationMeta,
                ...response,
              }
            );

            if (!verifyData?.success) {
              throw new Error(verifyData?.message || "Payment verification failed");
            }

            localStorage.removeItem("cart");
            setCart([]);
            toast.success("Payment successful. Order placed.");
            navigate("/dashboard/user/orders");
          } catch (verifyError) {
            console.log("Verify payment error:", verifyError);
            toast.error(
              verifyError?.response?.data?.message ||
                verifyError?.message ||
                "Payment verification failed"
            );
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const methodConfig = getRazorpayMethodConfig();
      if (methodConfig) {
        options.method = methodConfig;
      }

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", (response) => {
        setLoading(false);
        toast.error(
          response?.error?.description || "Payment failed. Please try again."
        );
      });
      paymentObject.open();
    } catch (error) {
      console.log("Razorpay checkout error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to start payment"
      );
      setLoading(false);
    }
  };

  const isCheckoutDisabled =
    loading ||
    !checkoutReady ||
    !auth?.token ||
    !auth?.user?.address ||
    !selectedLocation ||
    hasDistanceRangeConflict ||
    hasUnavailableItems ||
    !cartItems.length;

  return (
    <Layout title="Shopping Cart - Booklet">
      <section className="relative overflow-hidden bg-primary-50 min-h-screen pt-2 pb-24 md:pt-3 lg:pb-8">
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-accent-100/60 blur-3xl" />
        <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-primary-100/80 blur-3xl" />

        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 relative z-10 mt-3">
          <div className="mb-3 sm:mb-4">
            <div className="flex items-end justify-between gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-primary-900 inline-flex items-center gap-2">
                <FiShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-accent-700" />
                Your Cart
              </h1>
              <p className="hidden sm:block text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-500">
                Secure Checkout
              </p>
            </div>
            <div className="mt-1.5 h-px w-full bg-gradient-to-r from-accent-300 via-primary-200 to-transparent" />
            <p className="mt-1.5 text-xs sm:text-sm text-primary-700 leading-snug">
              {!auth?.user
                ? "Login to place your order securely."
                : `${auth?.user?.name}, choose payment method and place your order.`}
            </p>
            {selectedLocationLabel && (
              <p className="mt-1 text-xs text-primary-500">
                Delivering to: <span className="font-semibold text-primary-700">{selectedLocationLabel}</span>
              </p>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="rounded-3xl border border-primary-200 bg-white shadow-sm text-center py-20 px-5">
              <div className="mx-auto h-16 w-16 rounded-2xl border border-accent-200 bg-accent-50 text-accent-700 flex items-center justify-center">
                <FiShoppingCart className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-primary-900">Your cart is empty</h2>
              <p className="mt-1.5 text-sm text-primary-600">Add books to continue with checkout.</p>
              <button
                onClick={() => navigate("/")}
                className="mt-6 h-10 px-5 rounded-lg border border-accent-200 bg-accent-50 text-accent-700 hover:bg-accent-100 text-sm font-semibold inline-flex items-center gap-2"
              >
                Continue Shopping
                <FiArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-[1fr,390px] gap-5 lg:gap-6 items-start">
              <div className="rounded-3xl border border-primary-200 bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-primary-100 bg-primary-50/60 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-primary-900">Cart Items</h2>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="divide-y divide-primary-100">
                  {cartItems.map((product) => (
                    <div key={product._id} className="p-4 sm:p-5 flex gap-3 sm:gap-4">
                      <img
                        src={
                          product.imageUrl ||
                          product.imageUrls?.[0] ||
                          "https://placehold.co/120x160/f5f0e8/826b4d?text=No+Image"
                        }
                        alt={product.name}
                        className="h-24 w-16 sm:h-28 sm:w-20 rounded-xl object-contain p-1 border border-primary-200 bg-primary-50"
                      />

                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() =>
                            product.slug
                              ? navigate(`/product/${product.slug}`)
                              : toast.error("Product details not available")
                          }
                          className="text-left w-full text-sm sm:text-base font-semibold text-primary-900 hover:text-accent-700 line-clamp-1"
                        >
                          {product.name}
                        </button>
                        <p className="mt-1 text-xs sm:text-sm text-primary-600 line-clamp-2">
                          {product.description || "No description available"}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2.5">
                          {isProductAvailableInLocation(product, selectedLocation) ? (
                            <div className="inline-flex items-center rounded-full border border-accent-200 bg-accent-50 px-2.5 py-1 text-[11px] font-semibold text-accent-700">
                              Available in your area
                            </div>
                          ) : (
                            <div className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700">
                              Not deliverable to selected area
                            </div>
                          )}
                          <p className="text-xs text-primary-500">Unit: {formatCurrency(product.price)}</p>

                          <div className="inline-flex items-center rounded-lg border border-primary-200 bg-white">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product._id, -1)}
                              className="h-8 w-8 inline-flex items-center justify-center text-primary-700 hover:bg-primary-50"
                              aria-label="Decrease quantity"
                            >
                              <FiMinus className="h-3.5 w-3.5" />
                            </button>
                            <span className="h-8 min-w-[2rem] px-2 inline-flex items-center justify-center text-sm font-semibold text-primary-900 border-x border-primary-200">
                              {product.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product._id, 1)}
                              className="h-8 w-8 inline-flex items-center justify-center text-primary-700 hover:bg-primary-50"
                              aria-label="Increase quantity"
                            >
                              <FiPlus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between gap-2">
                        <p className="text-sm sm:text-base font-bold text-accent-700 whitespace-nowrap">
                          {formatCurrency(product.price * product.qty)}
                        </p>
                        <button
                          onClick={() => removeCartItem(product._id)}
                          className="h-8 w-8 rounded-md border border-red-200 text-red-600 hover:bg-red-50 inline-flex items-center justify-center"
                          title="Remove item"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-5 py-4 bg-primary-50/50 border-t border-primary-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-xs text-primary-600">Need another title? Continue exploring catalog.</p>
                  <button
                    onClick={() => navigate("/")}
                    className="h-9 px-4 rounded-lg border border-primary-200 bg-white hover:bg-primary-50 text-primary-700 text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    Continue Shopping
                    <FiArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <aside className="space-y-4 xl:sticky xl:top-24">
                <div className="rounded-3xl border border-primary-200 bg-white shadow-sm overflow-hidden">
                  <div className="px-4 py-3.5 border-b border-primary-100 bg-primary-50/60">
                    <h3 className="text-sm font-semibold text-primary-900">Checkout Summary</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-accent-700 mb-2">
                        Payment Method
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {PAYMENT_OPTIONS.map((option) => {
                          const Icon = option.icon;
                          const active = selectedPaymentOption === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => setSelectedPaymentOption(option.id)}
                              className={`w-full rounded-xl border px-2.5 py-2 text-left transition-colors ${
                                active
                                  ? "border-accent-300 bg-accent-100/80"
                                  : "border-primary-200 bg-white hover:bg-primary-50"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`h-6 w-6 rounded-md inline-flex items-center justify-center ${
                                    active ? "bg-accent-200 text-accent-800" : "bg-primary-100 text-primary-700"
                                  }`}
                                >
                                  <Icon className="h-3 w-3" />
                                </span>
                                <span className="min-w-0 leading-tight">
                                  <span className="block text-[11px] font-semibold text-primary-900">{option.title}</span>
                                  <span className="block text-[10px] text-primary-600 truncate">{option.subtitle}</span>
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-primary-600">Subtotal</span>
                        <span className="font-semibold text-primary-900">{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-primary-600">Shipping</span>
                        <span className="font-semibold text-green-700">
                          {shipping === 0 ? "FREE" : formatCurrency(shipping)}
                        </span>
                      </div>
                      <div className="pt-2.5 border-t border-primary-100 flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary-900">Total</span>
                        <span className="text-xl font-bold text-accent-700">{formatCurrency(total)}</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 inline-flex items-center gap-1.5 text-xs font-semibold text-green-700">
                      <FiCheckCircle className="h-4 w-4" />
                      100% Secure checkout with Razorpay
                    </div>
                    {hasUnavailableItems && (
                      <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 inline-flex items-center gap-1.5">
                        <FiAlertTriangle className="h-4 w-4" />
                        {unavailableItems.length} item{unavailableItems.length === 1 ? "" : "s"} unavailable for {selectedLocationLabel}
                      </div>
                    )}
                    {hasDistanceRangeConflict && (
                      <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 inline-flex items-start gap-1.5">
                        <FiAlertTriangle className="h-4 w-4 mt-0.5" />
                        <span>
                          You are {selectedAreaDistanceKm?.toFixed(1)} km away from{" "}
                          {selectedLocationLabel}. Service radius is{" "}
                          {selectedServiceArea?.radiusKm || 0} km.
                        </span>
                      </div>
                    )}
                    {!selectedLocation && (
                      <p className="text-[11px] text-red-600">
                        Select delivery location from header to continue.
                      </p>
                    )}
                    {!checkoutReady && (
                      <p className="text-[11px] text-primary-600">
                        Loading secure payment SDK...
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleRazorpayPayment}
                      disabled={isCheckoutDisabled}
                      className="hidden lg:inline-flex h-11 w-full rounded-xl bg-accent-500 hover:bg-accent-600 disabled:bg-accent-300 text-white text-sm font-semibold items-center justify-center gap-2 transition-colors"
                    >
                      {loading ? (
                        <>
                          <span className="h-4 w-4 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FiCreditCard className="h-4.5 w-4.5" />
                          Checkout {formatCurrency(total)}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-primary-200 bg-white shadow-sm overflow-hidden">
                  <div className="px-4 py-3.5 border-b border-primary-100 bg-primary-50/60 inline-flex items-center gap-2 text-sm font-semibold text-primary-900 w-full">
                    <FiMapPin className="h-4 w-4 text-accent-700" />
                    Delivery Address
                  </div>
                  <div className="p-4">
                    {auth?.user?.address ? (
                      <>
                        <p className="text-sm text-primary-700 leading-relaxed break-words">
                          {auth.user.address}
                        </p>
                        <button
                          onClick={() => navigate("/dashboard/user/profile")}
                          className="mt-3 text-xs font-semibold text-accent-700 hover:text-accent-800 underline"
                        >
                          Change Address
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-primary-700">
                          Add your address to place the order.
                        </p>
                        <button
                          onClick={() =>
                            auth?.token
                              ? navigate("/dashboard/user/profile")
                              : navigate("/login", { state: "/cart" })
                          }
                          className="mt-3 h-10 w-full rounded-lg border border-accent-200 bg-accent-50 text-accent-700 hover:bg-accent-100 text-sm font-semibold"
                        >
                          {auth?.token ? "Add Address" : "Login to Continue"}
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </aside>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-primary-200 bg-white/95 backdrop-blur px-4 py-3 shadow-[0_-8px_28px_-16px_rgba(90,74,56,0.35)]">
            <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-primary-500">
                  {itemCount} item{itemCount === 1 ? "" : "s"}{selectedLocationLabel ? ` • ${selectedLocationLabel}` : ""}
                </p>
                <p className="text-base font-bold text-accent-700">{formatCurrency(total)}</p>
              </div>
              <button
                type="button"
                onClick={handleRazorpayPayment}
                disabled={isCheckoutDisabled}
                className="h-11 px-4 rounded-xl bg-accent-500 hover:bg-accent-600 disabled:bg-accent-300 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCreditCard className="h-4.5 w-4.5" />
                    Pay Now
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default CartPage;
