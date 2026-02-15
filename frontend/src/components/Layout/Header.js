import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { useWishlist } from "../../context/wishlist";
import { GiSpellBook } from "react-icons/gi";
import {
  FiShoppingCart,
  FiUser,
  FiChevronDown,
  FiMenu,
  FiX,
  FiLogOut,
  FiBook,
  FiHome,
  FiHeart,
  FiInfo,
  FiMail,
} from "react-icons/fi";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const [wishlist] = useWishlist();
  const categories = useCategory();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  return (
    <nav className="bg-white shadow-lg border-b border-accent-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group no-underline flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
              <GiSpellBook className="text-3xl text-accent-500 relative" />
            </div>
            <span className="font-bold text-lg text-primary-900">Booklet</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Home Link */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `no-underline flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                  isActive 
                    ? "bg-accent-100 text-accent-600 shadow-sm border border-accent-200" 
                    : "text-primary-700 hover:bg-primary-50 hover:text-accent-600"
                }`
              }
            >
              <FiHome className="text-lg" />
              <span>Home</span>
            </NavLink>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-primary-700 hover:bg-primary-50 hover:text-accent-600 font-semibold transition-all"
              >
                <FiBook className="text-lg" />
                <span>Categories</span>
                <FiChevronDown className="text-sm group-hover:rotate-180 transition-transform" />
              </button>
              <div
                className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 hidden group-hover:block z-50 transition-all"
              >
                <Link
                  to="/categories"
                  className="no-underline flex items-center gap-2 px-4 py-3 text-primary-700 hover:bg-accent-50 hover:text-accent-600 transition-colors font-medium border-b border-gray-100"
                >
                  <FiBook className="text-accent-500" />
                  All Categories
                </Link>
                {categories?.map((c) => (
                  <Link
                    key={c._id}
                    to={`/category/${c.slug}`}
                    className="no-underline block px-4 py-2.5 text-primary-600 hover:bg-accent-50 hover:text-accent-600 transition-colors text-sm hover:pl-6 border-l-4 border-transparent hover:border-accent-500"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* About Us Link */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `no-underline flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                  isActive 
                    ? "bg-accent-100 text-accent-600 shadow-sm border border-accent-200" 
                    : "text-primary-700 hover:bg-primary-50 hover:text-accent-600"
                }`
              }
            >
              <FiInfo className="text-lg" />
              <span>About Us</span>
            </NavLink>

            {/* Contact Link */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `no-underline flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                  isActive 
                    ? "bg-accent-100 text-accent-600 shadow-sm border border-accent-200" 
                    : "text-primary-700 hover:bg-primary-50 hover:text-accent-600"
                }`
              }
            >
              <FiMail className="text-lg" />
              <span>Contact</span>
            </NavLink>
          </div>

          {/* Right Side: Cart and Auth */}
          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `no-underline relative flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all ${
                  isActive
                    ? "bg-accent-100 text-accent-600 border border-accent-200 shadow-sm"
                    : "text-primary-700 hover:bg-primary-50 hover:text-accent-600"
                }`
              }
            >
              <FiHeart className="text-lg" />
              <span className="hidden lg:block text-sm">Wishlist</span>
              {wishlist?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
                  {wishlist.length}
                </span>
              )}
            </NavLink>

            {/* Cart */}
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `no-underline relative flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all ${
                  isActive
                    ? "bg-accent-100 text-accent-600 border border-accent-200 shadow-sm"
                    : "text-primary-700 hover:bg-primary-50 hover:text-accent-600"
                }`
              }
            >
              <FiShoppingCart className="text-lg" />
              <span className="hidden lg:block text-sm">Cart</span>
              {cart?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
                  {cart.length}
                </span>
              )}
            </NavLink>

            {/* Auth - Desktop */}
            <div className="hidden md:flex items-center">
              {!auth?.user ? (
                <div className="flex items-center gap-2">
                  <NavLink
                    to="/login"
                    className="no-underline bg-accent-100 text-accent-700 px-4 py-2 rounded-lg hover:bg-accent-200 transition-all font-semibold hover:scale-105 transform border border-accent-200 shadow-sm text-sm"
                  >
                    Login
                  </NavLink>
                </div>
              ) : (
                <div className="relative group">
                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-primary-700 hover:bg-primary-50 font-semibold transition-all group-hover:text-accent-600"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {auth?.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:block text-xs">{auth?.user?.name?.split(" ")[0]}</span>
                    <FiChevronDown className="text-xs group-hover:rotate-180 transition-transform hidden lg:block" />
                  </button>
                  <div
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 hidden group-hover:block z-50"
                  >
                    <Link
                      to={`/dashboard/${
                        auth?.user?.role === 1 ? "admin" : "user"
                      }`}
                      className="no-underline flex items-center gap-2 px-4 py-3 text-primary-700 hover:bg-accent-50 hover:text-accent-600 transition-colors font-medium border-b border-gray-100"
                    >
                      <FiUser className="text-accent-500" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-3 text-primary-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <FiLogOut className="text-red-500" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-primary-700 hover:text-accent-600 transition-colors p-2"
            >
              {isMobileMenuOpen ? (
                <FiX className="text-3xl" />
              ) : (
                <FiMenu className="text-3xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t-2 border-accent-200 bg-gradient-to-b from-white to-primary-50">
            <div className="px-4 py-6 space-y-3">
              {/* Home Link */}
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `no-underline flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    isActive ? "bg-accent-100 text-accent-700 border border-accent-200" : "text-primary-700 hover:bg-primary-100"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiHome className="text-lg" />
                Home
              </NavLink>

              {/* Categories */}
              <div>
                <button
                  className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-primary-700 hover:bg-primary-100 font-semibold transition-all"
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                >
                  <span className="flex items-center gap-2">
                    <FiBook className="text-accent-500 text-lg" />
                    Categories
                  </span>
                  <FiChevronDown
                    className={`text-sm transition-transform ${
                      isCategoriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isCategoriesOpen && (
                  <div className="mt-2 ml-4 space-y-1 border-l-4 border-accent-300 pl-4">
                    <Link
                      to="/categories"
                      className="no-underline block px-3 py-2.5 text-accent-600 hover:text-accent-700 font-medium rounded hover:bg-accent-50 transition-all"
                      onClick={() => {
                        setIsCategoriesOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      All Categories
                    </Link>
                    {categories?.map((c) => (
                      <Link
                        key={c._id}
                        to={`/category/${c.slug}`}
                        className="no-underline block px-3 py-2 text-primary-600 hover:text-accent-600 transition-colors rounded hover:bg-accent-50"
                        onClick={() => {
                          setIsCategoriesOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* About Us Link */}
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `no-underline flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    isActive ? "bg-accent-100 text-accent-700 border border-accent-200" : "text-primary-700 hover:bg-primary-100"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiInfo className="text-lg" />
                About Us
              </NavLink>

              {/* Contact Link */}
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `no-underline flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    isActive ? "bg-accent-100 text-accent-700 border border-accent-200" : "text-primary-700 hover:bg-primary-100"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiMail className="text-lg" />
                Contact
              </NavLink>

              {/* Quick Actions - Wishlist & Cart */}
              <div className="flex gap-3 pt-3">
                <NavLink
                  to="/wishlist"
                  className={({ isActive }) =>
                    `no-underline flex items-center justify-center gap-2 flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                      isActive
                        ? "bg-accent-100 text-accent-700 border border-accent-200"
                        : "text-primary-700 hover:bg-primary-100"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiHeart className="text-lg" />
                  <span>Wishlist</span>
                  {wishlist?.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {wishlist.length}
                    </span>
                  )}
                </NavLink>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `no-underline flex items-center justify-center gap-2 flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                      isActive
                        ? "bg-accent-100 text-accent-700 border border-accent-200"
                        : "text-primary-700 hover:bg-primary-100"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiShoppingCart className="text-lg" />
                  <span>Cart</span>
                  {cart?.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cart.length}
                    </span>
                  )}
                </NavLink>
              </div>

              {/* Auth Links */}
              {!auth?.user ? (
                <div className="space-y-3 pt-4 mt-4 border-t-2 border-primary-200">
                  <NavLink
                    to="/login"
                    className="no-underline block bg-accent-100 text-accent-700 px-4 py-3 rounded-lg hover:bg-accent-200 transition-all font-semibold text-center border border-accent-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                </div>
              ) : (
                <div className="space-y-3 pt-4 mt-4 border-t-2 border-primary-200">
                  <div className="flex items-center gap-3 px-4 py-3 bg-accent-50 rounded-lg border border-accent-200">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-400 to-accent-500 flex items-center justify-center text-white font-bold shadow-sm">
                      {auth?.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-primary-900">{auth?.user?.name}</p>
                      <p className="text-xs text-primary-500 capitalize">{auth?.user?.role === 1 ? "Admin" : "Customer"}</p>
                    </div>
                  </div>
                  <Link
                    to={`/dashboard/${
                      auth?.user?.role === 1 ? "admin" : "user"
                    }`}
                    className="no-underline flex items-center gap-2 px-4 py-3 text-primary-700 hover:bg-accent-50 transition-all rounded-lg font-medium border border-transparent hover:border-accent-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FiUser className="text-accent-500" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-all rounded-lg font-medium border border-transparent hover:border-red-200"
                  >
                    <FiLogOut className="text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
