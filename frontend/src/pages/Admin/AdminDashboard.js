import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiUsers,
  FiPackage,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const viewOrders = () => {
    navigate("/dashboard/admin/orders");
  };
  const viewUsers = () => {
    navigate("/dashboard/admin/users");
  };
  const addProduct = () => {
    navigate("/dashboard/admin/create-product");
  };
  const viewCategories = () => {
    navigate("/dashboard/admin/create-category");
  };
  return (
    <Layout title={"Admin Dashboard - BookBuddy"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome back, {auth?.user?.name}! Manage your BookBuddy store.
                </p>
              </div>

              {/* Admin Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Admin Profile */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-100">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <FiShield className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">
                      Administrator Profile
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FiUser className="h-4 w-4 text-gray-500 mr-3" />
                      <span className="text-gray-700">{auth?.user?.name}</span>
                    </div>
                    <div className="flex items-center">
                      <FiMail className="h-4 w-4 text-gray-500 mr-3" />
                      <span className="text-gray-700">{auth?.user?.email}</span>
                    </div>
                    <div className="flex items-center">
                      <FiPhone className="h-4 w-4 text-gray-500 mr-3" />
                      <span className="text-gray-700">{auth?.user?.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <FiPackage className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">
                      Store Overview
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <span className="font-medium text-gray-900">
                        Administrator
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Access Level:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Full Access
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Online
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={addProduct}
                    className="bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <FiPackage className="h-4 w-4" />
                    <span>Add Product</span>
                  </button>
                  <button
                    onClick={viewUsers}
                    className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <FiUsers className="h-4 w-4" />
                    <span>View Users</span>
                  </button>
                  <button
                    onClick={viewOrders}
                    className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    View Orders
                  </button>
                  <button
                    onClick={viewCategories}
                    className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Categories
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
