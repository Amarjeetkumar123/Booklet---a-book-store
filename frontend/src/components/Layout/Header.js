import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import { useCart } from "../../context/cart";
import { useWishlist } from "../../context/wishlist";
import { GiSpellBook } from "react-icons/gi";
import {
  FiChevronDown,
  FiHeart,
  FiHome,
  FiInfo,
  FiLogOut,
  FiMail,
  FiMenu,
  FiShoppingCart,
  FiUser,
  FiX,
} from "react-icons/fi";
import { getRoleLabel, hasAdminAccess } from "../../utils/roleUtils";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const [wishlist] = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
    navigate("/", { replace: true });
  };

  const dashboardPath = hasAdminAccess(auth?.user?.role)
    ? "/dashboard/admin"
    : "/dashboard/user";

  const desktopNavItemClass = ({ isActive }) =>
    `no-underline h-10 px-3.5 rounded-lg inline-flex items-center gap-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-accent-100 text-accent-700 border border-accent-200"
        : "text-primary-700 hover:bg-primary-50 hover:text-accent-700"
    }`;

  const desktopIconLinkClass = ({ isActive }) =>
    `no-underline relative h-10 min-w-[2.5rem] sm:min-w-0 sm:px-3 rounded-lg inline-flex items-center justify-center sm:justify-start gap-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-accent-100 text-accent-700 border border-accent-200"
        : "text-primary-700 hover:bg-primary-50 hover:text-accent-700"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary-200 bg-white/95 backdrop-blur shadow-[0_6px_20px_rgba(85,67,43,0.08)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link to="/" className="no-underline flex items-center gap-2.5 shrink-0 group">
            <div className="h-10 w-10 rounded-xl border border-accent-200 bg-accent-50 text-accent-600 flex items-center justify-center group-hover:bg-accent-100 transition-colors">
              <GiSpellBook className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="text-base font-bold text-primary-900 m-0">Booklet</p>
              <p className="text-[11px] text-primary-500 m-0 hidden sm:block">
                Read. Learn. Grow.
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <NavLink to="/" className={desktopNavItemClass}>
              <FiHome className="h-4 w-4" />
              Home
            </NavLink>

            <NavLink to="/about" className={desktopNavItemClass}>
              <FiInfo className="h-4 w-4" />
              About
            </NavLink>
            <NavLink to="/contact" className={desktopNavItemClass}>
              <FiMail className="h-4 w-4" />
              Contact
            </NavLink>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <NavLink to="/wishlist" className={desktopIconLinkClass}>
              <FiHeart className="h-4.5 w-4.5" />
              <span className="hidden xl:inline">Wishlist</span>
              {wishlist?.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 min-w-[1.25rem] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold inline-flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </NavLink>

            <NavLink to="/cart" className={desktopIconLinkClass}>
              <FiShoppingCart className="h-4.5 w-4.5" />
              <span className="hidden xl:inline">Cart</span>
              {cart?.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 min-w-[1.25rem] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold inline-flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </NavLink>

            {/* Desktop auth */}
            <div className="hidden md:flex items-center">
              {!auth?.user ? (
                <div className="flex items-center gap-1.5">
                  <NavLink
                    to="/login"
                    className="no-underline h-10 px-4 rounded-lg border border-accent-200 bg-accent-50 hover:bg-accent-100 text-accent-700 text-sm font-semibold inline-flex items-center justify-center"
                  >
                    Login
                  </NavLink>
                </div>
              ) : (
                <div className="relative group">
                  <button
                    type="button"
                    className="h-10 px-2.5 rounded-lg inline-flex items-center gap-2 text-primary-700 hover:bg-primary-50 hover:text-accent-700 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-accent-400 to-accent-500 text-white text-xs font-bold flex items-center justify-center">
                      {auth?.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden xl:block text-sm font-medium">
                      {auth?.user?.name?.split(" ")[0]}
                    </span>
                    <FiChevronDown className="hidden xl:block h-4 w-4 group-hover:rotate-180 transition-transform" />
                  </button>

                  <div className="hidden group-hover:block group-focus-within:block absolute right-0 top-full mt-2 w-52 rounded-xl border border-primary-200 bg-white shadow-xl py-2 z-50">
                    <div className="px-3.5 py-2 border-b border-primary-100">
                      <p className="text-sm font-semibold text-primary-900 truncate m-0">
                        {auth?.user?.name}
                      </p>
                      <p className="text-xs text-primary-500 capitalize m-0 mt-0.5">
                        {getRoleLabel(auth?.user?.role)}
                      </p>
                    </div>
                    <Link
                      to={dashboardPath}
                      className="no-underline h-9 px-3.5 text-sm text-primary-700 hover:bg-primary-50 hover:text-accent-700 flex items-center gap-2"
                    >
                      <FiUser className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full h-9 px-3.5 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                    >
                      <FiLogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden h-10 w-10 rounded-lg border border-primary-200 bg-white text-primary-700 hover:text-accent-700 hover:border-accent-300 inline-flex items-center justify-center"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <FiX className="h-5 w-5" />
              ) : (
                <FiMenu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-primary-100 py-3">
            <div className="space-y-1.5">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `no-underline h-10 px-3 rounded-lg inline-flex items-center gap-2 w-full text-sm font-medium ${
                    isActive
                      ? "bg-accent-100 text-accent-700"
                      : "text-primary-700 hover:bg-primary-50"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiHome className="h-4 w-4" />
                Home
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `no-underline h-10 px-3 rounded-lg inline-flex items-center gap-2 w-full text-sm font-medium ${
                    isActive
                      ? "bg-accent-100 text-accent-700"
                      : "text-primary-700 hover:bg-primary-50"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiInfo className="h-4 w-4" />
                About
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `no-underline h-10 px-3 rounded-lg inline-flex items-center gap-2 w-full text-sm font-medium ${
                    isActive
                      ? "bg-accent-100 text-accent-700"
                      : "text-primary-700 hover:bg-primary-50"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiMail className="h-4 w-4" />
                Contact
              </NavLink>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <NavLink
                  to="/wishlist"
                  className={({ isActive }) =>
                    `no-underline h-10 px-3 rounded-lg inline-flex items-center justify-center gap-2 text-sm font-medium ${
                      isActive
                        ? "bg-accent-100 text-accent-700"
                        : "text-primary-700 hover:bg-primary-50"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiHeart className="h-4 w-4" />
                  Wishlist
                </NavLink>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `no-underline h-10 px-3 rounded-lg inline-flex items-center justify-center gap-2 text-sm font-medium ${
                      isActive
                        ? "bg-accent-100 text-accent-700"
                        : "text-primary-700 hover:bg-primary-50"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiShoppingCart className="h-4 w-4" />
                  Cart
                </NavLink>
              </div>

              {!auth?.user ? (
                <div className="pt-2 border-t border-primary-100">
                  <NavLink
                    to="/login"
                    className="no-underline h-10 px-3 rounded-lg bg-accent-50 hover:bg-accent-100 border border-accent-200 text-accent-700 text-sm font-semibold inline-flex items-center justify-center w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                </div>
              ) : (
                <div className="pt-2 border-t border-primary-100 space-y-2">
                  <div className="px-3 py-2.5 rounded-lg border border-accent-200 bg-accent-50">
                    <p className="text-sm font-semibold text-primary-900 m-0 truncate">
                      {auth?.user?.name}
                    </p>
                    <p className="text-xs text-primary-500 capitalize m-0 mt-0.5">
                      {getRoleLabel(auth?.user?.role)}
                    </p>
                  </div>

                  <Link
                    to={dashboardPath}
                    className="no-underline h-10 px-3 rounded-lg text-sm font-medium text-primary-700 hover:bg-primary-50 inline-flex items-center gap-2 w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FiUser className="h-4 w-4" />
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="h-10 px-3 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 inline-flex items-center gap-2 w-full"
                  >
                    <FiLogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
