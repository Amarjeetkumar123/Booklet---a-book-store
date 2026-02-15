import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "../../config/axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import {
  FiPackage,
  FiCalendar,
  FiCreditCard,
  FiShoppingBag,
} from "react-icons/fi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);
  return (
    <Layout title={"Your Orders - BookBuddy"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <UserMenu />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-2">
                  My Orders
                </h1>
                <p className="text-gray-600">
                  Track your order history and status
                </p>
              </div>

              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading your orders...</p>
                </div>
              ) : orders?.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No orders found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    You haven't placed any orders yet. Start shopping to see
                    your orders here!
                  </p>
                  <a
                    href="/"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Start Shopping
                  </a>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders?.map((order, index) => (
                    <div
                      key={order._id}
                      className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                    >
                      {/* Order Header */}
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-center">
                          <span className="text-sm text-gray-500">Order #</span>
                          <p className="font-semibold text-gray-900">
                            {index + 1}
                          </p>
                        </div>

                        <div className="text-center">
                          <span className="text-sm text-gray-500">Status</span>
                          <span
                            className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                              order?.status === "Not Process"
                                ? "bg-yellow-100 text-yellow-800"
                                : order?.status === "Processing"
                                ? "bg-blue-100 text-blue-800"
                                : order?.status === "Shipped"
                                ? "bg-purple-100 text-purple-800"
                                : order?.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order?.status}
                          </span>
                        </div>

                        <div className="text-center">
                          <span className="text-sm text-gray-500">Date</span>
                          <p className="font-semibold text-gray-900">
                            {moment(order?.createdAt).format("MMM DD, YYYY")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {moment(order?.createdAt).fromNow()}
                          </p>
                        </div>

                        <div className="text-center">
                          <span className="text-sm text-gray-500">Payment</span>
                          <span
                            className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order?.payment?.success
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            <FiCreditCard className="h-3 w-3 mr-1" />
                            {order?.payment?.success ? "Paid" : "Failed"}
                          </span>
                        </div>

                        <div className="text-center">
                          <span className="text-sm text-gray-500">Items</span>
                          <p className="font-semibold text-gray-900 flex items-center justify-center">
                            <FiShoppingBag className="h-4 w-4 mr-1" />
                            {order?.products?.length}
                          </p>
                        </div>
                      </div>

                      {/* Order Products */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <FiPackage className="h-5 w-5 mr-2" />
                          Order Items:
                        </h4>
                        {order?.products?.map((product) => (
                          <div
                            key={product._id}
                            className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200"
                          >
                            <div className="flex-shrink-0">
                              <img
                                src={product.imageUrl || "https://placehold.co/120x160?text=No+Image"}
                                alt={product.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-lg font-medium text-gray-900 mb-1">
                                {product.name}
                              </h5>
                              <p className="text-sm text-gray-600 mb-2">
                                {product.description.substring(0, 100)}...
                              </p>
                              <p className="text-lg font-semibold text-indigo-600">
                                ${product.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
