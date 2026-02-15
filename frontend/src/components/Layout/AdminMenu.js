import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiShield,
  FiGrid,
  FiTag,
  FiPackage,
  FiPlus,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";

const AdminMenu = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
          <FiShield className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Admin Panel</h3>
        <p className="text-sm text-gray-600">Manage your store</p>
      </div>

      <nav className="space-y-2">
        <NavLink
          to="/dashboard/admin"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-purple-100 text-purple-700 border-r-4 border-purple-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <FiGrid className="h-5 w-5" />
          <span className="font-medium">Dashboard</span>
        </NavLink>

        <NavLink
          to="/dashboard/admin/create-category"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-purple-100 text-purple-700 border-r-4 border-purple-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <FiTag className="h-5 w-5" />
          <span className="font-medium">Create Category</span>
        </NavLink>

        <NavLink
          to="/dashboard/admin/create-product"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-purple-100 text-purple-700 border-r-4 border-purple-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <FiPlus className="h-5 w-5" />
          <span className="font-medium">Create Product</span>
        </NavLink>

        <NavLink
          to="/dashboard/admin/products"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-purple-100 text-purple-700 border-r-4 border-purple-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <FiPackage className="h-5 w-5" />
          <span className="font-medium">Products</span>
        </NavLink>

        <NavLink
          to="/dashboard/admin/orders"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-purple-100 text-purple-700 border-r-4 border-purple-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <FiShoppingBag className="h-5 w-5" />
          <span className="font-medium">Orders</span>
        </NavLink>

        <NavLink
          to="/dashboard/admin/users"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-purple-100 text-purple-700 border-r-4 border-purple-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <FiUsers className="h-5 w-5" />
          <span className="font-medium">Users</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminMenu;
