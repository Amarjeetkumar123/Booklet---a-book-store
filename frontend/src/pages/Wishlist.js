import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useWishlist } from "../context/wishlist";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import { FiTrash2, FiShoppingCart, FiArrowLeft } from "react-icons/fi";

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useWishlist();
  const [cart, setCart] = useCart();

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== productId);
    setWishlist(updatedWishlist);
    toast.success("Removed from wishlist");
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);
    if (existingItem) {
      toast.error("Product already in cart");
    } else {
      setCart([...cart, product]);
      removeFromWishlist(product._id);
      toast.success("Added to cart");
    }
  };

  const moveAllToCart = () => {
    if (wishlist.length === 0) {
      toast.error("Wishlist is empty");
      return;
    }
    const newCart = [...cart];
    wishlist.forEach((product) => {
      if (!cart.find((item) => item._id === product._id)) {
        newCart.push(product);
      }
    });
    setCart(newCart);
    setWishlist([]);
    toast.success("All items moved to cart");
  };

  return (
    <Layout title={"Your Wishlist"}>
      <div className="pt-24 pb-16 bg-primary-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-accent-600 hover:text-accent-700 font-semibold mb-4 transition-colors"
            >
              <FiArrowLeft /> Back
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-2">
              ❤️ My Wishlist
            </h1>
            <p className="text-primary-600">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} in
              your wishlist
            </p>
          </div>

          {wishlist.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-primary-900 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-primary-600 mb-6">
                Add your favorite books to your wishlist and come back later!
              </p>
              <button
                onClick={() => navigate("/categories")}
                className="bg-accent-100 text-accent-700 px-8 py-3 rounded-lg hover:bg-accent-200 transition-all font-semibold border border-accent-200 inline-flex items-center gap-2"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Action Buttons */}
              <div className="mb-6 flex gap-3 justify-end">
                <button
                  onClick={moveAllToCart}
                  className="bg-accent-100 text-accent-700 px-6 py-3 rounded-lg hover:bg-accent-200 transition-all font-semibold border border-accent-200 inline-flex items-center gap-2 shadow-sm"
                >
                  <FiShoppingCart /> Move All to Cart
                </button>
              </div>

              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlist.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-primary-100 hover:border-accent-200"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 bg-primary-100 overflow-hidden">
                      <img
                        src={
                          product.imageUrl ||
                          `https://placehold.co/300x400/f5f0e8/826b4d?text=${encodeURIComponent(
                            product.name
                          )}`
                        }
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-sm font-semibold">
                        ₹{product.price}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-primary-900 text-sm line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-primary-600 line-clamp-1 mb-3">
                        {product.description}
                      </p>

                      {/* Rating */}
                      {product.rating && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex text-accent-500">
                            {"⭐".repeat(Math.floor(product.rating))}
                          </div>
                          <span className="text-xs text-primary-500">
                            ({product.ratingCount || 0})
                          </span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => addToCart(product)}
                          className="flex-1 bg-accent-100 text-accent-700 px-3 py-2 rounded-lg hover:bg-accent-200 transition-all font-semibold text-sm border border-accent-200"
                        >
                          <FiShoppingCart className="inline mr-1" />
                          Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(product._id)}
                          className="px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all border border-red-200 hover:border-red-300"
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                      {/* View Details */}
                      <button
                        onClick={() => navigate(`/product/${product.slug}`)}
                        className="w-full mt-2 text-accent-600 hover:text-accent-700 font-semibold text-sm underline transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="mt-12 text-center">
                <button
                  onClick={() => navigate("/categories")}
                  className="text-accent-600 hover:text-accent-700 font-semibold transition-colors"
                >
                  ← Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WishlistPage;
