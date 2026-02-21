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
  FiShoppingBag,
  FiCheckCircle,
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

  const quickActions = [
    {
      label: "Add Product",
      icon: FiPackage,
      onClick: addProduct,
      variant: "accent",
    },
    {
      label: "View Users",
      icon: FiUsers,
      onClick: viewUsers,
      variant: "outlined",
    },
    {
      label: "View Orders",
      icon: FiShoppingBag,
      onClick: viewOrders,
      variant: "primary",
    },
    {
      label: "Categories",
      icon: FiShield,
      onClick: viewCategories,
      variant: "neutral",
    },
  ];

  const actionButtonStyles = {
    accent:
      "bg-accent-500 text-white border-accent-500 hover:bg-accent-600 hover:border-accent-600",
    outlined:
      "bg-accent-50 text-accent-700 border-accent-200 hover:bg-accent-100 hover:border-accent-300",
    primary:
      "bg-primary-100 text-primary-800 border-primary-200 hover:bg-primary-200 hover:border-primary-300",
    neutral:
      "bg-white text-primary-800 border-primary-200 hover:bg-primary-50 hover:border-primary-300",
  };

  return (
    <Layout title={"Admin Dashboard - Booklet"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-5 lg:gap-6 items-start">
          {/* Sidebar */}
          <div>
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="min-w-0">
            <div className="relative overflow-hidden p-1 sm:p-2">
              <div className="absolute -top-14 -right-14 h-36 w-36 rounded-full bg-accent-100/60 blur-3xl" />
              <div className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-primary-100/80 blur-3xl" />

              {/* Header */}
              <div className="relative mb-6 rounded-2xl border border-primary-200 bg-gradient-to-r from-primary-50 via-white to-accent-50 p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-primary-900 mb-1.5">
                      Admin Dashboard
                    </h1>
                    <p className="text-sm text-primary-700">
                      Welcome back, {auth?.user?.name}! Manage your Booklet
                      store with efficient controls.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full lg:w-auto">
                    <div className="rounded-xl border border-primary-200 bg-white/80 px-3 py-2 min-w-[120px]">
                      <p className="text-xs text-primary-500">Role</p>
                      <p className="text-sm font-semibold text-primary-800">
                        Administrator
                      </p>
                    </div>
                    <div className="rounded-xl border border-accent-200 bg-accent-50/80 px-3 py-2 min-w-[120px]">
                      <p className="text-xs text-accent-500">Access</p>
                      <p className="text-sm font-semibold text-accent-700">
                        Full Access
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Info Cards */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Admin Profile */}
                <div className="bg-gradient-to-br from-accent-50 to-white rounded-xl p-4 border border-accent-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-primary-900">
                      Administrator Profile
                    </h3>
                    <div className="bg-accent-100 p-2 rounded-full border border-accent-200">
                      <FiShield className="h-4 w-4 text-accent-600" />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-center">
                      <FiUser className="h-4 w-4 text-primary-500 mr-2" />
                      <span className="text-sm text-primary-700">
                        {auth?.user?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiMail className="h-4 w-4 text-primary-500 mr-2" />
                      <span className="text-sm text-primary-700">
                        {auth?.user?.email || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiPhone className="h-4 w-4 text-primary-500 mr-2" />
                      <span className="text-sm text-primary-700">
                        {auth?.user?.phone || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-4 border border-primary-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-primary-900">
                      Store Overview
                    </h3>
                    <div className="bg-primary-100 p-2 rounded-full border border-primary-200">
                      <FiPackage className="h-4 w-4 text-primary-700" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-primary-600">
                        Store Status
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 border border-primary-200">
                        Online
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-primary-600">Permission</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-700 border border-accent-200">
                        Full Access
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-primary-600">Security</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white text-primary-700 border border-primary-200">
                        <FiCheckCircle className="h-4 w-4 text-accent-500" />
                        Protected
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="relative pt-6 border-t border-primary-100">
                <div className="flex items-center justify-between mb-3.5">
                  <h3 className="text-base font-semibold text-primary-900">
                    Quick Actions
                  </h3>
                  <span className="text-xs sm:text-sm text-primary-500">
                    4 shortcuts
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.label}
                        onClick={action.onClick}
                        className={`h-11 rounded-lg border px-3.5 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all ${actionButtonStyles[action.variant]}`}
                      >
                        <Icon className="h-4 w-4" />
                        {action.label}
                      </button>
                    );
                  })}
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
