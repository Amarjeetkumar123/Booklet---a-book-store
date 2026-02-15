import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
import { FiBook, FiArrowRight, FiAward, FiCode, FiBriefcase, FiTrendingUp, FiSearch, FiUser } from "react-icons/fi";

const Categories = () => {
  const categories = useCategory();
  const navigate = useNavigate();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  return (
    <Layout title={"All Categories - Booklet"}>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-16 border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block mb-4">
              <span className="bg-accent-100 text-accent-700 px-4 py-2 rounded-full text-sm font-semibold border border-accent-200">
                📚 All Categories
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">
              Browse Our Collection
            </h1>
            <p className="text-lg text-primary-600 max-w-2xl mx-auto">
              Explore books across different genres and find your next favorite read
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Categories Grid */}
          {categories.length === 0 ? (
            <div className="text-center py-20">
              <FiBook className="mx-auto w-20 h-20 text-primary-200 mb-4" />
              <h3 className="text-2xl font-bold text-primary-900 mb-2">
                No categories found
              </h3>
              <p className="text-primary-600 mb-6">
                Categories will appear here once they are added.
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-accent-100 text-accent-700 px-6 py-3 rounded-lg hover:bg-accent-200 transition-all font-medium border border-accent-200"
              >
                Back to Home
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((c) => (
                <Link
                  key={c._id}
                  to={`/category/${c.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-primary-100 hover:border-accent-200"
                >
                  <div className="p-6 text-center h-full flex flex-col items-center justify-center">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-accent-200 transition-all shadow-sm border border-accent-200">
                      <span className="text-accent-700">{getCategoryIcon(c.name)}</span>
                    </div>
                    
                    {/* Name */}
                    <h3 className="text-lg font-semibold text-primary-900 mb-2 group-hover:text-accent-600 transition-colors line-clamp-2">
                      {c.name}
                    </h3>
                    
                    {/* Arrow */}
                    <div className="flex items-center justify-center text-accent-600 group-hover:text-accent-700 transition-colors mt-auto">
                      <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-accent-50 via-white to-primary-50 py-16 border-t border-primary-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border-2 border-accent-200 p-12 text-center shadow-sm">
              <h2 className="text-3xl font-bold text-primary-900 mb-4">
                Can't find what you're looking for?
              </h2>
              <p className="text-primary-600 mb-8 text-lg max-w-2xl mx-auto">
                Browse all our products or use the search feature to discover specific books
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center gap-2 bg-accent-100 text-accent-700 px-8 py-3 rounded-lg hover:bg-accent-200 transition-all font-medium border border-accent-200"
                >
                  <span>Browse All Books</span>
                  <FiArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center gap-2 border-2 border-accent-300 text-accent-600 px-8 py-3 rounded-lg hover:bg-accent-50 transition-all font-medium"
                >
                  <span>Back to Home</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
