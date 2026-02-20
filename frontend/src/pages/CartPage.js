import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import {
  FiTrash2,
  FiShoppingCart,
  FiMapPin,
  FiCreditCard,
} from "react-icons/fi";
import axios from "../config/axios";
import toast from "react-hot-toast";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return '₹' + total.toLocaleString("en-IN");
    } catch (error) {
      console.log(error);
    }
  };
  //delete item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  // quantity controls
  const updateQuantity = (pid, delta) => {
    let myCart = cart.map(item => {
      if (item._id === pid) {
        let qty = (item.qty || 1) + delta;
        if (qty < 1) qty = 1;
        return { ...item, qty };
      }
      return item;
    });
    setCart(myCart);
    localStorage.setItem("cart", JSON.stringify(myCart));
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/api/v1/product/braintree/payment", {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <Layout title="Shopping Cart - BookBuddy">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-6 bg-primary-50 min-h-screen">
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-primary-900 mb-1 tracking-tight">
            🛒 Shopping Cart
          </h1>
          <div className="bg-gradient-to-r from-accent-50 to-primary-100 rounded-lg p-4 shadow-sm border border-accent-200">
            <p className="text-xs md:text-sm font-medium text-primary-900">
              {!auth?.user ? "Hello Guest! 👋" : `Hello ${auth?.user?.name}! 👋`}
            </p>
            <p className="text-xs text-primary-700 mt-1">
              {cart?.length
                ? `You have ${cart.length} item${cart.length > 1 ? "s" : ""} in your cart ${auth?.token ? "" : "- please login to checkout"}`
                : "Your cart is empty"}
            </p>
          </div>
        </div>
        {cart?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShoppingCart className="h-8 w-8 text-accent-600" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-primary-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-xs text-primary-600 mb-6">
              Start shopping to add items to your cart
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-accent-100 text-accent-700 px-6 py-2 rounded-lg hover:bg-accent-200 transition-all font-semibold border border-accent-200 shadow-sm text-xs"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Cart Items */}
            <div className="md:col-span-1 lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-2">
                <div className="bg-gradient-to-r from-accent-100 to-primary-100 p-3 border-b border-accent-200">
                  <h2 className="text-sm md:text-base font-semibold text-primary-900 flex items-center gap-2">
                    <FiShoppingCart className="w-5 h-5" />
                    Cart Items ({cart?.length})
                  </h2>
                </div>
                <div className="divide-y divide-primary-100">
                  {cart?.map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center gap-3 py-3 px-2 bg-primary-50 hover:bg-primary-100 transition-colors rounded-lg relative group"
                    >
                      <img
                        src={p.imageUrl || 'https://placehold.co/120x160/f5f0e8/826b4d?text=No+Image'}
                        alt={p.name}
                        className="h-16 w-12 object-cover rounded-md shadow border border-primary-100"
                      />
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => p.slug ? navigate(`/product/${p.slug}`) : toast.error('Product details not available')}
                          className="text-sm font-semibold text-primary-900 mb-0.5 line-clamp-1 hover:text-accent-600 transition-colors text-left w-full"
                        >
                          {p.name}
                        </button>
                        <p className="text-[13px] text-primary-600 mb-0.5 line-clamp-1">{p.description.substring(0, 60)}...</p>
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full text-[12px] font-semibold border border-accent-200">In Stock</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => updateQuantity(p._id, -1)} className="px-2 py-0.5 rounded bg-primary-100 text-primary-700 text-sm font-bold border border-primary-200 hover:bg-primary-200">-</button>
                          <span className="text-sm font-semibold w-6 text-center">{p.qty || 1}</span>
                          <button onClick={() => updateQuantity(p._id, 1)} className="px-2 py-0.5 rounded bg-primary-100 text-primary-700 text-sm font-bold border border-primary-200 hover:bg-primary-200">+</button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 min-w-[70px]">
                        <p className="text-sm font-bold text-accent-600">₹{(p.price * (p.qty || 1)).toLocaleString('en-IN')}</p>
                        <button
                          onClick={() => removeCartItem(p._id)}
                          className="p-1 text-red-600 hover:text-white hover:bg-red-600 rounded-full transition-all border border-red-200 hover:border-red-600"
                          title="Remove item"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Cart Summary */}
            <div className="md:col-span-1 lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
                <div className="bg-gradient-to-r from-accent-100 to-primary-100 p-3 border-b border-accent-200">
                  <h2 className="text-sm md:text-base font-semibold text-primary-900">
                    Order Summary
                  </h2>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs border-b border-primary-100 pb-2">
                      <span className="text-primary-700 font-medium">
                        Subtotal ({cart?.length} items)
                      </span>
                      <span className="font-bold text-primary-900">
                        ₹{cart.reduce((acc, p) => acc + (p.price * (p.qty || 1)), 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-b border-primary-100 pb-2">
                      <span className="text-primary-700 font-medium">Shipping</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="bg-accent-50 rounded-lg p-3 border border-accent-200">
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-primary-900">Total</span>
                        <span className="text-accent-600">₹{cart.reduce((acc, p) => acc + (p.price * (p.qty || 1)), 0).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="mt-4">
                    {auth?.user?.address ? (
                      <div className="bg-primary-50 rounded-lg p-3 border border-primary-200">
                        <div className="flex items-center mb-2">
                          <div className="bg-accent-100 p-1 rounded-lg mr-2">
                            <FiMapPin className="h-4 w-4 text-accent-600" />
                          </div>
                          <h4 className="font-bold text-primary-900 text-xs">
                            Delivery Address
                          </h4>
                        </div>
                        <p className="text-primary-700 mb-2 leading-relaxed text-xs">
                          {auth?.user?.address}
                        </p>
                        <button
                          onClick={() => navigate("/dashboard/user/profile")}
                          className="text-accent-600 hover:text-accent-700 text-xs font-semibold underline"
                        >
                          Update Address
                        </button>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
                        <p className="text-yellow-800 font-semibold text-xs mb-2">
                          ⚠️ Please add your delivery address to proceed
                        </p>
                        {auth?.token ? (
                          <button
                            onClick={() => navigate("/dashboard/user/profile")}
                            className="w-full bg-yellow-500 text-white py-2 px-3 rounded-lg hover:bg-yellow-600 transition-all font-semibold shadow-sm text-xs"
                          >
                            Add Address
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate("/login", { state: "/cart" })}
                            className="w-full bg-accent-100 text-accent-700 py-2 px-3 rounded-lg hover:bg-accent-200 transition-all font-semibold border border-accent-200 text-xs"
                          >
                            Login to Checkout
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Payment Section */}
                  <div className="mt-4">
                    {!clientToken || !auth?.token || !cart?.length ? (
                      <div className="text-center text-primary-600 text-xs py-2 bg-primary-50 rounded-lg">
                        {!auth?.token
                          ? "Please login to proceed with payment"
                          : "Loading payment options..."}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="border border-primary-200 rounded-lg p-3 bg-white">
                          <div className="flex items-center mb-2">
                            <div className="bg-accent-100 p-1 rounded-lg mr-2">
                              <FiCreditCard className="h-4 w-4 text-accent-600" />
                            </div>
                            <h4 className="font-bold text-primary-900 text-xs">
                              Payment Method
                            </h4>
                          </div>
                          <DropIn
                            options={{
                              authorization: clientToken,
                              paypal: {
                                flow: "vault",
                              },
                            }}
                            onInstance={(instance) => setInstance(instance)}
                          />
                        </div>

                        <button
                          onClick={handlePayment}
                          disabled={loading || !instance || !auth?.user?.address}
                          className="w-full bg-accent-100 text-accent-700 py-2 px-3 rounded-lg hover:bg-accent-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs shadow-md border border-accent-200"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-600 mr-2"></div>
                              Processing Payment...
                            </div>
                          ) : (
                            "Complete Payment 🔒"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
