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
  const statusOptions = [
    "Not Process",
    "Processing",
    "Shipped",
    "deliverd",
    "cancel",
  ];
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/auth/all-orders");
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
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

  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      toast.success("Order status updated successfully");
      getOrders();
    } catch (error) {
      console.log("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };
  return (
    <Layout title={"All Orders - Booklet Admin"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-5 lg:gap-6 items-start lg:h-full">
          {/* Sidebar */}
          <div>
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="min-w-0 lg:h-full lg:overflow-y-auto lg:pr-1">
            <div className="p-1 sm:p-2">
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-primary-900 mb-1.5">
                      All Orders
                    </h1>
                    <p className="text-sm text-primary-600">
                      Manage and track customer orders
                    </p>
                  </div>
                  <button
                    onClick={getOrders}
                    className="h-10 px-4 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold transition-colors"
                  >
                    Refresh Orders
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-500 mx-auto"></div>
                  <p className="mt-3 text-sm text-primary-600">
                    Loading orders...
                  </p>
                </div>
              ) : orders?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-primary-300 text-5xl mb-3">📦</div>
                  <h3 className="text-lg font-semibold text-primary-700 mb-1.5">
                    No orders found
                  </h3>
                  <p className="text-sm text-primary-500">
                    Orders will appear here when customers make purchases.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders?.map((o, i) => (
                    <div
                      key={o._id}
                      className="bg-primary-50 rounded-xl p-4 border border-primary-200"
                    >
                      {/* Order Header */}
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4 p-3 bg-white rounded-lg border border-primary-100">
                        <div className="text-center">
                          <span className="text-xs text-primary-500">
                            Order #
                          </span>
                          <p className="text-sm font-semibold text-primary-900">
                            {i + 1}
                          </p>
                        </div>

                        <div className="text-center">
                          <span className="text-xs text-primary-500">Status</span>
                          <div className="mt-1">
                            <Select
                              bordered={false}
                              onChange={(value) => handleChange(o._id, value)}
                              defaultValue={o?.status}
                              size="middle"
                              className="w-full"
                            >
                              {statusOptions.map((s, i) => (
                                <Option key={i} value={s}>
                                  {s}
                                </Option>
                              ))}
                            </Select>
                          </div>
                        </div>

                        <div className="text-center">
                          <span className="text-xs text-primary-500">Buyer</span>
                          <p className="text-sm font-semibold text-primary-900">
                            {o?.buyer?.name}
                          </p>
                        </div>

                        <div className="text-center">
                          <span className="text-xs text-primary-500">Date</span>
                          <p className="text-sm font-semibold text-primary-900">
                            {moment(o?.createdAt).fromNow()}
                          </p>
                        </div>

                        <div className="text-center">
                          <span className="text-xs text-primary-500">
                            Payment
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              o?.payment?.success
                                ? "bg-accent-100 text-accent-700 border border-accent-200"
                                : "bg-red-100 text-red-700 border border-red-200"
                            }`}
                          >
                            {o?.payment?.success ? "Success" : "Failed"}
                          </span>
                        </div>

                        <div className="text-center">
                          <span className="text-xs text-primary-500">Items</span>
                          <p className="text-sm font-semibold text-primary-900">
                            {o?.products?.length}
                          </p>
                        </div>
                      </div>

                      {/* Order Products */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-primary-900 mb-1">
                          Order Items:
                        </h4>
                        {o?.products?.map((p) => (
                          <div
                            key={p._id}
                            className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-primary-100"
                          >
                            <div className="flex-shrink-0">
                              <img
                                src={
                                  p.imageUrl ||
                                  "https://placehold.co/120x160?text=No+Image"
                                }
                                alt={p.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm font-medium text-primary-900 truncate">
                                {p.name}
                              </h5>
                              <p className="text-xs sm:text-sm text-primary-600 truncate">
                                {p.description.substring(0, 50)}...
                              </p>
                              <p className="text-sm font-semibold text-accent-700">
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
