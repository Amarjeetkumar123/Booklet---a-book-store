import React, { useEffect, useState } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "../../config/axios";
import {
  FiInfo,
  FiLock,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSave,
  FiShield,
  FiUser,
} from "react-icons/fi";

const inputBaseClass =
  "w-full h-10 rounded-lg border border-primary-200 bg-white px-3 text-sm text-primary-900 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-300";

const Profile = () => {
  const [auth, setAuth] = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const user = auth?.user;
    if (!user) return;

    setName(user?.name || "");
    setPhone(user?.phone || "");
    setEmail(user?.email || "");
    setAddress(user?.address || "");
  }, [auth?.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/api/v1/auth/profile", {
        name,
        email,
        password,
        phone,
        address,
      });

      if (data?.error) {
        toast.error(data?.error);
        return;
      }

      setAuth({ ...auth, user: data?.updatedUser });

      let ls = localStorage.getItem("auth");
      ls = ls ? JSON.parse(ls) : {};
      ls.user = data?.updatedUser;
      localStorage.setItem("auth", JSON.stringify(ls));

      setPassword("");
      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Your Profile - Booklet"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-5 lg:gap-6 items-start lg:h-full">
          <div>
            <UserMenu />
          </div>

          <div className="min-w-0 lg:h-full lg:overflow-y-auto lg:pr-1">
            <div className="relative overflow-hidden p-1 sm:p-2">
              <div className="absolute -top-14 -right-14 h-32 w-32 rounded-full bg-accent-100/60 blur-3xl" />
              <div className="absolute -bottom-16 -left-14 h-36 w-36 rounded-full bg-primary-100/70 blur-3xl" />

              <div className="bg-white border border-primary-200 rounded-2xl shadow-sm p-4 sm:p-5 relative z-10">
                <div className="mb-5 rounded-2xl border border-primary-200 bg-gradient-to-r from-primary-50 via-white to-accent-50 p-4 sm:p-5">
                  <h1 className="text-xl sm:text-2xl font-bold text-primary-900 inline-flex items-center gap-2">
                    <FiUser className="h-5 w-5 text-accent-700" />
                    Profile Settings
                  </h1>
                  <p className="mt-1.5 text-sm text-primary-700">
                    Update your personal details and account security settings.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-primary-600 uppercase tracking-wide inline-flex items-center gap-1 mb-1.5">
                        <FiUser className="h-3.5 w-3.5" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputBaseClass}
                        placeholder="Enter your full name"
                        autoFocus
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-primary-600 uppercase tracking-wide inline-flex items-center gap-1 mb-1.5">
                        <FiPhone className="h-3.5 w-3.5" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputBaseClass}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-primary-600 uppercase tracking-wide inline-flex items-center gap-1 mb-1.5">
                      <FiMail className="h-3.5 w-3.5" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-10 rounded-lg border border-primary-200 bg-primary-100 px-3 text-sm text-primary-500 cursor-not-allowed"
                      placeholder="Enter your email"
                      disabled
                    />
                    <p className="mt-1.5 text-xs text-primary-500 inline-flex items-center gap-1">
                      <FiInfo className="h-3.5 w-3.5" />
                      Email cannot be changed for security reasons.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-primary-600 uppercase tracking-wide inline-flex items-center gap-1 mb-1.5">
                      <FiLock className="h-3.5 w-3.5" />
                      New Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputBaseClass}
                      placeholder="Leave blank to keep current password"
                    />
                    <p className="mt-1.5 text-xs text-primary-500 inline-flex items-center gap-1">
                      <FiShield className="h-3.5 w-3.5" />
                      Use at least 6 characters when updating password.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-primary-600 uppercase tracking-wide inline-flex items-center gap-1 mb-1.5">
                      <FiMapPin className="h-3.5 w-3.5" />
                      Address
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-primary-200 bg-white px-3 py-2 text-sm text-primary-900 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-300 resize-none"
                      placeholder="Enter your full address"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full h-10 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold inline-flex items-center justify-center gap-2"
                    >
                      <FiSave className="h-4 w-4" />
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
