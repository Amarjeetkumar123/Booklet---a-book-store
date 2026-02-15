import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiShield,
} from "react-icons/fi";
import moment from "moment";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/auth/all-users");
      if (data?.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.log("Error fetching users:", error);
      // If the endpoint doesn't exist, we'll show a message
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getAllUsers();
    }
  }, [auth?.token]);

  return (
    <Layout title={"All Users - BookBuddy Admin"}>
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
                <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-2">
                  All Users
                </h1>
                <p className="text-gray-600">
                  Manage registered users and their information
                </p>
              </div>

              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading users...</p>
                </div>
              ) : users?.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-6xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No users found
                  </h3>
                  <p className="text-gray-500">
                    User accounts will appear here when people register.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users?.map((user) => (
                    <div
                      key={user._id}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                      {/* User Avatar */}
                      <div className="text-center mb-4">
                        <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                          {user.role === 1 ? (
                            <FiShield className="h-8 w-8 text-indigo-600" />
                          ) : (
                            <FiUser className="h-8 w-8 text-indigo-600" />
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 1
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role === 1 ? "Admin" : "Customer"}
                        </span>
                      </div>

                      {/* User Details */}
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <FiMail className="h-4 w-4 text-gray-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 truncate">
                            {user.email}
                          </span>
                        </div>

                        {user.phone && (
                          <div className="flex items-center text-sm">
                            <FiPhone className="h-4 w-4 text-gray-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{user.phone}</span>
                          </div>
                        )}

                        {user.address && (
                          <div className="flex items-center text-sm">
                            <FiMapPin className="h-4 w-4 text-gray-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700 truncate">
                              {user.address}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center text-sm">
                          <FiCalendar className="h-4 w-4 text-gray-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">
                            Joined{" "}
                            {moment(user.createdAt).format("MMM DD, YYYY")}
                          </span>
                        </div>
                      </div>

                      {/* User Stats */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Status:</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Summary Stats */}
              {users?.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {users.length}
                      </div>
                      <div className="text-sm text-blue-600">Total Users</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {users.filter((u) => u.role === 1).length}
                      </div>
                      <div className="text-sm text-purple-600">Admins</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {users.filter((u) => u.role !== 1).length}
                      </div>
                      <div className="text-sm text-green-600">Customers</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
