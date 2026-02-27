import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import { useCart } from "../../context/cart";
import { useWishlist } from "../../context/wishlist";
import { useLocationContext } from "../../context/location";
import CartWishlistDrawer from "./CartWishlistDrawer";
import {
  FiChevronDown,
  FiHeart,
  FiHome,
  FiInfo,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiMenu,
  FiNavigation,
  FiShoppingCart,
  FiUser,
  FiX,
} from "react-icons/fi";
import { getRoleLabel, hasAdminAccess } from "../../utils/roleUtils";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const [wishlist] = useWishlist();
  const {
    serviceAreas,
    selectedLocation,
    selectedLocationLabel,
    selectedLocationPincode,
    setSelectedLocation,
    detectCurrentLocation,
    detectingCurrentLocation,
    locationDetectionError,
    loading: locationLoading,
  } = useLocationContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState(null);
  const profileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveDrawer(null);
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isProfileMenuOpen) return undefined;

    const handleClickOutside = (event) => {
      if (!profileMenuRef.current) return;
      if (!profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileMenuOpen]);

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

  const handleDetectLocation = async () => {
    const response = await detectCurrentLocation({ autoSelect: true });
    if (response?.success && response?.matchedArea) {
      toast.success(`Location detected: ${response.matchedArea.label}`);
      return;
    }

    if (response?.success) {
      toast.error("You are outside our current delivery range");
      return;
    }

    toast.error("Unable to detect current location");
  };

  const desktopNavItemClass = ({ isActive }) =>
    `no-underline h-10 px-4 rounded-full inline-flex items-center gap-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-white/85 text-accent-700 border border-accent-200/80 shadow-sm"
        : "text-primary-700 hover:bg-white/70 hover:text-accent-700"
    }`;

  const desktopIconButtonClass = (isActive) =>
    `relative h-10 min-w-[2.5rem] sm:min-w-0 sm:px-3.5 rounded-full inline-flex items-center justify-center sm:justify-start gap-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-white/85 text-accent-700 border border-accent-200/80 shadow-sm"
        : "text-primary-700 hover:bg-white/70 hover:text-accent-700"
    }`;

  const openDrawer = (panel) => {
    setActiveDrawer(panel);
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const userName = auth?.user?.name || "User";
  const userFirstName = userName.split(" ")[0] || "User";
  const userInitial = userName.charAt(0).toUpperCase() || "U";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/60 bg-gradient-to-r from-white/88 via-primary-50/86 to-orange-50/86 backdrop-blur-xl shadow-[0_10px_28px_rgba(85,67,43,0.12)] fx-header-entry">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.74),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(253,186,116,0.22),transparent_48%)]" />
        <div className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="h-16 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link to="/" className="no-underline flex items-center gap-2.5 shrink-0 group">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl border border-white/70 bg-white/82 p-0.5 flex items-center justify-center overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] group-hover:shadow-[0_8px_16px_-10px_rgba(249,115,22,0.65)] transition-all">
              <img
                src={`${process.env.PUBLIC_URL}/images/logo.png`}
                alt="Booklet logo"
                className="h-full w-full object-contain scale-110"
              />
            </div>
            <div className="leading-tight">
              <p className="text-base font-bold text-primary-900 m-0">Booklet</p>
              <p className="text-[11px] text-primary-500 m-0 hidden sm:block">
                Read. Learn. Grow.
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2 min-w-[320px]">
            <label className="flex-1 h-10 rounded-full border border-white/70 bg-white/70 px-3 inline-flex items-center gap-2 text-sm text-primary-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
              <FiMapPin className="h-4 w-4 text-accent-700 shrink-0" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                disabled={locationLoading || serviceAreas.length === 0}
                className="w-full bg-transparent text-sm text-primary-900 focus:outline-none"
              >
                {!selectedLocation && <option value="">Select delivery location</option>}
                {serviceAreas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={detectingCurrentLocation}
              className="h-10 px-3.5 rounded-full border border-accent-200/90 bg-gradient-to-r from-accent-50 to-orange-100 text-accent-700 hover:from-accent-100 hover:to-orange-100 text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              title="Use current location"
            >
              <FiNavigation className="h-3.5 w-3.5" />
              {detectingCurrentLocation ? "Detecting..." : "Detect"}
            </button>
          </div>

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
            <button
              type="button"
              onClick={() => openDrawer("wishlist")}
              className={desktopIconButtonClass(activeDrawer === "wishlist")}
              aria-label="Open wishlist"
            >
              <FiHeart className="h-4.5 w-4.5" />
              <span className="hidden xl:inline">Wishlist</span>
              {wishlist?.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 min-w-[1.25rem] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold inline-flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => openDrawer("cart")}
              className={desktopIconButtonClass(activeDrawer === "cart")}
              aria-label="Open cart"
            >
              <FiShoppingCart className="h-4.5 w-4.5" />
              <span className="hidden xl:inline">Cart</span>
              {cart?.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 min-w-[1.25rem] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold inline-flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Desktop auth */}
            <div className="hidden md:flex items-center">
              {!auth?.user ? (
                <div className="flex items-center gap-1.5">
                  <NavLink
                    to="/login"
                    className="no-underline h-10 px-4 rounded-full border border-accent-200 bg-gradient-to-r from-accent-50 to-orange-100 hover:from-accent-100 hover:to-orange-100 text-accent-700 text-sm font-semibold inline-flex items-center justify-center shadow-sm"
                  >
                    Login
                  </NavLink>
                </div>
              ) : (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                    className={`h-10 pl-1 pr-2.5 rounded-full border inline-flex items-center gap-2 text-primary-700 transition-colors ${
                      isProfileMenuOpen
                        ? "border-accent-200 bg-white/88 text-accent-700 shadow-sm"
                        : "border-transparent hover:border-white/70 hover:bg-white/72 hover:text-accent-700"
                    }`}
                    aria-haspopup="menu"
                    aria-expanded={isProfileMenuOpen}
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent-500 via-accent-400 to-amber-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white/75 shadow-[0_8px_18px_-12px_rgba(249,115,22,0.85)]">
                      {userInitial}
                    </div>
                    <span className="hidden xl:flex flex-col items-start leading-none">
                      <span className="text-[13px] font-semibold text-primary-900">
                        {userFirstName}
                      </span>
                      <span className="mt-0.5 text-[11px] text-primary-500 capitalize">
                        {getRoleLabel(auth?.user?.role)}
                      </span>
                    </span>
                    <FiChevronDown
                      className={`hidden xl:block h-4 w-4 text-primary-500 transition-transform ${
                        isProfileMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`absolute right-0 top-full mt-2 w-60 rounded-2xl border border-white/70 bg-gradient-to-b from-white/95 via-primary-50/90 to-white/95 backdrop-blur-xl shadow-[0_24px_54px_-30px_rgba(60,44,30,0.55)] py-2 z-50 transition-all duration-200 ${
                      isProfileMenuOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-1 pointer-events-none"
                    }`}
                    role="menu"
                  >
                    <div className="px-4 py-2.5 border-b border-primary-100/90">
                      <p className="text-sm font-semibold text-primary-900 truncate m-0">
                        {userName}
                      </p>
                      <p className="text-xs text-primary-500 capitalize m-0 mt-0.5">
                        {getRoleLabel(auth?.user?.role)}
                      </p>
                      <p className="text-[11px] text-primary-400 m-0 mt-0.5 truncate">
                        {auth?.user?.email}
                      </p>
                    </div>
                    <Link
                      to={dashboardPath}
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="no-underline h-9 mx-2 mt-1 px-3 rounded-lg text-sm text-primary-700 hover:bg-white/85 hover:text-accent-700 flex items-center gap-2"
                    >
                      <FiUser className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-[calc(100%-1rem)] h-9 mx-2 mt-1 px-3 rounded-lg text-sm text-red-700 hover:bg-red-50/95 flex items-center gap-2"
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
              onClick={() => {
                setIsMobileMenuOpen((prev) => !prev);
                setIsProfileMenuOpen(false);
              }}
              className="lg:hidden h-10 w-10 rounded-full border border-white/70 bg-white/78 text-primary-700 hover:text-accent-700 hover:border-accent-300 inline-flex items-center justify-center shadow-sm"
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
            <div className="lg:hidden border-t border-white/70 py-3 fx-mobile-menu bg-gradient-to-b from-white/95 via-primary-50/88 to-white/95 backdrop-blur-xl">
              <div className="space-y-1.5">
              <div className="rounded-2xl border border-white/70 bg-white/72 p-2.5 mb-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-500 inline-flex items-center gap-1.5 mb-1.5">
                  <FiMapPin className="h-3.5 w-3.5 text-accent-700" />
                  Delivery Location
                </p>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  disabled={locationLoading || serviceAreas.length === 0}
                  className="w-full h-9 rounded-xl border border-white/80 bg-white/88 px-2.5 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-accent-300"
                >
                  {!selectedLocation && <option value="">Select delivery location</option>}
                  {serviceAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.label}
                    </option>
                  ))}
                </select>
                <div className="mt-1.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={detectingCurrentLocation}
                    className="h-7 px-2.5 rounded-full border border-accent-200 bg-gradient-to-r from-accent-50 to-orange-100 text-accent-700 text-[11px] font-semibold inline-flex items-center gap-1 disabled:opacity-60"
                  >
                    <FiNavigation className="h-3 w-3" />
                    {detectingCurrentLocation ? "Detecting..." : "Use Current"}
                  </button>
                  <p className="text-[11px] text-primary-600 truncate m-0">
                    {selectedLocationLabel}
                    {selectedLocationPincode ? ` • ${selectedLocationPincode}` : ""}
                  </p>
                </div>
                {locationDetectionError && (
                  <p className="mt-1 text-[11px] text-red-600">{locationDetectionError}</p>
                )}
              </div>

              <NavLink
                to="/"
                className={({ isActive }) =>
                  `no-underline h-10 px-3.5 rounded-full inline-flex items-center gap-2 w-full text-sm font-medium ${
                    isActive
                      ? "bg-white/90 text-accent-700"
                      : "text-primary-700 hover:bg-white/70"
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
                  `no-underline h-10 px-3.5 rounded-full inline-flex items-center gap-2 w-full text-sm font-medium ${
                    isActive
                      ? "bg-white/90 text-accent-700"
                      : "text-primary-700 hover:bg-white/70"
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
                  `no-underline h-10 px-3.5 rounded-full inline-flex items-center gap-2 w-full text-sm font-medium ${
                    isActive
                      ? "bg-white/90 text-accent-700"
                      : "text-primary-700 hover:bg-white/70"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiMail className="h-4 w-4" />
                Contact
              </NavLink>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    className="h-10 px-3 rounded-full inline-flex items-center justify-center gap-2 text-sm font-medium text-primary-700 hover:bg-white/70"
                    onClick={() => openDrawer("wishlist")}
                  >
                  <FiHeart className="h-4 w-4" />
                  Wishlist
                  </button>
                  <button
                    type="button"
                    className="h-10 px-3 rounded-full inline-flex items-center justify-center gap-2 text-sm font-medium text-primary-700 hover:bg-white/70"
                    onClick={() => openDrawer("cart")}
                  >
                  <FiShoppingCart className="h-4 w-4" />
                  Cart
                  </button>
                </div>

                {!auth?.user ? (
                  <div className="pt-2 border-t border-primary-100">
                    <NavLink
                      to="/login"
                      className="no-underline h-10 px-3 rounded-full bg-gradient-to-r from-accent-50 to-orange-100 hover:from-accent-100 hover:to-orange-100 border border-accent-200 text-accent-700 text-sm font-semibold inline-flex items-center justify-center w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </NavLink>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-primary-100 space-y-2">
                    <div className="px-3 py-2.5 rounded-2xl border border-white/80 bg-white/80">
                      <p className="text-sm font-semibold text-primary-900 m-0 truncate">
                        {userName}
                      </p>
                      <p className="text-xs text-primary-500 capitalize m-0 mt-0.5">
                        {getRoleLabel(auth?.user?.role)}
                      </p>
                    </div>

                    <Link
                      to={dashboardPath}
                      className="no-underline h-10 px-3.5 rounded-full text-sm font-medium text-primary-700 hover:bg-white/70 inline-flex items-center gap-2 w-full"
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
                      className="h-10 px-3.5 rounded-full text-sm font-medium text-red-700 hover:bg-red-50 inline-flex items-center gap-2 w-full"
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

      <CartWishlistDrawer
        panel={activeDrawer}
        onClose={() => setActiveDrawer(null)}
        onSetPanel={setActiveDrawer}
      />
    </>
  );
};

export default Header;
