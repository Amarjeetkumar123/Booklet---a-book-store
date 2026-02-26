import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "../config/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { useWishlist } from "../context/wishlist";
import { useLocationContext } from "../context/location";
import toast from "react-hot-toast";
import { FiShoppingCart, FiTag, FiPackage, FiArrowLeft, FiHeart, FiMinus, FiPlus, FiStar, FiTruck, FiShield, FiRefreshCw, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { isProductAvailableInLocation } from "../utils/locationUtils";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [wishlist, setWishlist] = useWishlist();
  const [product, setProduct] = useState(null);
  const { selectedLocation, selectedLocationLabel } = useLocationContext();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isDeliverable, setIsDeliverable] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const fallbackImage = "https://placehold.co/600x800/f5f0e8/826b4d?text=No+Image";

  const productImages = React.useMemo(() => {
    const images = [
      ...(Array.isArray(product?.imageUrls) ? product.imageUrls : []),
      product?.imageUrl,
    ]
      .filter((img) => typeof img === "string" && img.trim().length > 0)
      .map((img) => img.trim());

    const uniqueImages = [...new Set(images)];
    return uniqueImages.length ? uniqueImages : [fallbackImage];
  }, [product?.imageUrl, product?.imageUrls, fallbackImage]);

  const activeImage = productImages[activeImageIndex] || fallbackImage;

  //get similar product
  const getSimilarProduct = React.useCallback(
    async (pid, cid) => {
      try {
        const { data } = await axios.get(
          `/api/v1/product/related-product/${pid}/${cid}?location=${encodeURIComponent(
            selectedLocation || ""
          )}`
        );
        setRelatedProducts(data?.products);
      } catch (error) {
        console.log(error);
      }
    },
    [selectedLocation]
  );

  //getProduct
  const getProduct = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}?location=${encodeURIComponent(
          selectedLocation || ""
        )}`
      );
      if (data?.product) {
        setProduct(data?.product);
        const deliverable = data?.isDeliverable ?? isProductAvailableInLocation(data?.product, selectedLocation);
        setIsDeliverable(Boolean(deliverable));
        getSimilarProduct(data?.product._id, data?.product.category._id);
      } else {
        setError(true);
        setProduct(null);
      }
    } catch (error) {
      console.log(error);
      setError(true);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [getSimilarProduct, params?.slug, selectedLocation]);

  //initial details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug, getProduct]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?._id]);

  useEffect(() => {
    if (productImages.length < 2) return undefined;

    const autoScrollTimer = setInterval(() => {
      setActiveImageIndex((prevIndex) =>
        prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3200);

    return () => clearInterval(autoScrollTimer);
  }, [productImages.length]);

  const goToPreviousImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === 0 ? productImages.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleAddToCart = () => {
    if (!isDeliverable) {
      toast.error(`This book is not available in ${selectedLocationLabel}`);
      return;
    }

    const cartItem = { ...product, quantity };
    const existingItemIndex = cart.findIndex(item => item._id === product._id);

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      setCart([...cart, cartItem]);
      localStorage.setItem("cart", JSON.stringify([...cart, cartItem]));
    }
    toast.success(`${quantity} item${quantity > 1 ? 's' : ''} added to cart`);
  };

  const handleWishlistToggle = (prod = product) => {
    const existingItem = wishlist.find(item => item._id === prod._id);
    if (existingItem) {
      setWishlist(wishlist.filter(item => item._id !== prod._id));
      toast.success("Removed from wishlist");
    } else {
      setWishlist([...wishlist, prod]);
      toast.success("Added to wishlist");
    }
  };

  const handleQuickAddRelated = (relatedProduct) => {
    const existingItemIndex = cart.findIndex(
      (item) => item._id === relatedProduct._id
    );

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity =
        (updatedCart[existingItemIndex].quantity || 1) + 1;
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      const cartItem = { ...relatedProduct, quantity: 1 };
      const updatedCart = [...cart, cartItem];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
    toast.success("Item added to cart");
  };

  const isWishlisted = wishlist.some((item) => item._id === product?._id);
  const totalPrice = (product?.price || 0) * quantity;
  const productSpecs = [
    { label: "Category", value: product?.category?.name || "N/A" },
    { label: "Format", value: "Paperback" },
    { label: "Language", value: "English" },
    { label: "Publisher", value: "Booklet Publishing" },
    { label: "Pages", value: "320" },
    { label: "Weight", value: "0.5 lbs" },
  ];

  const ratingDistribution = [
    { stars: 5, count: 95, percent: 75 },
    { stars: 4, count: 25, percent: 20 },
    { stars: 3, count: 4, percent: 3 },
    { stars: 2, count: 1, percent: 1 },
    { stars: 1, count: 1, percent: 1 },
  ];

  const featuredReviews = [
    {
      initials: "JD",
      name: "John Doe",
      date: "2 days ago",
      rating: 5,
      comment:
        "Excellent book with clear writing and practical examples. Delivery was quick and the book quality is great.",
      helpfulCount: 12,
    },
    {
      initials: "SM",
      name: "Sarah Miller",
      date: "1 week ago",
      rating: 4,
      comment:
        "Great read overall. Useful insights, easy flow, and it arrived in perfect condition.",
      helpfulCount: 8,
    },
  ];

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-200 rounded-lg h-[500px]"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout title="Product Not Found">
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-2xl font-bold text-primary-900 mb-2">Product Not Found</h1>
            <p className="text-primary-600 mb-6">The product you're looking for doesn't exist or the link is invalid.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-accent-100 text-accent-700 px-6 py-3 rounded-lg hover:bg-accent-200 transition-all font-semibold border border-accent-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${product?.name || "Product"} - BookBuddy`}>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-primary-50 via-white to-accent-50">
        <div className="pointer-events-none absolute -left-32 -top-24 h-72 w-72 rounded-full bg-accent-100 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary-100 blur-3xl"></div>

        <div className="relative w-full px-4 py-8 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-primary-600">
            <button
              onClick={() => navigate("/")}
              className="font-semibold transition-colors hover:text-accent-600"
            >
              Home
            </button>
            <FiArrowLeft className="h-3.5 w-3.5 rotate-180" />
            <button
              onClick={() => navigate("/categories")}
              className="font-semibold transition-colors hover:text-accent-600"
            >
              Categories
            </button>
            <FiArrowLeft className="h-3.5 w-3.5 rotate-180" />
            <span className="font-semibold text-primary-900">{product?.category?.name}</span>
            <FiArrowLeft className="h-3.5 w-3.5 rotate-180" />
            <span className="truncate font-semibold text-accent-600">{product?.name}</span>
          </nav>

          <button
            onClick={() => navigate(-1)}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors hover:text-accent-600"
          >
            <FiArrowLeft className="h-4 w-4" />
            <span>Back to products</span>
          </button>

          <section className="grid grid-cols-1 gap-10 xl:grid-cols-[1.15fr_1fr]">
            <div>
              <div className="relative h-80 overflow-hidden rounded-[28px] bg-gradient-to-br from-primary-100 via-white to-accent-50 sm:h-[460px] lg:h-[560px]">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="h-full w-full object-contain p-6 sm:p-8 transition-transform duration-500 hover:scale-[1.02]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-900/15 to-transparent"></div>

                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={goToPreviousImage}
                      aria-label="Previous image"
                      className="absolute left-4 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-white/90 text-primary-700 shadow-lg transition-colors hover:bg-white hover:text-accent-600"
                    >
                      <FiChevronLeft className="mx-auto h-5 w-5" />
                    </button>
                    <button
                      onClick={goToNextImage}
                      aria-label="Next image"
                      className="absolute right-4 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-white/90 text-primary-700 shadow-lg transition-colors hover:bg-white hover:text-accent-600"
                    >
                      <FiChevronRight className="mx-auto h-5 w-5" />
                    </button>
                  </>
                )}

                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                    In Stock
                  </span>
                  {product?.category?.name && (
                    <span className="rounded-full bg-primary-900 px-3 py-1 text-xs font-bold text-white">
                      {product.category.name}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleWishlistToggle()}
                  className={`absolute right-4 top-4 rounded-full p-2.5 shadow-lg transition-all ${
                    isWishlisted
                      ? "bg-red-500 text-white"
                      : "bg-white/90 text-primary-600 hover:bg-white"
                  }`}
                >
                  <FiHeart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                </button>

                {productImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-primary-900/70 px-3 py-1 text-xs font-semibold text-white">
                    {activeImageIndex + 1} / {productImages.length}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
                {productImages.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    onClick={() => setActiveImageIndex(index)}
                    className={`h-16 w-14 shrink-0 overflow-hidden rounded-lg transition-all sm:h-20 sm:w-16 ${
                      activeImageIndex === index
                        ? "opacity-100 ring-2 ring-accent-500/70"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-contain bg-white/70 p-1"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="xl:pl-4">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wide text-accent-700">
                  {product?.category?.name || "Book"}
                </span>
                <div className="flex items-center gap-1 text-sm font-semibold text-primary-700">
                  <FiStar className="h-4 w-4 fill-current text-accent-500" />
                  <span>4.8</span>
                  <span className="text-primary-500">(127 reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold leading-tight text-primary-900 sm:text-4xl">
                {product.name}
              </h1>

              <p className="mt-4 text-sm leading-relaxed text-primary-600 sm:text-base">
                {product.description}
              </p>

              <div className="mt-6 flex flex-wrap items-end gap-4">
                <span className="bg-gradient-to-r from-accent-600 to-accent-700 bg-clip-text text-4xl font-bold text-transparent">
                  ₹{product?.price?.toLocaleString("en-IN")}
                </span>
                <span className="pb-1 text-xs font-medium text-primary-500">
                  Inclusive of all taxes
                </span>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-white/80 px-2 py-1 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 transition-colors hover:bg-primary-200"
                  >
                    <FiMinus className="mx-auto h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-base font-bold text-primary-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 transition-colors hover:bg-primary-200"
                  >
                    <FiPlus className="mx-auto h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!isDeliverable}
                  className={`rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 ${
                    isDeliverable
                      ? "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg hover:from-accent-600 hover:to-accent-700"
                      : "cursor-not-allowed bg-primary-200 text-primary-600"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <FiShoppingCart className="h-4 w-4" />
                    {isDeliverable
                      ? `Add to Cart - ₹${totalPrice.toLocaleString("en-IN")}`
                      : `Unavailable in ${selectedLocationLabel}`}
                  </span>
                </button>

                <button
                  onClick={() => handleWishlistToggle()}
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                    isWishlisted
                      ? "bg-red-50 text-red-600"
                      : "bg-white/80 text-primary-700 hover:bg-white"
                  }`}
                >
                  {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                </button>
              </div>

              {!isDeliverable && (
                <p className="mt-3 text-sm text-red-600">
                  Select another delivery location from the header to buy this book.
                </p>
              )}

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2 text-sm font-medium text-primary-700">
                  <FiTruck className="h-4 w-4 text-accent-600" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-primary-700">
                  <FiShield className="h-4 w-4 text-primary-700" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-primary-700">
                  <FiRefreshCw className="h-4 w-4 text-accent-600" />
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-14 grid grid-cols-1 gap-10 xl:grid-cols-12">
            <div className="space-y-10 xl:col-span-8">
              <div className="border-b border-primary-100 pb-8">
                <h2 className="mb-4 flex items-center text-xl font-bold text-primary-900">
                  <FiPackage className="mr-2 h-5 w-5 text-accent-500" />
                  Description
                </h2>
                <p className="text-sm leading-relaxed text-primary-700 sm:text-base">
                  {product.description}
                </p>
              </div>

              <div className="border-b border-primary-100 pb-8">
                <h2 className="mb-5 flex items-center text-xl font-bold text-primary-900">
                  <FiTag className="mr-2 h-5 w-5 text-accent-500" />
                  Product Details
                </h2>
                <div className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
                  {productSpecs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-center justify-between border-b border-primary-100 py-2"
                    >
                      <span className="text-sm font-semibold text-primary-700">{spec.label}</span>
                      <span className="text-sm text-primary-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="flex items-center text-xl font-bold text-primary-900">
                    <FiStar className="mr-2 h-5 w-5 text-accent-500" />
                    Customer Reviews
                  </h2>
                  <button className="rounded-full bg-primary-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-800">
                    Write a Review
                  </button>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-5xl font-bold text-accent-600">4.8</p>
                    <div className="mt-2 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className="h-4 w-4 fill-current text-accent-400" />
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-primary-600">Based on 127 verified reviews</p>
                  </div>

                  <div className="space-y-2">
                    {ratingDistribution.map((rating) => (
                      <div key={rating.stars} className="flex items-center gap-3">
                        <span className="w-8 text-sm text-primary-600">{rating.stars}★</span>
                        <div className="h-2 flex-1 rounded-full bg-primary-100">
                          <div
                            className="h-2 rounded-full bg-accent-500"
                            style={{ width: `${rating.percent}%` }}
                          ></div>
                        </div>
                        <span className="w-8 text-sm text-primary-600">{rating.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {featuredReviews.map((review) => (
                    <div key={review.name} className="border-b border-primary-100 pb-6">
                      <div className="mb-3 flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100 text-sm font-bold text-accent-700">
                          {review.initials}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-primary-900">{review.name}</span>
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`h-3.5 w-3.5 ${
                                    i < review.rating
                                      ? "fill-current text-accent-400"
                                      : "text-primary-200"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-primary-500">{review.date}</p>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-primary-700">{review.comment}</p>
                      <div className="mt-3 flex items-center gap-4">
                        <button className="text-xs font-semibold text-primary-500 transition-colors hover:text-accent-600">
                          Helpful ({review.helpfulCount})
                        </button>
                        <button className="text-xs font-semibold text-primary-500 transition-colors hover:text-accent-600">
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-6 text-sm font-semibold text-primary-700 transition-colors hover:text-accent-600">
                  Load More Reviews
                </button>
              </div>
            </div>

            <aside className="self-start xl:sticky xl:top-24 xl:col-span-4">
              <div className="space-y-8">
                <div className="border-b border-primary-100 pb-6">
                  <h3 className="mb-4 text-base font-bold text-primary-900">Order Snapshot</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-primary-600">Availability</span>
                      <span className={isDeliverable ? "font-semibold text-emerald-600" : "font-semibold text-red-600"}>
                        {isDeliverable ? "Available" : "Not available"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-600">Delivery</span>
                      <span className="font-semibold text-primary-800">{selectedLocationLabel || "All locations"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-600">Return Window</span>
                      <span className="font-semibold text-primary-800">30 days</span>
                    </div>
                  </div>
                </div>

                <div className="border-b border-primary-100 pb-6">
                  <h3 className="mb-4 text-base font-bold text-primary-900">Why Shop Here</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-primary-700">
                      <FiTruck className="h-4 w-4 text-accent-600" />
                      <span>Fast delivery with tracking</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-primary-700">
                      <FiShield className="h-4 w-4 text-primary-700" />
                      <span>Secure checkout and payment</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-primary-700">
                      <FiRefreshCw className="h-4 w-4 text-accent-600" />
                      <span>Hassle-free returns</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-base font-bold text-primary-900">Share This Book</h3>
                  <div className="flex items-center gap-3">
                    <button className="rounded-full bg-blue-50 p-3 transition-colors hover:bg-blue-100">
                      <FiFacebook className="h-4 w-4 text-blue-600" />
                    </button>
                    <button className="rounded-full bg-sky-50 p-3 transition-colors hover:bg-sky-100">
                      <FiTwitter className="h-4 w-4 text-sky-500" />
                    </button>
                    <button className="rounded-full bg-pink-50 p-3 transition-colors hover:bg-pink-100">
                      <FiInstagram className="h-4 w-4 text-pink-600" />
                    </button>
                    <button className="rounded-full bg-blue-50 p-3 transition-colors hover:bg-blue-100">
                      <FiLinkedin className="h-4 w-4 text-blue-700" />
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </section>

          <section className="mt-14 pb-10">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center text-2xl font-bold text-primary-900">
                <FiTag className="mr-2 h-6 w-6 text-accent-500" />
                You Might Also Like
              </h2>
              <button
                onClick={() => navigate("/categories")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors hover:text-accent-600"
              >
                View all
                <FiArrowLeft className="h-4 w-4 rotate-180" />
              </button>
            </div>

            {relatedProducts.length < 1 ? (
              <div className="py-16 text-center">
                <FiPackage className="mx-auto mb-4 h-14 w-14 text-primary-300" />
                <p className="text-lg font-semibold text-primary-600">No similar products found</p>
                <p className="mt-1 text-sm text-primary-500">New recommendations will appear here soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {relatedProducts?.map((p) => {
                  const isRelatedWishlisted = wishlist.some((item) => item._id === p._id);

                  return (
                    <div key={p._id} className="group">
                      <div className="relative h-60 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50">
                        <img
                          src={p.imageUrl || "https://placehold.co/300x400/f5f0e8/826b4d?text=No+Image"}
                          alt={p.name}
                          className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <button
                          onClick={() => handleWishlistToggle(p)}
                          className={`absolute right-3 top-3 rounded-full p-2 shadow-md transition-all ${
                            isRelatedWishlisted
                              ? "bg-red-500 text-white"
                              : "bg-white/90 text-primary-600 hover:bg-white"
                          }`}
                        >
                          <FiHeart className={`h-4 w-4 ${isRelatedWishlisted ? "fill-current" : ""}`} />
                        </button>
                      </div>

                      <h3 className="mt-4 line-clamp-2 text-base font-bold leading-6 text-primary-900 group-hover:text-accent-600">
                        {p.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xl font-bold text-accent-600">
                          ₹{p.price.toLocaleString("en-IN")}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-semibold text-primary-600">
                          <FiStar className="h-4 w-4 fill-current text-accent-400" />
                          4.5
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-4 text-sm font-semibold">
                        <button
                          onClick={() => handleQuickAddRelated(p)}
                          className="text-primary-700 transition-colors hover:text-accent-600"
                        >
                          Quick Add
                        </button>
                        <button
                          onClick={() => navigate(`/product/${p.slug}`)}
                          className="text-primary-700 transition-colors hover:text-accent-600"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
