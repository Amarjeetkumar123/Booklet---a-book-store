import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { FiUser, FiMail, FiMapPin, FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();

  const orderNavigation = () => {
    navigate("/dashboard/user/orders");
  };
  const browseBooks = () => {
    navigate("/");
  };
  const updateProfile = () => {
    navigate("/dashboard/user/profile");
  };

  return (
    <Layout title={"User Dashboard - BookBuddy"}>
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
                  Welcome back, {auth?.user?.name}!
                </h1>
                <p className="text-gray-600">
                  Manage your account and view your order history
                </p>
              </div>

              {/* User Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Info */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-100">
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <FiUser className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">
                      Profile Information
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
                      <FiMapPin className="h-4 w-4 text-gray-500 mr-3" />
                      <span className="text-gray-700">
                        {auth?.user?.address || "No address provided"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Stats */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <FiCalendar className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">
                      Account Status
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Type:</span>
                      <span className="font-medium text-gray-900">
                        {auth?.user?.role === 1 ? "Admin" : "Customer"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(auth?.user?.createdAt).toLocaleDateString() ||
                          "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={orderNavigation}
                    className="bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    View Orders
                  </button>
                  <button
                    onClick={updateProfile}
                    className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Update Profile
                  </button>
                  <button
                    onClick={browseBooks}
                    className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Browse Books
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

export default Dashboard;
