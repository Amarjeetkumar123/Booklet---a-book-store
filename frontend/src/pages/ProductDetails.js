import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { useWishlist } from "../context/wishlist";
import toast from "react-hot-toast";
import { FiShoppingCart, FiTag, FiPackage, FiArrowLeft, FiHeart, FiMinus, FiPlus, FiStar, FiTruck, FiShield, FiRefreshCw, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [wishlist, setWishlist] = useWishlist();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("https://placehold.co/600x800/f5f0e8/826b4d?text=No+Image");
  const [imageZoom, setImageZoom] = useState(false);

  // Sample additional images (in a real app, these would come from the product data)
  const productImages = React.useMemo(() => [
    product.imageUrl || "https://placehold.co/600x800/f5f0e8/826b4d?text=No+Image",
    "https://placehold.co/600x800/e8f4fd/3b82f6?text=Back+Cover",
    "https://placehold.co/600x800/f0f9ff/06b6d4?text=Inside+Page",
    "https://placehold.co/600x800/fef3c7/f59e0b?text=Spine"
  ], [product.imageUrl]);

  //getProduct
  const getProduct = React.useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      setSelectedImage(data?.product?.imageUrl || "https://placehold.co/600x800/f5f0e8/826b4d?text=No+Image");
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [params?.slug]);

  //initial details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug, getProduct]);

  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = () => {
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

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

  return (
    <Layout title={`${product?.name || "Product"} - BookBuddy`}>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-primary-600">
              <button
                onClick={() => navigate('/')}
                className="hover:text-accent-600 transition-colors font-medium"
              >
                Home
              </button>
              <FiArrowLeft className="h-4 w-4 rotate-180" />
              <button
                onClick={() => navigate('/categories')}
                className="hover:text-accent-600 transition-colors font-medium"
              >
                Categories
              </button>
              <FiArrowLeft className="h-4 w-4 rotate-180" />
              <span className="text-primary-900 font-semibold">{product?.category?.name}</span>
              <FiArrowLeft className="h-4 w-4 rotate-180" />
              <span className="text-accent-600 font-semibold truncate">{product?.name}</span>
            </div>
          </nav>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center space-x-2 text-primary-700 hover:text-accent-600 mb-8 transition-all duration-300 font-medium hover:translate-x-1"
          >
            <FiArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Products</span>
          </button>

          {/* Hero Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Product Images */}
              <div className="lg:col-span-5">
                <div className="flex gap-4">
                  {/* Thumbnails */}
                  <div className="flex flex-col gap-3">
                    {productImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === img
                            ? 'border-accent-500 shadow-md'
                            : 'border-primary-200 hover:border-primary-300'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Main Image */}
                  <div className="flex-1 relative group">
                    <div
                      className="relative h-80 lg:h-96 overflow-hidden cursor-zoom-in rounded-lg"
                      onMouseEnter={() => setImageZoom(true)}
                      onMouseLeave={() => setImageZoom(false)}
                    >
                      <img
                        src={selectedImage}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          imageZoom ? 'scale-110' : 'scale-100'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Floating badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <div className="bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        In Stock
                      </div>
                      {product?.category?.name && (
                        <div className="bg-primary-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          {product.category.name}
                        </div>
                      )}
                    </div>

                    {/* Quick wishlist button */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleWishlistToggle()}
                        className={`p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 ${
                          wishlist.find(item => item._id === product._id)
                            ? "bg-red-500 text-white"
                            : "bg-white/90 text-primary-600 hover:bg-white"
                        }`}
                      >
                        <FiHeart className={`w-4 h-4 ${wishlist.find(item => item._id === product._id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
                {/* Product Title and Price */}
                <div className="space-y-3">
                  <h1 className="text-2xl lg:text-3xl font-bold text-primary-900 leading-tight">
                    {product.name}
                  </h1>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold bg-gradient-to-r from-accent-600 to-accent-700 bg-clip-text text-transparent">
                        ₹{product?.price?.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className="h-4 w-4 text-accent-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-primary-600 font-semibold">(4.8)</span>
                      <span className="text-primary-500">• 127 reviews</span>
                    </div>
                  </div>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-semibold text-primary-700">Quantity:</label>
                      <div className="flex items-center gap-1 bg-white border border-primary-200 rounded-lg p-1 shadow-sm">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 bg-primary-50 hover:bg-primary-100 rounded-md transition-colors"
                        >
                          <FiMinus className="h-3 w-3 text-primary-600" />
                        </button>
                        <span className="text-sm font-bold w-8 text-center text-primary-900">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-2 bg-primary-50 hover:bg-primary-100 rounded-md transition-colors"
                        >
                          <FiPlus className="h-3 w-3 text-primary-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-accent-500 to-accent-600 text-white py-3 px-6 rounded-lg hover:from-accent-600 hover:to-accent-700 focus:outline-none focus:ring-4 focus:ring-accent-500/30 transition-all duration-300 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <FiShoppingCart className="h-4 w-4" />
                    <span>Add to Cart - ${((product?.price || 0) * quantity).toFixed(2)}</span>
                  </button>
                </div>

                {/* Key Features */}
                <div className="bg-primary-50 rounded-lg p-4">
                  <h3 className="text-base font-semibold text-primary-900 mb-3 text-center">Why Choose This Book?</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <FiTruck className="h-5 w-5 text-accent-600 mx-auto mb-2" />
                      <span className="text-xs font-semibold text-accent-800">Free Shipping</span>
                      <p className="text-xs text-primary-600 mt-1">Fast & reliable delivery</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <FiShield className="h-5 w-5 text-primary-600 mx-auto mb-2" />
                      <span className="text-xs font-semibold text-primary-800">Secure Payment</span>
                      <p className="text-xs text-primary-600 mt-1">100% safe transactions</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <FiRefreshCw className="h-5 w-5 text-accent-600 mx-auto mb-2" />
                      <span className="text-xs font-semibold text-accent-800">Easy Returns</span>
                      <p className="text-xs text-primary-600 mt-1">30-day return policy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-primary-900 mb-4 flex items-center">
                  <FiPackage className="h-5 w-5 mr-3 text-accent-500" />
                  Description
                </h3>
                <p className="text-primary-700 leading-relaxed text-base">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-primary-900 mb-4 flex items-center">
                  <FiTag className="h-5 w-5 mr-3 text-accent-500" />
                  Product Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-primary-100">
                      <span className="font-medium text-primary-700 text-sm">Category</span>
                      <span className="text-primary-600 text-sm">{product?.category?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-primary-100">
                      <span className="font-medium text-primary-700 text-sm">ISBN</span>
                      <span className="text-primary-600 text-sm">978-0-123456-78-9</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-primary-100">
                      <span className="font-medium text-primary-700 text-sm">Pages</span>
                      <span className="text-primary-600 text-sm">320</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-primary-100">
                      <span className="font-medium text-primary-700 text-sm">Language</span>
                      <span className="text-primary-600 text-sm">English</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-primary-100">
                      <span className="font-medium text-primary-700 text-sm">Publisher</span>
                      <span className="text-primary-600 text-sm">Booklet Publishing</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-primary-100">
                      <span className="font-medium text-primary-700 text-sm">Weight</span>
                      <span className="text-primary-600 text-sm">0.5 lbs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-primary-900 flex items-center">
                    <FiStar className="h-5 w-5 mr-3 text-accent-500" />
                    Customer Reviews
                  </h3>
                  <button className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm">
                    Write a Review
                  </button>
                </div>

                {/* Rating Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-accent-600 mb-2">4.8</div>
                    <div className="flex items-center justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className="h-5 w-5 text-accent-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-primary-600">Based on 127 reviews</p>
                  </div>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center space-x-3">
                        <span className="text-sm text-primary-600 w-8">{stars}★</span>
                        <div className="flex-1 bg-primary-100 rounded-full h-2">
                          <div
                            className="bg-accent-500 h-2 rounded-full"
                            style={{ width: `${stars === 5 ? 75 : stars === 4 ? 20 : stars === 3 ? 3 : stars === 2 ? 1 : 1}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-primary-600 w-8">{stars === 5 ? 95 : stars === 4 ? 25 : stars === 3 ? 4 : stars === 2 ? 1 : 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border-b border-primary-100 pb-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-accent-700 font-bold">JD</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-primary-900">John Doe</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FiStar key={i} className="h-4 w-4 text-accent-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <span className="text-primary-500 text-sm block mb-3">2 days ago</span>
                        <p className="text-primary-700 leading-relaxed">Excellent book! The content is well-written and the delivery was fast. Highly recommended for anyone interested in this topic. The author's insights are particularly valuable.</p>
                        <div className="flex items-center space-x-4 mt-3">
                          <button className="text-primary-500 hover:text-accent-600 text-sm font-medium">Helpful (12)</button>
                          <button className="text-primary-500 hover:text-accent-600 text-sm font-medium">Reply</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-b border-primary-100 pb-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-700 font-bold">SM</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-primary-900">Sarah Miller</span>
                          <div className="flex items-center">
                            {[...Array(4)].map((_, i) => (
                              <FiStar key={i} className="h-4 w-4 text-accent-400 fill-current" />
                            ))}
                            <FiStar className="h-4 w-4 text-primary-300" />
                          </div>
                        </div>
                        <span className="text-primary-500 text-sm block mb-3">1 week ago</span>
                        <p className="text-primary-700 leading-relaxed">Great read! I enjoyed every page. The author's insights are valuable and the book arrived in perfect condition. Would definitely recommend to fellow readers.</p>
                        <div className="flex items-center space-x-4 mt-3">
                          <button className="text-primary-500 hover:text-accent-600 text-sm font-medium">Helpful (8)</button>
                          <button className="text-primary-500 hover:text-accent-600 text-sm font-medium">Reply</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <button className="bg-primary-100 hover:bg-primary-200 text-primary-700 px-6 py-3 rounded-lg transition-colors font-semibold border border-primary-200">
                    Load More Reviews
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Info */}
              <div className="mb-8">
                <h4 className="text-base font-bold text-primary-900 mb-4">Quick Info</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FiPackage className="h-5 w-5 text-accent-500" />
                    <span className="text-primary-700">In Stock</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiTruck className="h-5 w-5 text-accent-500" />
                    <span className="text-primary-700">Free Shipping</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiRefreshCw className="h-5 w-5 text-accent-500" />
                    <span className="text-primary-700">30-Day Returns</span>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="mb-8">
                <h4 className="text-base font-bold text-primary-900 mb-4">Share This Book</h4>
                <div className="flex space-x-3">
                  <button className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">
                    <FiFacebook className="h-5 w-5 text-blue-600" />
                  </button>
                  <button className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">
                    <FiTwitter className="h-5 w-5 text-blue-400" />
                  </button>
                  <button className="p-3 bg-pink-100 hover:bg-pink-200 rounded-lg transition-colors">
                    <FiInstagram className="h-5 w-5 text-pink-600" />
                  </button>
                  <button className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">
                    <FiLinkedin className="h-5 w-5 text-blue-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl font-bold text-primary-900 flex items-center">
                <FiTag className="h-6 w-6 mr-3 text-accent-500" />
                You Might Also Like
              </h2>
              <button className="text-accent-600 hover:text-accent-700 font-semibold text-base transition-colors flex items-center space-x-2">
                <span>View All</span>
                <FiArrowLeft className="h-5 w-5 rotate-180" />
              </button>
            </div>

            {relatedProducts.length < 1 ? (
              <div className="text-center py-20">
                <FiPackage className="h-20 w-20 text-primary-300 mx-auto mb-6" />
                <p className="text-primary-500 text-xl">No similar products found</p>
                <p className="text-primary-400 mt-2">Check back later for more recommendations!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {relatedProducts?.map((p) => (
                  <div
                    key={p._id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-primary-200 hover:border-accent-200 transform hover:-translate-y-2"
                  >
                    <div className="relative h-64 overflow-hidden bg-primary-50">
                      <img
                        src={p.imageUrl || "https://placehold.co/300x400/f5f0e8/826b4d?text=No+Image"}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <button
                        onClick={() => handleWishlistToggle(p)}
                        className={`absolute top-4 right-4 p-3 rounded-full shadow-xl backdrop-blur-sm transition-all duration-300 ${
                          wishlist.find(item => item._id === p._id)
                            ? "bg-red-500 text-white"
                            : "bg-white/90 text-primary-600 hover:bg-white"
                        }`}
                      >
                        <FiHeart className={`w-5 h-5 ${wishlist.find(item => item._id === p._id) ? 'fill-current' : ''}`} />
                      </button>
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => {
                            setCart([...cart, p]);
                            localStorage.setItem(
                              "cart",
                              JSON.stringify([...cart, p])
                            );
                            toast.success("Item Added to cart");
                          }}
                          className="w-full bg-gradient-to-r from-accent-500 to-accent-600 text-white py-2 px-4 rounded-lg hover:from-accent-600 hover:to-accent-700 transition-all duration-300 text-sm font-semibold shadow-lg"
                        >
                          Quick Add
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-base font-bold text-primary-900 line-clamp-2 mb-3 group-hover:text-accent-600 transition-colors leading-tight">
                        {p.name}
                      </h3>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-accent-600">
                          ₹{p.price.toLocaleString("en-IN")}
                        </span>
                        <div className="flex items-center space-x-1">
                          <FiStar className="h-5 w-5 text-accent-400 fill-current" />
                          <span className="text-sm text-primary-600 font-semibold">4.5</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/product/${p.slug}`)}
                        className="w-full bg-primary-100 text-primary-700 py-3 px-4 rounded-lg hover:bg-primary-200 transition-colors text-sm font-semibold border border-primary-200 hover:border-primary-300"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
