import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { useWishlist } from "../context/wishlist";
import axios from "../config/axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { FiChevronRight, FiStar, FiSearch, FiEye, FiHeart, FiX, FiFilter, FiBook } from "react-icons/fi";
import { Prices } from "../components/Price";
import "../styles/Homepage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [wishlist, setWishlist] = useWishlist();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [itemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const observerTarget = useRef(null);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState([0, 9999]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredFeatured, setHoveredFeatured] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
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

  // Get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-product`);
      setProducts(data.products);
      setFilteredProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Filter products based on selected filters
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by price
    filtered = filtered.filter(p => p.price >= selectedPrice[0] && p.price <= selectedPrice[1]);

    // Filter by rating
    if (selectedRating > 0) {
      filtered = filtered.filter(p => p.rating >= selectedRating);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
    setDisplayProducts(filtered.slice(0, itemsPerPage));
  }, [selectedCategory, selectedPrice, selectedRating, products, itemsPerPage]);

  // Load more products
  const loadMore = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newItems = filteredProducts.slice(0, endIndex);
      
      setDisplayProducts(newItems);
      setCurrentPage(nextPage);
      setHasMore(endIndex < filteredProducts.length);
      setLoading(false);
    }, 500);
  }, [currentPage, filteredProducts, itemsPerPage]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMore();
      }
    }, { threshold: 0.1 });

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasMore, loading, loadMore]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedPrice([0, 9999]);
    setSelectedRating(0);
  };

  return (
    <Layout title={"All Products - Best offers "}>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-100 rounded-full opacity-20 -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-100 rounded-full opacity-20 -ml-40 -mb-40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
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

            {/* Featured Books Carousel */}
            <div className="hidden md:flex justify-center items-center">
              <div className="relative w-full">
                <div className="grid grid-cols-3 gap-4">
                  {products.slice(0, 3).map((book, idx) => (
                    <div
                      key={idx}
                      className={`relative cursor-pointer group transition-all duration-300 ${
                        idx === 1 ? "transform scale-110 z-10" : "opacity-90 hover:opacity-100"
                      }`}
                      onMouseEnter={() => setHoveredFeatured(idx)}
                      onMouseLeave={() => setHoveredFeatured(null)}
                    >
                      <div className="bg-white rounded-xl shadow-2xl p-3 hover:shadow-3xl transition-all">
                        {book.imageUrl ? (
                          <img
                            src={book.imageUrl}
                            alt={book.name}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg flex items-center justify-center border border-primary-200">
                            <span className="text-primary-400 text-sm font-medium">No image available</span>
                          </div>
                        )}
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
      </div>

      {/* Main Content Area with Sidebar Filter */}
      <div className="min-h-screen bg-primary-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            {/* Sidebar Filter - Desktop */}
            <div className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
              <div className="bg-white rounded-xl shadow-md border border-primary-100 sticky top-20 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin scrollbar-thumb-accent-500 scrollbar-track-transparent"
                style={{
                  scrollbarColor: '#d4a574 transparent',
                  scrollbarWidth: 'thin'
                }}
              >
                {/* Collapse Toggle Button */}
                <div className={`p-4 border-b border-primary-100 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                  {!sidebarCollapsed && <h3 className="text-lg font-bold text-primary-900">Filters</h3>}
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="text-accent-600 hover:text-accent-700 transition-colors p-2 hover:bg-primary-50 rounded-lg"
                    title={sidebarCollapsed ? "Expand filters" : "Collapse filters"}
                  >
                    {sidebarCollapsed ? (
                      <FiFilter className="w-5 h-5" />
                    ) : (
                      <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    )}
                  </button>
                </div>

                {!sidebarCollapsed && (
                  <div className="p-6 space-y-6">
                    {/* Reset Button */}
                    <button
                      onClick={handleResetFilters}
                      className="w-full bg-accent-100 text-accent-700 px-4 py-2 rounded-lg hover:bg-accent-200 transition-all font-medium shadow-sm border border-accent-200 text-sm"
                    >
                      Reset All Filters
                    </button>

                    {/* Price Filter */}
                    <div>
                      <h4 className="font-semibold text-primary-900 mb-3 text-sm">Price Range</h4>
                      <div className="space-y-2">
                        {Prices.map((price, idx) => (
                          <label key={idx} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="price"
                              value={JSON.stringify(price.array)}
                              onChange={() => setSelectedPrice(price.array)}
                              checked={selectedPrice[0] === price.array[0] && selectedPrice[1] === price.array[1]}
                              className="w-4 h-4"
                            />
                            <span className="text-sm text-primary-700">{price.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div className="border-t border-primary-100 pt-6">
                      <h4 className="font-semibold text-primary-900 mb-3 text-sm">Category</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-accent-500 scrollbar-track-transparent"
                        style={{
                          scrollbarColor: '#d4a574 transparent',
                          scrollbarWidth: 'thin'
                        }}
                      >
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            value=""
                            onChange={() => setSelectedCategory("")}
                            checked={selectedCategory === ""}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-primary-700">All Categories</span>
                        </label>
                        {categories?.map((cat) => (
                          <label key={cat._id} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="category"
                              value={cat._id}
                              onChange={() => setSelectedCategory(cat._id)}
                              checked={selectedCategory === cat._id}
                              className="w-4 h-4"
                            />
                            <span className="text-sm text-primary-700">{cat.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Rating Filter */}
                    <div className="border-t border-primary-100 pt-6">
                      <h4 className="font-semibold text-primary-900 mb-3 text-sm">Rating</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="rating"
                            value={0}
                            onChange={() => setSelectedRating(0)}
                            checked={selectedRating === 0}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-primary-700">All Ratings</span>
                        </label>
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <label key={rating} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="rating"
                              value={rating}
                              onChange={() => setSelectedRating(rating)}
                              checked={selectedRating === rating}
                              className="w-4 h-4"
                            />
                            <div className="flex items-center gap-1">
                              {[...Array(rating)].map((_, i) => (
                                <FiStar key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                              <span className="text-sm text-primary-700 ml-1">{rating}+ Star</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden fixed bottom-6 left-6 z-40 bg-accent-600 text-white p-4 rounded-full shadow-lg hover:bg-accent-700 transition-all flex items-center justify-center"
              title="Toggle filters"
            >
              <FiFilter className="w-6 h-6" />
            </button>

            {/* Mobile Sidebar Filter */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
                <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl rounded-r-2xl overflow-y-auto p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-primary-900">Filters</h3>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="text-accent-600 hover:text-accent-700"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Price Filter */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-primary-900 mb-3 text-sm">Price Range</h4>
                    <div className="space-y-2">
                      {Prices.map((price, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="price-mobile"
                            value={JSON.stringify(price.array)}
                            onChange={() => setSelectedPrice(price.array)}
                            checked={selectedPrice[0] === price.array[0] && selectedPrice[1] === price.array[1]}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-primary-700">{price.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-6 border-t border-primary-100 pt-6">
                    <h4 className="font-semibold text-primary-900 mb-3 text-sm">Category</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-accent-500 scrollbar-track-transparent"
                      style={{
                        scrollbarColor: '#d4a574 transparent',
                        scrollbarWidth: 'thin'
                      }}
                    >
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="category-mobile"
                          value=""
                          onChange={() => {
                            setSelectedCategory("");
                            setSidebarOpen(false);
                          }}
                          checked={selectedCategory === ""}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-primary-700">All Categories</span>
                      </label>
                      {categories?.map((cat) => (
                        <label key={cat._id} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="category-mobile"
                            value={cat._id}
                            onChange={() => {
                              setSelectedCategory(cat._id);
                              setSidebarOpen(false);
                            }}
                            checked={selectedCategory === cat._id}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-primary-700">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div className="border-t border-primary-100 pt-6">
                    <h4 className="font-semibold text-primary-900 mb-3 text-sm">Rating</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="rating-mobile"
                          value={0}
                          onChange={() => {
                            setSelectedRating(0);
                            setSidebarOpen(false);
                          }}
                          checked={selectedRating === 0}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-primary-700">All Ratings</span>
                      </label>
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="rating-mobile"
                            value={rating}
                            onChange={() => {
                              setSelectedRating(rating);
                              setSidebarOpen(false);
                            }}
                            checked={selectedRating === rating}
                            className="w-4 h-4"
                          />
                          <div className="flex items-center gap-1">
                            {[...Array(rating)].map((_, i) => (
                              <FiStar key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="text-sm text-primary-700 ml-1">{rating}+ Star</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleResetFilters();
                      setSidebarOpen(false);
                    }}
                    className="w-full mt-6 bg-primary-100 text-primary-800 py-2 rounded-lg hover:bg-primary-200 transition-all font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="flex-1">
              {/* Count Header */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-sm md:text-base text-primary-700 font-medium">
                  Showing <span className="font-bold text-primary-900">{displayProducts.length}</span> of <span className="font-bold text-primary-900">{filteredProducts.length}</span> books
                </h2>
              </div>

              {displayProducts?.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {displayProducts.map((p) => (
                      <div
                        key={p._id}
                        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border border-primary-100 flex flex-col"
                      >
                        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center border border-primary-200">
                              <span className="text-primary-400 text-sm font-medium">No image available</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex-grow flex flex-col">
                          <h3 className="text-sm font-semibold text-primary-900 line-clamp-2 mb-2 h-9">
                            {p.name}
                          </h3>
                          <p className="text-xs text-primary-600 line-clamp-2 mb-2 flex-grow">
                            {p.description}
                          </p>
                          
                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={`w-3 h-3 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                            <span className="text-xs text-primary-600 ml-1">(128)</span>
                          </div>

                          {/* Price */}
                          <div className="mb-3">
                            <span className="text-lg font-bold text-accent-600">
                              ₹{p.price.toLocaleString("en-IN")}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-auto">
                            <button
                              onClick={() => navigate(`/product/${p.slug}`)}
                              className="flex-1 bg-primary-100 text-primary-800 py-2 px-2 rounded-lg hover:bg-primary-200 transition-all text-xs font-medium hover:shadow-sm whitespace-nowrap"
                            >
                              View
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
                              className={`flex-1 flex items-center justify-center py-2 px-2 rounded-lg transition-all text-xs font-medium border ${
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
                              className="flex-1 bg-accent-100 text-accent-700 py-2 px-2 rounded-lg hover:bg-accent-200 transition-all text-xs font-medium border border-accent-200 whitespace-nowrap"
                            >
                              Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Loader and Observer Target */}
                  {loading && (
                    <div className="flex justify-center items-center py-8 mt-8">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-accent-600 rounded-full animate-bounce" style={{animationDelay: "0s"}}></div>
                        <div className="w-3 h-3 bg-accent-600 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                        <div className="w-3 h-3 bg-accent-600 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                      </div>
                    </div>
                  )}

                  {hasMore && (
                    <div ref={observerTarget} className="h-10 mt-8 flex items-center justify-center">
                      <p className="text-sm text-primary-600">Scroll down to load more...</p>
                    </div>
                  )}

                  {!hasMore && displayProducts.length > 0 && (
                    <div className="text-center py-8 mt-8 bg-primary-50 rounded-xl">
                      <p className="text-sm text-primary-600 font-medium">
                        You've reached the end! ({filteredProducts.length} books total)
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-md">
                  <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiBook className="h-8 w-8 text-accent-600" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-primary-900 mb-2">
                    No books found
                  </h3>
                  <p className="text-xs text-primary-600 mb-6">
                    Try adjusting your filters to find what you're looking for
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="bg-accent-100 text-accent-700 px-6 py-2 rounded-lg hover:bg-accent-200 transition-all font-semibold border border-accent-200"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
