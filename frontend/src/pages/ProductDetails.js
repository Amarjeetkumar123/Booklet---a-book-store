import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { useWishlist } from "../context/wishlist";
import toast from "react-hot-toast";
import { FiShoppingCart, FiTag, FiPackage, FiArrowLeft, FiHeart } from "react-icons/fi";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [wishlist, setWishlist] = useWishlist();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  //getProduct
  const getProduct = React.useCallback(async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  }, [params?.slug]);

  //initalp details
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
  return (
    <Layout title={`${product?.name || "Product"} - BookBuddy`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors font-medium"
        >
          <FiArrowLeft className="h-5 w-5" />
          <span>Back to Products</span>
        </button>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <img
              src={product.imageUrl || "https://placehold.co/600x800/f5f0e8/826b4d?text=No+Image"}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <div className="mb-6">
              <h1 className="text-3xl font-playfair font-bold text-gray-800 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <span className="text-3xl font-bold text-orange-600">
                  {product?.price?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </span>
                <div className="flex items-center text-yellow-500">
                  ★★★★★
                </div>
                {product?.category?.name && (
                  <div className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full">
                    <FiTag className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {product.category.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-center space-x-2 text-green-600 mb-6 bg-green-50 px-4 py-3 rounded-lg">
              <FiPackage className="h-5 w-5" />
              <span className="text-sm font-medium">
                In Stock & Ready to Ship
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const existingItem = wishlist.find(item => item._id === product._id);
                  if (existingItem) {
                    setWishlist(wishlist.filter(item => item._id !== product._id));
                    toast.success("Removed from wishlist");
                  } else {
                    setWishlist([...wishlist, product]);
                    toast.success("Added to wishlist");
                  }
                }}
                className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${
                  wishlist.find(item => item._id === product._id)
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FiHeart className="h-5 w-5" />
                <span>Wishlist</span>
              </button>
              <button
                onClick={() => {
                  setCart([...cart, product]);
                  localStorage.setItem(
                    "cart",
                    JSON.stringify([...cart, product])
                  );
                  toast.success("Item Added to cart");
                }}
                className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <FiShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
        {/* Similar Products */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-playfair font-bold text-gray-800">
              Similar Products
            </h2>
            <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
              See all →
            </button>
          </div>

          {relatedProducts.length < 1 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No similar products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts?.map((p) => (
                <div
                  key={p._id}
                  className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-50">
                    <img
                      src={p.imageUrl || "https://placehold.co/300x400/f5f0e8/826b4d?text=No+Image"}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-orange-600">
                        {p.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </span>
                      <div className="flex items-center text-yellow-500 text-xs">
                        ★★★★★
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/product/${p.slug}`)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
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
                        className={`px-3 py-2 rounded-lg transition-colors text-xs font-medium ${
                          wishlist.find(item => item._id === p._id)
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <FiHeart className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setCart([...cart, p]);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify([...cart, p])
                          );
                          toast.success("Item Added to cart");
                        }}
                        className="flex-1 bg-orange-500 text-white py-2 px-3 rounded-lg hover:bg-orange-600 transition-colors text-xs font-medium"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
