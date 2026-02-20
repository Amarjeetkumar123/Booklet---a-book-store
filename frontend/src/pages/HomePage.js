import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { useWishlist } from "../context/wishlist";
import axios from "../config/axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { FiTruck, FiHeadphones, FiPackage, FiDollarSign, FiChevronRight, FiStar, FiChevronLeft, FiBook, FiCode, FiBriefcase, FiAward, FiTrendingUp, FiSearch, FiUser, FiEye, FiHeart } from "react-icons/fi";
import "../styles/Homepage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [wishlist, setWishlist] = useWishlist();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [currentRecommendedSlide, setCurrentRecommendedSlide] = useState(0);
  const [categoryCount, setCategoryCount] = useState({});
  const [hoveredFeatured, setHoveredFeatured] = useState(null);
  const slideInterval = useRef(null);

  const recommendedSlides = products?.length > 4 ? Math.ceil(products.length / 4) : 1;
  const customerTestimonials = [
    {
      name: "Sarah Mitchell",
      role: "Book Enthusiast",
      avatar: "SM",
      text: "BookBuddy has an amazing collection! I found rare books that I couldn't find anywhere else. The delivery was fast and the packaging was excellent."
    },
    {
      name: "James Davis",
      role: "Regular Customer",
      avatar: "JD",
      text: "The best online bookstore I've ever used. Great prices, excellent customer service, and a user-friendly website. Highly recommended!"
    },
    {
      name: "Emily Parker",
      role: "Avid Reader",
      avatar: "EP",
      text: "I love the variety of books available. From classics to latest releases, they have it all. The website is easy to navigate and checkout is seamless."
    },
    {
      name: "Michael Chen",
      role: "Education Professional",
      avatar: "MC",
      text: "Excellent service and quality. The book recommendations are spot on and I've discovered many new favorites through this platform."
    }
  ];

  // Map category names to icons
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      "Fiction": <FiBook className="w-6 h-6" />,
      "Non-Fiction": <FiAward className="w-6 h-6" />,
      "Science & Technology": <FiCode className="w-6 h-6" />,
      "Business & Economics": <FiBriefcase className="w-6 h-6" />,
      "Self-Help & Motivation": <FiTrendingUp className="w-6 h-6" />,
      "Mystery & Thriller": <FiSearch className="w-6 h-6" />,
      "Biography & Memoir": <FiUser className="w-6 h-6" />,
      "General": <FiBook className="w-6 h-6" />
    };
    return iconMap[categoryName] || <FiBook className="w-6 h-6" />;
  };

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
        // Count products per category
        const counts = {};
        data?.category.forEach(cat => {
          counts[cat._id] = products.filter(p => p.category === cat._id).length;
        });
        setCategoryCount(counts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //get products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-product`);
      setProducts(data.products);
      // Set first 6 as featured for carousel
      setFeaturedBooks(data.products.slice(0, 6));
    } catch (error) {
      console.log(error);
    }
  };

  // Carousel auto-play effect for recommended slider
  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setCurrentRecommendedSlide((prev) => (prev + 1) % recommendedSlides);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(slideInterval.current);
  }, [recommendedSlides]);

  // Carousel auto-play effect - NOT USED FOR TOP (keeping for reference)
  const nextRecommendedSlide = () => {
    setCurrentRecommendedSlide((prev) => (prev + 1) % recommendedSlides);
    resetAutoPlay();
  };

  const prevRecommendedSlide = () => {
    setCurrentRecommendedSlide((prev) => (prev - 1 + recommendedSlides) % recommendedSlides);
    resetAutoPlay();
  };

  const resetAutoPlay = (type = "recommended") => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
    
    if (type === "recommended") {
      slideInterval.current = setInterval(() => {
        setCurrentRecommendedSlide((prev) => (prev + 1) % recommendedSlides);
      }, 5000);
    }
  };
  return (
    <Layout title={"All Products - Best offers "}>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-100 rounded-full opacity-20 -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-100 rounded-full opacity-20 -ml-40 -mb-40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="bg-accent-100 text-accent-700 px-4 py-2 rounded-full text-sm font-semibold border border-accent-200">
                  📚 Discover Amazing Books
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-900 leading-tight">
                Find Your Next
                <span className="block text-accent-500">Favorite Book</span>
              </h1>
              <p className="text-lg text-primary-700">
                Discover thousands of books across all genres. Your next adventure awaits.
              </p>
              
              {/* Search Bar */}
              <div className="flex gap-2 bg-white rounded-lg shadow-lg p-1">
                <input
                  type="text"
                  placeholder="Search books, authors..."
                  className="flex-1 px-4 py-2 outline-none text-primary-900 placeholder-primary-400"
                />
                <button className="bg-accent-100 text-accent-700 px-6 py-2 rounded-lg hover:bg-accent-200 transition-colors font-medium border border-accent-200">
                  <FiSearch className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/categories")}
                  className="bg-accent-100 text-accent-700 px-8 py-3 rounded-lg hover:bg-accent-200 transition-all font-medium shadow-sm border border-accent-200 inline-flex items-center gap-2 group"
                >
                  Explore Now
                  <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/categories")}
                  className="border-2 border-accent-300 text-accent-600 px-8 py-3 rounded-lg hover:bg-accent-50 transition-all font-medium"
                >
                  Browse Categories
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-3 gap-4">
                {featuredBooks.slice(0, 3).map((book, idx) => (
                  <div
                    key={idx}
                    className={`relative cursor-pointer group ${
                      idx === 1 ? "transform scale-110 z-10" : "opacity-90"
                    }`}
                    onMouseEnter={() => setHoveredFeatured(idx)}
                    onMouseLeave={() => setHoveredFeatured(null)}
                  >
                    <div className="bg-white rounded-xl shadow-2xl p-3 hover:shadow-3xl transition-all">
                      <img
                        src={book.imageUrl || `https://placehold.co/300x400/f5f0e8/826b4d?text=${encodeURIComponent(book.name)}`}
                        alt={book.name}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      {hoveredFeatured === idx && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl flex items-center justify-center group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => navigate(`/product/${book.slug}`)}
                            className="flex items-center gap-2 bg-accent-100 text-accent-700 px-4 py-2 rounded-lg hover:bg-accent-200 transition-colors font-medium border border-accent-200"
                          >
                            <FiEye className="w-5 h-5" /> Quick View
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="h-1 bg-gradient-to-r from-primary-50 via-accent-200 to-primary-50"></div>

      {/* Top Sellers - Grid Layout */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary-900">🔥 Top Sellers</h2>
              <p className="text-primary-600 mt-2">Most loved books by thousands of readers</p>
            </div>
            <button
              onClick={() => navigate("/categories")}
              className="hidden md:flex items-center gap-2 text-accent-600 hover:text-accent-700 font-medium text-sm bg-accent-100 px-4 py-2 rounded-lg hover:bg-accent-200 transition-all"
            >
              View More <FiChevronRight />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {products?.slice(0, 5).map((p, idx) => (
              <div
                key={p._id}
                onClick={() => navigate(`/product/${p.slug}`)}
                className="bg-gradient-to-br from-primary-50 to-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group border border-primary-100 h-full flex flex-col"
              >
                <div className="relative overflow-hidden h-48 flex-shrink-0">
                  <img
                    src={p.imageUrl || `https://placehold.co/300x400/f5f0e8/826b4d?text=${encodeURIComponent(p.name)}`}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
                    #{idx + 1}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white text-xs font-bold">
                    {((Math.random() * 30) + 10).toFixed(0)}% OFF
                  </div>
                </div>
                <div className="p-3 flex-grow flex flex-col">
                  <h3 className="font-semibold text-primary-900 text-xs line-clamp-2 mb-1 h-8">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-3 h-3 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="text-xs text-primary-600">(425)</span>
                  </div>
                  <span className="text-lg font-bold text-accent-600 mb-auto">
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="h-1 bg-gradient-to-r from-primary-50 via-accent-200 to-primary-50"></div>

      {/* New Arrivals - Compact Grid */}
      <div className="py-12 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary-900">✨ New Arrivals</h2>
              <p className="text-primary-600 mt-2">Freshly added to our collection</p>
            </div>
            <button
              onClick={() => navigate("/categories")}
              className="hidden md:flex items-center gap-2 text-accent-600 hover:text-accent-700 font-medium text-sm bg-accent-100 px-4 py-2 rounded-lg hover:bg-accent-200 transition-all"
            >
              View All <FiChevronRight />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {products?.slice(5, 11).map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/product/${p.slug}`)}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group border border-primary-100"
              >
                <div className="relative overflow-hidden h-40">
                  <img
                    src={p.imageUrl || `https://placehold.co/300x400/f5f0e8/826b4d?text=${encodeURIComponent(p.name)}`}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-1 right-1 bg-accent-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-md">
                    NEW
                  </div>
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-primary-900 text-xs line-clamp-1 mb-1">
                    {p.name}
                  </h3>
                  <span className="text-sm font-bold text-accent-600">
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="h-1 bg-gradient-to-r from-primary-50 via-accent-200 to-primary-50"></div>

      {/* Categories Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary-900">
                Browse by Category
              </h2>
              <p className="text-primary-600 mt-1">Explore all book genres and find what interests you</p>
            </div>
            <button
              onClick={() => navigate("/categories")}
              className="flex items-center gap-2 text-accent-500 hover:text-accent-600 font-medium"
            >
              See all <FiChevronRight />
            </button>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {categories?.slice(0, 8).map((c) => (
              <div
                key={c._id}
                onClick={() => navigate(`/category/${c.slug}`)}
                className="bg-primary-50 hover:bg-accent-50 rounded-lg p-3 text-center cursor-pointer transition-all hover:shadow-md group border border-transparent hover:border-accent-200"
              >
                <div className="bg-accent-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:bg-accent-200 transition-all shadow-sm border border-accent-200">
                  <span className="text-accent-700 text-xl">{getCategoryIcon(c.name)}</span>
                </div>
                <h3 className="font-medium text-sm text-primary-900 line-clamp-2">{c.name}</h3>
                <p className="text-xs text-primary-500 bg-primary-100 inline-block px-2 py-0.5 rounded-full mt-1">{categoryCount[c._id] || 0} books</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="h-1 bg-gradient-to-r from-primary-50 via-accent-200 to-primary-50"></div>

      {/* Recommended For You - Slider */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary-900">💡 Recommended For You</h2>
              <p className="text-primary-600 mt-2">Handpicked selections based on your taste</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={prevRecommendedSlide}
                className="p-2 hover:bg-accent-100 hover:text-accent-700 text-accent-600 rounded-full transition-all border border-accent-200 hover:border-accent-300"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextRecommendedSlide}
                className="p-2 hover:bg-accent-100 hover:text-accent-700 text-accent-600 rounded-full transition-all border border-accent-200 hover:border-accent-300"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="flex gap-3 transition-transform duration-500" style={{
              transform: `translateX(-${currentRecommendedSlide * (100/4)}%)`
            }}>
              {products?.map((p) => (
                <div
                  key={p._id}
                  className="flex-shrink-0 w-full md:w-1/4 h-[420px] bg-gradient-to-br from-white to-primary-50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border border-primary-100 flex flex-col"
                >
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={p.imageUrl || `https://placehold.co/300x400/f5f0e8/826b4d?text=${encodeURIComponent(p.name)}`}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-accent-100 text-accent-700 px-2 py-1 rounded-full text-xs font-semibold shadow-sm border border-accent-200">
                      ⭐ Pick
                    </div>
                    <div className="absolute top-2 left-2 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold shadow-sm border border-green-200">
                      ✓ Stock
                    </div>
                  </div>
                  <div className="p-3.5 flex flex-col flex-grow">
                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-3.5 h-3.5 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="text-xs text-primary-600 ml-1">4.2★ (128)</span>
                    </div>
                    <h3 className="font-semibold text-primary-900 mb-1.5 line-clamp-2 text-sm h-10">
                      {p.name}
                    </h3>
                    <p className="text-xs text-primary-600 mb-2 line-clamp-2 h-8">
                      {p.description}
                    </p>
                    <div className="mb-3">
                      <span className="text-lg font-bold text-accent-600">
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => navigate(`/product/${p.slug}`)}
                        className="flex-1 bg-primary-100 text-primary-800 py-1.5 px-2.5 rounded-lg hover:bg-primary-200 transition-all text-xs font-medium hover:shadow-sm"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => {
                          const existingItem = wishlist.find(item => item._id === p._id);
                          if (existingItem) {
                            setWishlist(wishlist.filter(item => item._id !== p._id));
                            toast.success("Removed from wishlist");
                          } else {
                            setWishlist([...wishlist, p]);
                            toast.success("Added to wishlist");
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg transition-all text-xs font-medium border ${
                          wishlist.find(item => item._id === p._id)
                            ? "bg-red-100 text-red-700 border-red-300"
                            : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                        }`}
                        title="Add to wishlist"
                      >
                        <FiHeart className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setCart([...cart, p]);
                          localStorage.setItem("cart", JSON.stringify([...cart, p]));
                          toast.success("Item Added to cart");
                        }}
                        className="flex-1 bg-accent-100 text-accent-700 py-1.5 px-2.5 rounded-lg hover:bg-accent-200 transition-all text-xs font-medium border border-accent-200"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="h-1 bg-gradient-to-r from-primary-50 via-accent-200 to-primary-50"></div>

      {/* Bestselling Authors */}
      <div className="py-8 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-primary-900">⭐ Bestselling Authors</h2>
            <p className="text-primary-600 text-sm mt-1">World-class authors you'll love</p>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {/* Stephen King */}
            <div
              onClick={() => navigate("/categories")}
              className="bg-primary-50 hover:bg-accent-50 rounded-lg p-3 text-center cursor-pointer transition-all hover:shadow-md group border border-transparent hover:border-accent-200"
            >
              <div className="bg-accent-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:bg-accent-200 transition-all shadow-sm border border-accent-200">
                <span className="text-accent-700 text-sm font-bold">SK</span>
              </div>
              <h3 className="font-medium text-sm text-primary-900 line-clamp-2">Stephen King</h3>
              <p className="text-xs text-primary-600 mt-1">Horror</p>
            </div>

            {/* J.K. Rowling */}
            <div
              onClick={() => navigate("/categories")}
              className="bg-primary-50 hover:bg-accent-50 rounded-lg p-3 text-center cursor-pointer transition-all hover:shadow-md group border border-transparent hover:border-accent-200"
            >
              <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:bg-purple-200 transition-all shadow-sm border border-purple-200">
                <span className="text-purple-700 text-sm font-bold">JR</span>
              </div>
              <h3 className="font-medium text-sm text-primary-900 line-clamp-2">J.K. Rowling</h3>
              <p className="text-xs text-primary-600 mt-1">Fantasy</p>
            </div>

            {/* Agatha Christie */}
            <div
              onClick={() => navigate("/categories")}
              className="bg-primary-50 hover:bg-accent-50 rounded-lg p-3 text-center cursor-pointer transition-all hover:shadow-md group border border-transparent hover:border-accent-200"
            >
              <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:bg-red-200 transition-all shadow-sm border border-red-200">
                <span className="text-red-700 text-sm font-bold">AC</span>
              </div>
              <h3 className="font-medium text-sm text-primary-900 line-clamp-2">Agatha Christie</h3>
              <p className="text-xs text-primary-600 mt-1">Mystery</p>
            </div>

            {/* George R.R. Martin */}
            <div
              onClick={() => navigate("/categories")}
              className="bg-primary-50 hover:bg-accent-50 rounded-lg p-3 text-center cursor-pointer transition-all hover:shadow-md group border border-transparent hover:border-accent-200"
            >
              <div className="bg-yellow-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:bg-yellow-200 transition-all shadow-sm border border-yellow-200">
                <span className="text-yellow-700 text-sm font-bold">GM</span>
              </div>
              <h3 className="font-medium text-sm text-primary-900 line-clamp-2">G.R.R. Martin</h3>
              <p className="text-xs text-primary-600 mt-1">Epic</p>
            </div>

            {/* Paulo Coelho */}
            <div
              onClick={() => navigate("/categories")}
              className="bg-primary-50 hover:bg-accent-50 rounded-lg p-3 text-center cursor-pointer transition-all hover:shadow-md group border border-transparent hover:border-accent-200"
            >
              <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:bg-green-200 transition-all shadow-sm border border-green-200">
                <span className="text-green-700 text-sm font-bold">PC</span>
              </div>
              <h3 className="font-medium text-sm text-primary-900 line-clamp-2">Paulo Coelho</h3>
              <p className="text-xs text-primary-600 mt-1">Philosophy</p>
            </div>

            {/* Haruki Murakami */}
            <div
              onClick={() => navigate("/categories")}
              className="bg-primary-50 hover:bg-accent-50 rounded-lg p-3 text-center cursor-pointer transition-all hover:shadow-md group border border-transparent hover:border-accent-200"
            >
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:bg-blue-200 transition-all shadow-sm border border-blue-200">
                <span className="text-blue-700 text-sm font-bold">HM</span>
              </div>
              <h3 className="font-medium text-sm text-primary-900 line-clamp-2">Haruki Murakami</h3>
              <p className="text-xs text-primary-600 mt-1">Surrealism</p>
            </div>

            {/* Yuval Noah Harari */}
            <div
              onClick={() => navigate("/categories")}
              className="bg-primary-50 hover:bg-accent-50 rounded-lg p-3 text-center cursor-pointer transition-all hover:shadow-md group border border-transparent hover:border-accent-200"
            >
              <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:bg-indigo-200 transition-all shadow-sm border border-indigo-200">
                <span className="text-indigo-700 text-sm font-bold">YH</span>
              </div>
              <h3 className="font-medium text-sm text-primary-900 line-clamp-2">Yuval Harari</h3>
              <p className="text-xs text-primary-600 mt-1">Science</p>
            </div>

            {/* Margaret Atwood */}
            <div
              onClick={() => navigate("/categories")}
              className="bg-primary-50 hover:bg-accent-50 rounded-lg p-3 text-center cursor-pointer transition-all hover:shadow-md group border border-transparent hover:border-accent-200"
            >
              <div className="bg-pink-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:bg-pink-200 transition-all shadow-sm border border-pink-200">
                <span className="text-pink-700 text-sm font-bold">MA</span>
              </div>
              <h3 className="font-medium text-sm text-primary-900 line-clamp-2">Margaret Atwood</h3>
              <p className="text-xs text-primary-600 mt-1">Dystopian</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="h-1 bg-gradient-to-r from-primary-50 via-accent-200 to-primary-50"></div>

      {/* Customer Testimonials */}
      <div className="py-12 bg-gradient-to-br from-accent-50 via-white to-primary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-primary-900 mb-2">
              ⭐ Customer Reviews
            </h2>
            <p className="text-primary-600">
              Join 10K+ happy readers who trust Booklet
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {customerTestimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-accent-100 hover:border-accent-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md border-4 border-accent-100">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-900">{testimonial.name}</h4>
                      <p className="text-sm text-primary-500">{testimonial.role}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-3xl text-accent-200 opacity-50">"</span>
                </div>
                <p className="text-primary-700 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-6 border border-accent-100 text-center hover:shadow-md transition-all">
              <div className="text-4xl font-bold text-accent-600 mb-2">10K+</div>
              <p className="text-primary-600 font-medium text-sm">Happy Customers</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-accent-100 text-center hover:shadow-md transition-all">
              <div className="text-4xl font-bold text-accent-600 mb-2">50K+</div>
              <p className="text-primary-600 font-medium text-sm">Books Sold</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-accent-100 text-center hover:shadow-md transition-all">
              <div className="text-4xl font-bold text-accent-600 mb-2">4.9★</div>
              <p className="text-primary-600 font-medium text-sm">Avg Rating</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-accent-100 text-center hover:shadow-md transition-all">
              <div className="text-4xl font-bold text-accent-600 mb-2">99%</div>
              <p className="text-primary-600 font-medium text-sm">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="h-1 bg-gradient-to-r from-primary-50 via-accent-200 to-primary-50"></div>

      {/* Services Section */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-primary-900 text-center mb-2">Why Choose Booklet?</h2>
          <p className="text-primary-600 text-center mb-12">We provide the best experience for book lovers</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTruck className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="font-bold text-primary-900 mb-2">Free Shipping</h3>
              <p className="text-sm text-primary-600">On orders over $50</p>
            </div>
            <div className="text-center">
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiDollarSign className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="font-bold text-primary-900 mb-2">Money Back</h3>
              <p className="text-sm text-primary-600">30 days guarantee</p>
            </div>
            <div className="text-center">
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeadphones className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="font-bold text-primary-900 mb-2">24/7 Support</h3>
              <p className="text-sm text-primary-600">Dedicated support</p>
            </div>
            <div className="text-center">
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPackage className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="font-bold text-primary-900 mb-2">Secure Payment</h3>
              <p className="text-sm text-primary-600">100% secure payment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="h-1 bg-gradient-to-r from-primary-50 via-accent-200 to-primary-50"></div>

      {/* Explore More - Best of the Rest */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary-900">📚 Explore More</h2>
              <p className="text-primary-600 mt-2">Discover more amazing books in our collection</p>
            </div>
            <button
              onClick={() => navigate("/categories")}
              className="hidden md:flex items-center gap-2 text-accent-600 hover:text-accent-700 font-medium text-sm bg-accent-100 px-4 py-2 rounded-lg hover:bg-accent-200 transition-all"
            >
              Browse All <FiChevronRight />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {products?.slice(11).map((p) => (
              <div
                key={p._id}
                className="bg-gradient-to-br from-primary-50 to-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border border-primary-100"
              >
                <div className="relative overflow-hidden h-40">
                  <img
                    src={p.imageUrl || `https://placehold.co/300x400/f5f0e8/826b4d?text=${encodeURIComponent(p.name)}`}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-0.5 mb-1.5">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-3 h-3 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <h3 className="font-semibold text-primary-900 mb-1 line-clamp-2 text-xs">
                    {p.name}
                  </h3>
                  <p className="text-xs text-primary-600 mb-2 line-clamp-1">
                    {p.description}
                  </p>
                  <div className="mb-2">
                    <span className="text-lg font-bold text-accent-600">
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => navigate(`/product/${p.slug}`)}
                      className="flex-1 bg-primary-100 text-primary-800 py-1.5 px-2 rounded-lg hover:bg-primary-200 transition-all text-xs font-medium hover:shadow-sm"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => {
                        const existingItem = wishlist.find(item => item._id === p._id);
                        if (existingItem) {
                          setWishlist(wishlist.filter(item => item._id !== p._id));
                          toast.success("Removed from wishlist");
                        } else {
                          setWishlist([...wishlist, p]);
                          toast.success("Added to wishlist");
                        }
                      }}
                      className={`px-2 py-1.5 rounded-lg transition-all text-xs font-medium border ${
                        wishlist.find(item => item._id === p._id)
                          ? "bg-red-100 text-red-700 border-red-300"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                      title="Add to wishlist"
                    >
                      <FiHeart className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem("cart", JSON.stringify([...cart, p]));
                        toast.success("Item Added to cart");
                      }}
                      className="flex-1 bg-accent-100 text-accent-700 py-1.5 px-2 rounded-lg hover:bg-accent-200 transition-all text-xs font-medium border border-accent-200"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
