import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiShoppingBag,
  FiEdit3,
  FiBookOpen,
} from "react-icons/fi";
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
    <Layout title={"User Dashboard - Booklet"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <UserMenu />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-primary-200 rounded-2xl shadow-lg p-6 sm:p-8">
              {/* Header */}
              <div className="mb-8 rounded-2xl border border-primary-200 bg-gradient-to-r from-primary-50 to-accent-50 p-6 sm:p-7">
                <h1 className="text-3xl font-bold text-primary-900 mb-2">
                  Welcome back, {auth?.user?.name}!
                </h1>
                <p className="text-primary-700">
                  Manage your account and view your order history
                </p>
              </div>

              {/* User Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Info */}
                <div className="bg-gradient-to-br from-accent-50 to-white rounded-xl p-6 border border-accent-200 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="bg-accent-100 p-3 rounded-full border border-accent-200">
                      <FiUser className="h-6 w-6 text-accent-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-primary-900 ml-3">
                      Profile Information
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FiUser className="h-4 w-4 text-primary-500 mr-3" />
                      <span className="text-primary-700">{auth?.user?.name}</span>
                    </div>
                    <div className="flex items-center">
                      <FiMail className="h-4 w-4 text-primary-500 mr-3" />
                      <span className="text-primary-700">{auth?.user?.email}</span>
                    </div>
                    <div className="flex items-center">
                      <FiMapPin className="h-4 w-4 text-primary-500 mr-3" />
                      <span className="text-primary-700">
                        {auth?.user?.address || "No address provided"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Stats */}
                <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-6 border border-primary-200 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary-100 p-3 rounded-full border border-primary-200">
                      <FiCalendar className="h-6 w-6 text-primary-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-primary-900 ml-3">
                      Account Status
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-primary-600">Account Type:</span>
                      <span className="font-medium text-primary-900">
                        {auth?.user?.role === 1 ? "Admin" : "Customer"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary-600">Member Since:</span>
                      <span className="font-medium text-primary-900">
                        {new Date(auth?.user?.createdAt).toLocaleDateString() ||
                          "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary-600">Status:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-700 border border-accent-200">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-8 border-t border-primary-100">
                <h3 className="text-lg font-semibold text-primary-900 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={orderNavigation}
                    className="h-12 bg-accent-500 text-white py-3 px-4 rounded-lg hover:bg-accent-600 transition-colors font-medium inline-flex items-center justify-center gap-2"
                  >
                    <FiShoppingBag className="h-4 w-4" />
                    View Orders
                  </button>
                  <button
                    onClick={updateProfile}
                    className="h-12 border border-accent-200 bg-accent-50 text-accent-700 py-3 px-4 rounded-lg hover:bg-accent-100 transition-colors font-medium inline-flex items-center justify-center gap-2"
                  >
                    <FiEdit3 className="h-4 w-4" />
                    Update Profile
                  </button>
                  <button
                    onClick={browseBooks}
                    className="h-12 bg-primary-100 text-primary-800 py-3 px-4 rounded-lg hover:bg-primary-200 transition-colors font-medium inline-flex items-center justify-center gap-2 border border-primary-200"
                  >
                    <FiBookOpen className="h-4 w-4" />
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
