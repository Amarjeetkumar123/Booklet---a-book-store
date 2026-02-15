import React from "react";
import { Link } from "react-router-dom";
import { GiSpellBook } from "react-icons/gi";
import { FiHeart, FiMail, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiSend } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-primary-50 via-white to-accent-50 text-primary-900 mt-auto relative overflow-hidden border-t-2 border-accent-200">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-300 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-200 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-8 border-b border-accent-100">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-primary-900">
                <FiMail className="text-accent-500" />
                Subscribe to Our Newsletter
              </h3>
              <p className="text-primary-700">Get the latest books and exclusive offers delivered to your inbox</p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-white border border-accent-200 text-primary-900 placeholder-primary-500 focus:outline-none focus:border-accent-500 focus:bg-primary-50 transition-all text-sm"
              />
              <button className="bg-accent-100 hover:bg-accent-200 px-5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-sm border border-accent-200 text-accent-700 text-sm">
                <FiSend /> Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-3">
                <GiSpellBook className="text-3xl text-accent-500" />
                <span className="text-xl font-bold">
                  Booklet
                </span>
              </div>
              <p className="text-primary-700 mb-4 leading-relaxed text-xs">
                Your trusted companion for discovering amazing books. From bestsellers to hidden gems, we bring the world of literature to your fingertips.
              </p>
              <div className="flex items-center space-x-1 text-primary-700 text-sm">
                <span>Made with</span>
                <FiHeart className="text-accent-500 animate-pulse" />
                <span>for book lovers worldwide</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-base font-semibold mb-3 text-accent-600">Quick Links</h3>
              <ul className="space-y-1.5">
                <li>
                  <Link to="/" className="text-primary-700 hover:text-accent-600 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-accent-500 rounded-full group-hover:w-2 transition-all"></span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-primary-700 hover:text-accent-600 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-accent-500 rounded-full group-hover:w-2 transition-all"></span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="text-primary-700 hover:text-accent-600 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-accent-500 rounded-full group-hover:w-2 transition-all"></span>
                    Categories
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-primary-700 hover:text-accent-600 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-accent-500 rounded-full group-hover:w-2 transition-all"></span>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-base font-semibold mb-3 text-accent-600">Customer Service</h3>
              <ul className="space-y-1.5">
                <li>
                  <Link to="/policy" className="text-primary-700 hover:text-accent-600 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-accent-500 rounded-full group-hover:w-2 transition-all"></span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-primary-700 hover:text-accent-600 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-accent-500 rounded-full group-hover:w-2 transition-all"></span>
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-700 hover:text-accent-600 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-accent-500 rounded-full group-hover:w-2 transition-all"></span>
                    Returns & Refunds
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-700 hover:text-accent-600 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-accent-500 rounded-full group-hover:w-2 transition-all"></span>
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div>
              <h3 className="text-base font-semibold mb-3 text-accent-600">Connect With Us</h3>
              <div className="space-y-2 mb-4">
                <p className="text-primary-700 text-sm flex items-center gap-2">
                  <FiMail className="text-accent-500" />
                  support@booklet.com
                </p>
                <p className="text-primary-700 text-sm">
                  📞 +1 (555) 123-4567
                </p>
                <p className="text-primary-700 text-sm">
                  📍 123 Book Street, Reading City
                </p>
              </div>
              <div className="flex gap-2">
                <a href="#" className="w-9 h-9 bg-accent-100 hover:bg-accent-200 text-accent-600 hover:text-accent-700 rounded-full flex items-center justify-center transition-all hover:scale-110 border border-accent-200 hover:border-accent-300">
                  <FiFacebook className="text-sm" />
                </a>
                <a href="#" className="w-9 h-9 bg-accent-100 hover:bg-accent-200 text-accent-600 hover:text-accent-700 rounded-full flex items-center justify-center transition-all hover:scale-110 border border-accent-200 hover:border-accent-300">
                  <FiTwitter className="text-sm" />
                </a>
                <a href="#" className="w-9 h-9 bg-accent-100 hover:bg-accent-200 text-accent-600 hover:text-accent-700 rounded-full flex items-center justify-center transition-all hover:scale-110 border border-accent-200 hover:border-accent-300">
                  <FiInstagram className="text-sm" />
                </a>
                <a href="#" className="w-9 h-9 bg-accent-100 hover:bg-accent-200 text-accent-600 hover:text-accent-700 rounded-full flex items-center justify-center transition-all hover:scale-110 border border-accent-200 hover:border-accent-300">
                  <FiLinkedin className="text-sm" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-accent-100 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-700 text-sm">
              &copy; {new Date().getFullYear()} Booklet. All rights reserved.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-accent-100 hover:bg-accent-200 text-accent-700 px-4 py-2 rounded-lg text-sm font-medium transition-all border border-accent-200 flex items-center gap-2"
            >
              ↑ Back to Top
            </button>
            <div className="flex gap-6 text-sm text-primary-700">
              <Link to="/policy" className="hover:text-accent-600 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-accent-600 transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="hover:text-accent-600 transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
