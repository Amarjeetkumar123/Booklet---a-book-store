import React from "react";
import { NavLink } from "react-router-dom";
import { FiUser, FiShoppingBag, FiGrid } from "react-icons/fi";

const UserMenu = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
          <FiGrid className="h-8 w-8 text-indigo-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Dashboard</h3>
        <p className="text-sm text-gray-600">Manage your account</p>
      </div>

      <nav className="space-y-2">
        <NavLink
          to="/dashboard/user"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-indigo-100 text-indigo-700 border-r-4 border-indigo-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <FiGrid className="h-5 w-5" />
          <span className="font-medium">Overview</span>
        </NavLink>

        <NavLink
          to="/dashboard/user/profile"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-indigo-100 text-indigo-700 border-r-4 border-indigo-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <FiUser className="h-5 w-5" />
          <span className="font-medium">Profile</span>
        </NavLink>

        <NavLink
          to="/dashboard/user/orders"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-indigo-100 text-indigo-700 border-r-4 border-indigo-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <FiShoppingBag className="h-5 w-5" />
          <span className="font-medium">Orders</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default UserMenu;
