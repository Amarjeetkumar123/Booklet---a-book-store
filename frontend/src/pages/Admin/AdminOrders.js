import React, { useState, useEffect } from "react";
import axios from "../../config/axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "deliverd",
    "cancel",
  ]);
  const [changeStatus, setCHangeStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      setLoading(true);
      console.log("Fetching orders...");
      console.log("Auth token:", auth?.token ? "Present" : "Missing");
      console.log("User role:", auth?.user?.role);

      const response = await axios.get("/api/v1/auth/all-orders");
      console.log("Full response:", response);
      console.log("Response data:", response.data);
      console.log("Response status:", response.status);

      const { data } = response;

      // The backend returns orders directly as an array
      if (Array.isArray(data)) {
        setOrders(data);
        console.log("✅ Orders set successfully:", data.length, "orders found");

        // Log first order for debugging
        if (data.length > 0) {
          console.log("First order sample:", data[0]);
        }
      } else {
        console.log("❌ Unexpected response format:", typeof data, data);
        setOrders([]);
      }
    } catch (error) {
      console.log("❌ Error fetching orders:", error);
      console.log("Error status:", error.response?.status);
      console.log("Error data:", error.response?.data);
      console.log("Error message:", error.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      console.log("Updating order status:", orderId, "to", value);
      await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      console.log("✅ Order status updated successfully");
      toast.success("Order status updated successfully");
      getOrders();
    } catch (error) {
      console.log("❌ Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };
  return (
    <Layout title={"All Orders - BookBuddy Admin"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-2">
                      All Orders
                    </h1>
                    <p className="text-gray-600">
                      Manage and track customer orders
                    </p>
                  </div>
                  <button
                    onClick={getOrders}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Refresh Orders
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
              ) : orders?.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No orders found
                  </h3>
                  <p className="text-gray-500">
                    Orders will appear here when customers make purchases.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders?.map((o, i) => (
                    <div
                      key={o._id}
                      className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                    >
                      {/* Order Header */}
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-center">
                          <span className="text-sm text-gray-500">Order #</span>
                          <p className="font-semibold text-gray-900">{i + 1}</p>
                        </div>

                        <div className="text-center">
                          <span className="text-sm text-gray-500">Status</span>
                          <div className="mt-1">
                            <Select
                              bordered={false}
                              onChange={(value) => handleChange(o._id, value)}
                              defaultValue={o?.status}
                              className="w-full"
                            >
                              {status.map((s, i) => (
                                <Option key={i} value={s}>
                                  {s}
                                </Option>
                              ))}
                            </Select>
                          </div>
                        </div>

                        <div className="text-center">
                          <span className="text-sm text-gray-500">Buyer</span>
                          <p className="font-semibold text-gray-900">
                            {o?.buyer?.name}
                          </p>
                        </div>

                        <div className="text-center">
                          <span className="text-sm text-gray-500">Date</span>
                          <p className="font-semibold text-gray-900">
                            {moment(o?.createdAt).fromNow()}
                          </p>
                        </div>

                        <div className="text-center">
                          <span className="text-sm text-gray-500">Payment</span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              o?.payment?.success
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {o?.payment?.success ? "Success" : "Failed"}
                          </span>
                        </div>

                        <div className="text-center">
                          <span className="text-sm text-gray-500">Items</span>
                          <p className="font-semibold text-gray-900">
                            {o?.products?.length}
                          </p>
                        </div>
                      </div>

                      {/* Order Products */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Order Items:
                        </h4>
                        {o?.products?.map((p, i) => (
                          <div
                            key={p._id}
                            className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200"
                          >
                            <div className="flex-shrink-0">
                                <img
                                  src={p.imageUrl || "https://placehold.co/120x160?text=No+Image"}
                                alt={p.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm font-medium text-gray-900 truncate">
                                {p.name}
                              </h5>
                              <p className="text-sm text-gray-500 truncate">
                                {p.description.substring(0, 50)}...
                              </p>
                              <p className="text-sm font-semibold text-indigo-600">
                                ${p.price}
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

export default AdminOrders;
