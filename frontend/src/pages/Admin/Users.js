import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "../../config/axios";
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
    <Layout title={"All Users - Booklet Admin"}>
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
                <h1 className="text-2xl font-bold text-primary-900 mb-1.5">
                  All Users
                </h1>
                <p className="text-sm text-primary-600">
                  Manage registered users and their information
                </p>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-500 mx-auto"></div>
                  <p className="mt-3 text-sm text-primary-600">Loading users...</p>
                </div>
              ) : users?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-primary-300 text-5xl mb-3">👥</div>
                  <h3 className="text-lg font-semibold text-primary-700 mb-1.5">
                    No users found
                  </h3>
                  <p className="text-sm text-primary-500">
                    User accounts will appear here when people register.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {users?.map((user) => (
                    <div
                      key={user._id}
                      className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-4 border border-primary-200 hover:shadow-md transition-shadow"
                    >
                      {/* User Avatar */}
                      <div className="text-center mb-3.5">
                        <div className="bg-accent-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2.5 border border-accent-200">
                          {user.role === 1 ? (
                            <FiShield className="h-5 w-5 text-accent-600" />
                          ) : (
                            <FiUser className="h-5 w-5 text-accent-600" />
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-primary-900">
                          {user.name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 1
                              ? "bg-accent-100 text-accent-700 border border-accent-200"
                              : "bg-primary-100 text-primary-700 border border-primary-200"
                          }`}
                        >
                          {user.role === 1 ? "Admin" : "Customer"}
                        </span>
                      </div>

                      {/* User Details */}
                      <div className="space-y-2.5">
                        <div className="flex items-center text-sm">
                          <FiMail className="h-4 w-4 text-primary-500 mr-2 flex-shrink-0" />
                          <span className="text-primary-700 truncate">
                            {user.email}
                          </span>
                        </div>

                        {user.phone && (
                          <div className="flex items-center text-sm">
                            <FiPhone className="h-4 w-4 text-primary-500 mr-2 flex-shrink-0" />
                            <span className="text-primary-700">{user.phone}</span>
                          </div>
                        )}

                        {user.address && (
                          <div className="flex items-center text-sm">
                            <FiMapPin className="h-4 w-4 text-primary-500 mr-2 flex-shrink-0" />
                            <span className="text-primary-700 truncate">
                              {user.address}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center text-sm">
                          <FiCalendar className="h-4 w-4 text-primary-500 mr-2 flex-shrink-0" />
                          <span className="text-primary-700">
                            Joined{" "}
                            {moment(user.createdAt).format("MMM DD, YYYY")}
                          </span>
                        </div>
                      </div>

                      {/* User Stats */}
                      <div className="mt-3.5 pt-3.5 border-t border-primary-100">
                        <div className="flex justify-between text-sm">
                          <span className="text-primary-500">Status:</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-700 border border-accent-200">
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
                <div className="mt-6 pt-6 border-t border-primary-100">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-primary-50 rounded-lg p-3.5 text-center border border-primary-200">
                      <div className="text-xl font-bold text-primary-700">
                        {users.length}
                      </div>
                      <div className="text-xs sm:text-sm text-primary-600">
                        Total Users
                      </div>
                    </div>
                    <div className="bg-accent-50 rounded-lg p-3.5 text-center border border-accent-200">
                      <div className="text-xl font-bold text-accent-700">
                        {users.filter((u) => u.role === 1).length}
                      </div>
                      <div className="text-xs sm:text-sm text-accent-600">
                        Admins
                      </div>
                    </div>
                    <div className="bg-primary-100 rounded-lg p-3.5 text-center border border-primary-200">
                      <div className="text-xl font-bold text-primary-800">
                        {users.filter((u) => u.role !== 1).length}
                      </div>
                      <div className="text-xs sm:text-sm text-primary-700">
                        Customers
                      </div>
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
