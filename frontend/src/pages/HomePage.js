import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { useWishlist } from "../context/wishlist";
import axios from "../config/axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import {
  FiBook,
  FiChevronDown,
  FiChevronRight,
  FiEye,
  FiFilter,
  FiHeart,
  FiSearch,
  FiShoppingCart,
  FiSliders,
  FiStar,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";
import { Prices } from "../components/Price";
import "../styles/Homepage.css";

const DEFAULT_PRICE = [0, 999999];
const SORT_OPTIONS = [
  { value: "newest", label: "Sort: Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [wishlist, setWishlist] = useWishlist();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [itemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(DEFAULT_PRICE);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const observerTarget = useRef(null);
  const sortMenuRef = useRef(null);

  const getProductCategoryId = (product) => {
    if (typeof product?.category === "string") return product.category;
    return product?.category?._id || "";
  };

  const getProductCategoryName = (product) => {
    if (typeof product?.category === "object" && product?.category?.name) {
      return product.category.name;
    }
    return "Uncategorized";
  };

  const getProductRating = (product) => {
    if (typeof product?.rating === "number") return product.rating;
    const seed = Number(product?.price || 0);
    return Number((3 + ((seed % 21) / 10)).toFixed(1)); // 3.0 - 5.0
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count += 1;
    if (selectedCategory) count += 1;
    if (
      selectedPrice[0] !== DEFAULT_PRICE[0] ||
      selectedPrice[1] !== DEFAULT_PRICE[1]
    ) {
      count += 1;
    }
    if (selectedRating > 0) count += 1;
    return count;
  }, [searchQuery, selectedCategory, selectedPrice, selectedRating]);

  const featuredProducts = useMemo(() => products.slice(0, 4), [products]);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-product`);
      const allProducts = data?.products || [];
      setProducts(allProducts);
      setFilteredProducts(allProducts);
      setDisplayProducts(allProducts.slice(0, itemsPerPage));
      setHasMore(allProducts.length > itemsPerPage);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    let filtered = products.filter((product) => {
      const categoryId = getProductCategoryId(product);
      const rating = getProductRating(product);

      const matchesSearch =
        !query ||
        product?.name?.toLowerCase().includes(query) ||
        product?.description?.toLowerCase().includes(query) ||
        getProductCategoryName(product).toLowerCase().includes(query);

      const matchesCategory = !selectedCategory || categoryId === selectedCategory;
      const matchesPrice =
        product?.price >= selectedPrice[0] && product?.price <= selectedPrice[1];
      const matchesRating = selectedRating === 0 || rating >= selectedRating;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "price-low") return Number(a.price || 0) - Number(b.price || 0);
      if (sortBy === "price-high") return Number(b.price || 0) - Number(a.price || 0);
      if (sortBy === "name-asc") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "name-desc") return (b.name || "").localeCompare(a.name || "");
      return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
    setDisplayProducts(filtered.slice(0, itemsPerPage));
    setHasMore(filtered.length > itemsPerPage);
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedPrice,
    selectedRating,
    sortBy,
    itemsPerPage,
  ]);

  const loadMore = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const endIndex = nextPage * itemsPerPage;
      const newItems = filteredProducts.slice(0, endIndex);

      setDisplayProducts(newItems);
      setCurrentPage(nextPage);
      setHasMore(endIndex < filteredProducts.length);
      setLoading(false);
    }, 450);
  }, [currentPage, filteredProducts, itemsPerPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, loading, loadMore]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedPrice(DEFAULT_PRICE);
    setSelectedRating(0);
    setSortBy("newest");
  };

  const toggleWishlist = (product) => {
    const existingItem = wishlist.find((item) => item._id === product._id);
    if (existingItem) {
      setWishlist(wishlist.filter((item) => item._id !== product._id));
      toast.success("Removed from wishlist");
    } else {
      setWishlist([...wishlist, product]);
      toast.success("Added to wishlist");
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    localStorage.setItem("cart", JSON.stringify([...cart, product]));
    toast.success("Item added to cart");
  };

  const isPriceActive = (priceArray) =>
    selectedPrice[0] === priceArray[0] && selectedPrice[1] === priceArray[1];

  const selectedCategoryLabel = useMemo(() => {
    if (!selectedCategory) return "";
    return categories.find((cat) => cat._id === selectedCategory)?.name || "";
  }, [categories, selectedCategory]);

  const selectedPriceLabel = useMemo(() => {
    if (
      selectedPrice[0] === DEFAULT_PRICE[0] &&
      selectedPrice[1] === DEFAULT_PRICE[1]
    ) {
      return "";
    }
    return (
      Prices.find(
        (price) =>
          price.array[0] === selectedPrice[0] &&
          price.array[1] === selectedPrice[1]
      )?.name || ""
    );
  }, [selectedPrice]);

  const selectedSortLabel = useMemo(() => {
    return SORT_OPTIONS.find((option) => option.value === sortBy)?.label || "Sort: Newest";
  }, [sortBy]);

  useEffect(() => {
    if (!sortMenuOpen) return;

    const handleOutsideClick = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setSortMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [sortMenuOpen]);

  const FilterPanel = ({ mobile = false }) => (
    <div className={`space-y-3.5 ${mobile ? "p-5" : "p-4"}`}>
      {activeFiltersCount > 0 && (
        <div className="rounded-xl border border-accent-200 bg-accent-50/70 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-accent-700 mb-2">
            Active Filters
          </p>
          <div className="flex flex-wrap gap-1.5">
            {searchQuery.trim() && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="h-7 px-2 rounded-full border border-accent-200 bg-white text-accent-700 text-[11px] font-medium inline-flex items-center gap-1"
              >
                Search
                <FiX className="h-3 w-3" />
              </button>
            )}
            {selectedCategory && (
              <button
                type="button"
                onClick={() => setSelectedCategory("")}
                className="h-7 px-2 rounded-full border border-accent-200 bg-white text-accent-700 text-[11px] font-medium inline-flex items-center gap-1"
              >
                {selectedCategoryLabel || "Category"}
                <FiX className="h-3 w-3" />
              </button>
            )}
            {selectedPriceLabel && (
              <button
                type="button"
                onClick={() => setSelectedPrice(DEFAULT_PRICE)}
                className="h-7 px-2 rounded-full border border-accent-200 bg-white text-accent-700 text-[11px] font-medium inline-flex items-center gap-1"
              >
                {selectedPriceLabel}
                <FiX className="h-3 w-3" />
              </button>
            )}
            {selectedRating > 0 && (
              <button
                type="button"
                onClick={() => setSelectedRating(0)}
                className="h-7 px-2 rounded-full border border-accent-200 bg-white text-accent-700 text-[11px] font-medium inline-flex items-center gap-1"
              >
                {selectedRating}+ stars
                <FiX className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-primary-200 bg-primary-50/70 p-3">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-primary-500 mb-1.5 block">
          Quick Search
        </label>
        <div className="relative">
          <FiSearch className="h-4 w-4 text-primary-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, category, or keywords"
            className="w-full h-10 rounded-lg border border-primary-200 bg-white pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
          />
        </div>
      </div>

      <div className="rounded-xl border border-primary-200 bg-white p-3">
        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-primary-500 mb-2.5">
          Category
        </h4>
        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedCategory("")}
            className={`h-8 px-2.5 rounded-full text-xs font-medium border transition-colors ${
              selectedCategory === ""
                ? "bg-accent-100 text-accent-700 border-accent-200"
                : "bg-white text-primary-700 border-primary-200 hover:bg-primary-50"
            }`}
          >
            All
          </button>
          {categories?.map((cat) => (
            <button
              key={cat._id}
              type="button"
              onClick={() => setSelectedCategory(cat._id)}
              className={`h-8 px-2.5 rounded-full text-xs font-medium border transition-colors ${
                selectedCategory === cat._id
                  ? "bg-accent-100 text-accent-700 border-accent-200"
                  : "bg-white text-primary-700 border-primary-200 hover:bg-primary-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-primary-200 bg-white p-3">
        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-primary-500 mb-2.5">
          Budget Range
        </h4>
        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedPrice(DEFAULT_PRICE)}
            className={`w-full h-8.5 rounded-lg border text-xs font-medium text-left px-3 transition-colors ${
              isPriceActive(DEFAULT_PRICE)
                ? "bg-accent-100 text-accent-700 border-accent-200"
                : "bg-white text-primary-700 border-primary-200 hover:bg-primary-50"
            }`}
          >
            All prices
          </button>
          {Prices.map((price) => (
            <button
              key={price._id}
              type="button"
              onClick={() => setSelectedPrice(price.array)}
              className={`w-full h-8.5 rounded-lg border text-xs font-medium text-left px-3 transition-colors ${
                isPriceActive(price.array)
                  ? "bg-accent-100 text-accent-700 border-accent-200"
                  : "bg-white text-primary-700 border-primary-200 hover:bg-primary-50"
              }`}
            >
              {price.name}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-primary-200 bg-white p-3">
        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-primary-500 mb-2.5">
          Customer Rating
        </h4>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setSelectedRating(0)}
            className={`w-full h-8.5 rounded-lg border text-xs font-medium text-left px-3 transition-colors ${
              selectedRating === 0
                ? "bg-accent-100 text-accent-700 border-accent-200"
                : "bg-white text-primary-700 border-primary-200 hover:bg-primary-50"
            }`}
          >
            Any rating
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => setSelectedRating(rating)}
              className={`w-full h-8.5 rounded-lg border text-xs font-medium px-3 transition-colors inline-flex items-center justify-between ${
                selectedRating === rating
                  ? "bg-accent-100 text-accent-700 border-accent-200"
                  : "bg-white text-primary-700 border-primary-200 hover:bg-primary-50"
              }`}
            >
              <span className="inline-flex items-center gap-0.5">
                {[...Array(rating)].map((_, i) => (
                  <FiStar key={i} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                ))}
              </span>
              <span>{rating}+</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`grid gap-2 ${mobile ? "grid-cols-2" : "grid-cols-1"}`}>
        <button
          type="button"
          onClick={() => {
            handleResetFilters();
            if (mobile) setSidebarOpen(false);
          }}
          className="w-full h-10 rounded-lg border border-primary-200 bg-primary-100 hover:bg-primary-200 text-primary-800 text-sm font-semibold"
        >
          Clear All
        </button>
        {mobile && (
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="w-full h-10 rounded-lg border border-accent-200 bg-accent-50 hover:bg-accent-100 text-accent-700 text-sm font-semibold"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary-100/70 blur-3xl" />
        <div className="absolute -bottom-16 -right-20 h-72 w-72 rounded-full bg-accent-100/70 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3 py-1.5 text-xs font-semibold text-accent-700">
                <FiTrendingUp className="h-3.5 w-3.5" />
                Fresh arrivals every week
              </div>

              <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-primary-900 leading-tight">
                Discover stories that
                <span className="block text-accent-600">shape your next chapter</span>
              </h1>

              <p className="text-base md:text-lg text-primary-700 max-w-2xl">
                Explore curated books across genres, filter by your preferences,
                and find your perfect read in minutes.
              </p>

              <div className="rounded-xl border border-primary-200 bg-white p-2 shadow-sm flex items-center gap-2 max-w-2xl">
                <div className="relative flex-1">
                  <FiSearch className="h-4.5 w-4.5 text-primary-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search books, descriptions or categories..."
                    className="w-full h-10 rounded-lg border border-transparent bg-transparent pl-10 pr-3 text-sm text-primary-900 focus:outline-none focus:ring-0"
                  />
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="h-9 px-3 rounded-lg border border-primary-200 bg-primary-50 text-primary-700 text-sm font-medium"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate("/categories")}
                  className="h-9 px-4 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold"
                >
                  Browse
                </button>
              </div>

              <div className="pt-1.5 sm:pt-2 max-w-2xl">
                <div className="rounded-2xl border border-primary-200/90 bg-white/95 shadow-sm p-3.5 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-primary-900 inline-flex items-center gap-1.5">
                        <FiTrendingUp className="h-4 w-4 text-accent-700" />
                        Explore Collections
                      </p>
                      <p className="text-xs text-primary-600 mt-0.5 pr-2">
                        Jump into curated categories and trending picks.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => navigate("/categories")}
                        className="h-10 px-4 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm"
                      >
                        <FiBook className="h-4 w-4" />
                        Explore
                        <FiChevronRight className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          handleResetFilters();
                          window.scrollTo({ top: 460, behavior: "smooth" });
                        }}
                        className="hidden md:inline-flex h-10 px-4 rounded-lg border border-primary-200 bg-white hover:bg-primary-50 text-primary-700 text-sm font-semibold items-center justify-center gap-2"
                      >
                        <FiSliders className="h-4 w-4" />
                        Quick Filters
                      </button>
                    </div>
                  </div>

                  <p className="md:hidden mt-2 text-[11px] text-primary-500">
                    Use the floating filter button to refine results.
                  </p>

                  {categories?.length > 0 && (
                    <div className="mt-3.5 -mx-1 px-1 flex gap-2 overflow-x-auto snap-x snap-mandatory sm:flex-wrap sm:overflow-visible pb-0.5">
                      {categories.slice(0, 5).map((cat) => (
                        <button
                          key={cat._id}
                          type="button"
                          onClick={() => navigate(`/category/${cat.slug}`)}
                          className="h-7 px-2.5 shrink-0 snap-start rounded-full border border-accent-200 bg-accent-50 hover:bg-accent-100 text-accent-700 text-xs font-medium"
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3">
                {featuredProducts.slice(0, 4).map((book) => (
                  <button
                    key={book._id}
                    onClick={() => navigate(`/product/${book.slug}`)}
                    className="group text-left rounded-2xl border border-primary-200 bg-white p-2 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="h-40 sm:h-44 rounded-xl overflow-hidden bg-primary-50">
                      <img
                        src={book.imageUrl || book.imageUrls?.[0] || "https://placehold.co/320x420/f5f0e8/826b4d?text=Book"}
                        alt={book.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="pt-2 px-1">
                      <p className="text-xs text-primary-500 truncate">{getProductCategoryName(book)}</p>
                      <p className="text-sm font-semibold text-primary-900 truncate">{book.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-primary-50 pt-8 pb-24 md:pt-10 md:pb-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-5">
            {/* Desktop sidebar */}
            <aside
              className={`hidden lg:block transition-all duration-300 ${
                sidebarCollapsed ? "w-[84px]" : "w-72"
              }`}
            >
              <div className="sticky top-20 rounded-2xl border border-primary-200 bg-white shadow-sm overflow-hidden max-h-[calc(100vh-6rem)] flex flex-col">
                <div className={`h-16 border-b border-primary-100 px-3 pt-3 ${sidebarCollapsed ? "justify-center" : "justify-between"} flex items-center`}>
                  {!sidebarCollapsed && (
                    <div className="min-w-0 py-0.5">
                      <h3 className="text-sm font-semibold text-accent-700">Filters</h3>
                      <p className="text-xs text-primary-500">
                        {activeFiltersCount > 0 ? (
                          <span className="inline-flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                            {activeFiltersCount} filter{activeFiltersCount === 1 ? "" : "s"} applied
                          </span>
                        ) : (
                          "No filters applied"
                        )}
                      </p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setSidebarCollapsed((prev) => !prev)}
                    className="h-9 w-9 rounded-lg border border-primary-200 bg-white hover:bg-primary-50 text-primary-700 inline-flex items-center justify-center"
                  >
                    {sidebarCollapsed ? (
                      <FiFilter className="h-4 w-4" />
                    ) : (
                      <FiX className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {sidebarCollapsed ? (
                  <div className="p-3 space-y-2">
                    <button
                      type="button"
                      onClick={() => setSidebarCollapsed(false)}
                      className="w-full h-10 rounded-lg border border-accent-200 bg-accent-50 text-accent-700 inline-flex items-center justify-center"
                      title="Expand filters"
                    >
                      <FiSliders className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="w-full h-10 rounded-lg border border-primary-200 bg-primary-50 text-primary-700 text-xs font-semibold"
                      title="Reset filters"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto scrollbar-thin">
                    <FilterPanel />
                  </div>
                )}
              </div>
            </aside>

            {/* Content column */}
            <div className="flex-1 min-w-0">
              <div className="mb-4 rounded-xl border border-primary-200 bg-white p-3 sm:p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                  <p className="text-sm text-primary-700">
                    Showing <span className="font-semibold text-primary-900">{displayProducts.length}</span> of <span className="font-semibold text-primary-900">{filteredProducts.length}</span> matching titles
                  </p>

                  <div className="flex items-center gap-2">
                    <div ref={sortMenuRef} className="relative sm:hidden">
                      <button
                        type="button"
                        onClick={() => setSortMenuOpen((prev) => !prev)}
                        className="h-10 min-w-[10.5rem] rounded-lg border border-primary-200 bg-white px-3 text-sm text-primary-800 inline-flex items-center justify-between gap-2"
                      >
                        <span>{selectedSortLabel}</span>
                        <FiChevronDown
                          className={`h-4 w-4 text-primary-500 transition-transform ${
                            sortMenuOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {sortMenuOpen && (
                        <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border border-primary-200 bg-white shadow-lg py-1.5 z-30">
                          {SORT_OPTIONS.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setSortBy(option.value);
                                setSortMenuOpen(false);
                              }}
                              className={`w-full h-9 px-3 text-left text-sm ${
                                sortBy === option.value
                                  ? "bg-accent-50 text-accent-700 font-semibold"
                                  : "text-primary-700 hover:bg-primary-50"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="hidden sm:block h-10 rounded-lg border border-primary-200 bg-white px-3 text-sm text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-300"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {displayProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                    {displayProducts.map((p) => {
                      const rating = getProductRating(p);
                      return (
                        <div
                          key={p._id}
                          className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border border-primary-100 flex flex-col"
                        >
                          <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
                            <img
                              src={p.imageUrl || p.imageUrls?.[0] || "https://placehold.co/300x400/f5f0e8/826b4d?text=No+Image"}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute top-2 left-2 rounded-full bg-white/95 border border-primary-200 px-2 py-0.5 text-[11px] font-semibold text-primary-700">
                              {getProductCategoryName(p)}
                            </div>
                          </div>

                          <div className="p-3.5 flex-grow flex flex-col">
                            <h3 className="text-sm font-semibold text-primary-900 line-clamp-2 mb-1.5 min-h-[2.5rem]">
                              {p.name}
                            </h3>
                            <p className="text-xs text-primary-600 line-clamp-2 mb-2.5 flex-grow">
                              {p.description}
                            </p>

                            <div className="flex items-center gap-1 mb-2.5">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`w-3 h-3 ${i < Math.round(rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                    }`}
                                />
                              ))}
                              <span className="text-xs text-primary-600 ml-1">({rating})</span>
                            </div>

                            <div className="mb-3">
                              <span className="text-lg font-bold text-accent-600">
                                ₹{Number(p.price || 0).toLocaleString("en-IN")}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-auto">
                              <button
                                onClick={() => navigate(`/product/${p.slug}`)}
                                className="h-9 rounded-lg bg-primary-100 text-primary-800 hover:bg-primary-200 transition-all text-xs font-medium flex items-center justify-center gap-1"
                              >
                                <FiEye className="w-4 h-4" />
                                View
                              </button>
                              <button
                                onClick={() => toggleWishlist(p)}
                                className={`h-9 rounded-lg transition-all font-medium border flex items-center justify-center ${
                                  wishlist.find((item) => item._id === p._id)
                                    ? "bg-red-100 text-red-700 border-red-300"
                                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                }`}
                                title="Add to wishlist"
                              >
                                <FiHeart className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => addToCart(p)}
                                className="h-9 rounded-lg bg-accent-100 text-accent-700 hover:bg-accent-200 transition-all text-xs font-medium border border-accent-200 flex items-center justify-center gap-1"
                              >
                                <FiShoppingCart className="w-4 h-4" />
                                Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {loading && (
                    <div className="flex justify-center items-center py-8 mt-6">
                      <div className="flex gap-2">
                        <div
                          className="w-3 h-3 bg-accent-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0s" }}
                        />
                        <div
                          className="w-3 h-3 bg-accent-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <div
                          className="w-3 h-3 bg-accent-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </div>
                    </div>
                  )}

                  {hasMore && (
                    <div ref={observerTarget} className="h-10 mt-8 flex items-center justify-center">
                      <p className="text-sm text-primary-600">Scroll to load more books...</p>
                    </div>
                  )}

                  {!hasMore && displayProducts.length > 0 && (
                    <div className="text-center py-8 mt-8 bg-white border border-primary-200 rounded-xl">
                      <p className="text-sm text-primary-600 font-medium">
                        You&apos;ve reached the end • {filteredProducts.length} books found
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-primary-200 shadow-sm">
                  <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent-200">
                    <FiBook className="h-8 w-8 text-accent-600" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-primary-900 mb-2">
                    No books found
                  </h3>
                  <p className="text-sm text-primary-600 mb-6">
                    Try adjusting your search or filters to discover more books.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="bg-accent-100 text-accent-700 px-6 py-2.5 rounded-lg hover:bg-accent-200 transition-all font-semibold border border-accent-200"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile floating filter button */}
      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-4 z-[55] h-12 pl-3.5 pr-4 rounded-full bg-accent-500 hover:bg-accent-600 active:scale-[0.98] text-white shadow-[0_12px_32px_-12px_rgba(249,115,22,0.72)] inline-flex items-center gap-2 border border-accent-400 transition-all"
        >
          <FiFilter className="h-4.5 w-4.5" />
          <span className="text-sm font-semibold">Refine</span>
          {activeFiltersCount > 0 && (
            <span className="h-5 min-w-[1.25rem] px-1 rounded-full bg-white text-accent-700 text-[11px] font-bold inline-flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      )}

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/45"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[86vh] rounded-t-3xl border-t border-primary-200 bg-white shadow-2xl overflow-hidden">
            <div className="pt-2 pb-1 flex justify-center">
              <span className="h-1 w-10 rounded-full bg-primary-200" />
            </div>
            <div className="h-16 px-5 border-b border-primary-100 flex items-center justify-between">
              <div className="py-0.5">
                <h3 className="text-sm font-semibold text-primary-900">Refine Results</h3>
                <p className="text-xs text-primary-500">
                  {activeFiltersCount} filter{activeFiltersCount === 1 ? "" : "s"} applied
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="h-9 w-9 rounded-lg border border-primary-200 bg-white text-primary-700 inline-flex items-center justify-center"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[calc(86vh-4.75rem)] overflow-y-auto">
              <FilterPanel mobile />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default HomePage;
