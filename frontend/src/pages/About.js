import React from "react";
import Layout from "./../components/Layout/Layout";
import { FiAward, FiTarget, FiUsers, FiTrendingUp, FiBook, FiHeart, FiGlobe, FiZap } from "react-icons/fi";

const About = () => {
  return (
    <Layout title={"About Us - Booklet"}>
      <div className="pt-24 pb-16 bg-white min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">
                  Welcome to Booklet
                </h1>
                <p className="text-xl text-primary-700 mb-6">
                  Your gateway to a world of stories, knowledge, and imagination.
                </p>
                <p className="text-lg text-primary-600 leading-relaxed">
                  Founded in 2020, Booklet has been connecting book lovers with their next favorite read. We believe that books have the power to transform lives, and we're committed to making quality literature accessible to everyone, everywhere.
                </p>
              </div>
              <div className="bg-gradient-to-br from-accent-100 to-orange-100 rounded-2xl p-12 shadow-lg">
                <div className="text-6xl text-accent-600 mb-4">📚</div>
                <h3 className="text-2xl font-bold text-primary-900 mb-2">Our Promise</h3>
                <p className="text-primary-700">
                  To provide the widest selection of books, competitive prices, and exceptional customer service every single day.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-primary-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-accent-500 mb-2">50K+</div>
                <p className="text-accent-100">Books Available</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent-500 mb-2">100K+</div>
                <p className="text-accent-100">Happy Customers</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent-500 mb-2">150+</div>
                <p className="text-accent-100">Countries Shipped</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent-500 mb-2">4.9★</div>
                <p className="text-accent-100">Average Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Mission */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-primary-100 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-accent-100 p-3 rounded-lg">
                  <FiTarget className="text-2xl text-accent-600" />
                </div>
                <h3 className="text-2xl font-bold text-primary-900">Our Mission</h3>
              </div>
              <p className="text-primary-700 leading-relaxed">
                To inspire and empower readers worldwide by providing access to a diverse collection of books at affordable prices, with exceptional service and convenience.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-primary-100 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-accent-100 p-3 rounded-lg">
                  <FiGlobe className="text-2xl text-accent-600" />
                </div>
                <h3 className="text-2xl font-bold text-primary-900">Our Vision</h3>
              </div>
              <p className="text-primary-700 leading-relaxed">
                To be the world's most trusted and beloved online bookstore, where every person can find books that matter to them and connect with a global community of readers.
              </p>
            </div>

            {/* Values */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-primary-100 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-accent-100 p-3 rounded-lg">
                  <FiHeart className="text-2xl text-accent-600" />
                </div>
                <h3 className="text-2xl font-bold text-primary-900">Our Values</h3>
              </div>
              <ul className="space-y-2 text-primary-700">
                <li>✓ Customer First Always</li>
                <li>✓ Quality & Authenticity</li>
                <li>✓ Passionate About Books</li>
                <li>✓ Community & Connection</li>
              </ul>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-primary-900 mb-12 text-center">Why Choose Booklet?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-primary-50 rounded-xl p-8 border border-primary-100 hover:border-accent-300 transition-all">
                <div className="text-4xl mb-3">📖</div>
                <h4 className="font-bold text-primary-900 mb-2">Vast Selection</h4>
                <p className="text-primary-600 text-sm">
                  Over 50,000 titles across all genres and categories from bestsellers to rare finds.
                </p>
              </div>

              <div className="bg-primary-50 rounded-xl p-8 border border-primary-100 hover:border-accent-300 transition-all">
                <div className="text-4xl mb-3">💰</div>
                <h4 className="font-bold text-primary-900 mb-2">Best Prices</h4>
                <p className="text-primary-600 text-sm">
                  Competitive pricing with regular discounts and exclusive deals for our members.
                </p>
              </div>

              <div className="bg-primary-50 rounded-xl p-8 border border-primary-100 hover:border-accent-300 transition-all">
                <div className="text-4xl mb-3">🚚</div>
                <h4 className="font-bold text-primary-900 mb-2">Fast Shipping</h4>
                <p className="text-primary-600 text-sm">
                  Quick delivery to over 150 countries with real-time tracking on all orders.
                </p>
              </div>

              <div className="bg-primary-50 rounded-xl p-8 border border-primary-100 hover:border-accent-300 transition-all">
                <div className="text-4xl mb-3">🤝</div>
                <h4 className="font-bold text-primary-900 mb-2">Great Support</h4>
                <p className="text-primary-600 text-sm">
                  24/7 customer service team ready to help with any questions or concerns.
                </p>
              </div>

              <div className="bg-primary-50 rounded-xl p-8 border border-primary-100 hover:border-accent-300 transition-all">
                <div className="text-4xl mb-3">⭐</div>
                <h4 className="font-bold text-primary-900 mb-2">Reviews & Ratings</h4>
                <p className="text-primary-600 text-sm">
                  Authentic customer reviews to help you choose the perfect book every time.
                </p>
              </div>

              <div className="bg-primary-50 rounded-xl p-8 border border-primary-100 hover:border-accent-300 transition-all">
                <div className="text-4xl mb-3">🔐</div>
                <h4 className="font-bold text-primary-900 mb-2">Secure Shopping</h4>
                <p className="text-primary-600 text-sm">
                  Your information is protected with industry-leading encryption technology.
                </p>
              </div>

              <div className="bg-primary-50 rounded-xl p-8 border border-primary-100 hover:border-accent-300 transition-all">
                <div className="text-4xl mb-3">📱</div>
                <h4 className="font-bold text-primary-900 mb-2">Easy Returns</h4>
                <p className="text-primary-600 text-sm">
                  30-day hassle-free returns policy. We want you to be completely satisfied.
                </p>
              </div>

              <div className="bg-primary-50 rounded-xl p-8 border border-primary-100 hover:border-accent-300 transition-all">
                <div className="text-4xl mb-3">🎁</div>
                <h4 className="font-bold text-primary-900 mb-2">Loyalty Program</h4>
                <p className="text-primary-600 text-sm">
                  Earn points on every purchase and redeem them for discounts and exclusive offers.
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-2xl p-12 mb-16">
            <h2 className="text-3xl font-bold text-primary-900 mb-6">Meet Our Team</h2>
            <p className="text-primary-700 mb-8 text-lg">
              Our diverse team of book enthusiasts, technology experts, and customer service professionals are dedicated to making your experience exceptional.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="text-5xl mb-3">👨‍💼</div>
                <h4 className="font-bold text-primary-900">John Smith</h4>
                <p className="text-sm text-primary-600">CEO & Founder</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="text-5xl mb-3">👩‍💼</div>
                <h4 className="font-bold text-primary-900">Sarah Johnson</h4>
                <p className="text-sm text-primary-600">Head of Operations</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="text-5xl mb-3">👨‍💻</div>
                <h4 className="font-bold text-primary-900">Mike Chen</h4>
                <p className="text-sm text-primary-600">CTO & Tech Lead</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="text-5xl mb-3">👩‍💻</div>
                <h4 className="font-bold text-primary-900">Emma Davis</h4>
                <p className="text-sm text-primary-600">Customer Care Director</p>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div>
            <h2 className="text-3xl font-bold text-primary-900 mb-8 text-center">Our Journey</h2>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="bg-accent-100 rounded-full p-3 flex-shrink-0">
                  <FiBook className="text-xl text-accent-600" />
                </div>
                <div className="bg-white rounded-xl p-6 flex-grow border border-primary-100">
                  <h4 className="font-bold text-primary-900 mb-1">2020 - Founded Booklet</h4>
                  <p className="text-primary-600">Started with a small team and a big dream to revolutionize online book shopping.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-accent-100 rounded-full p-3 flex-shrink-0">
                  <FiTrendingUp className="text-xl text-accent-600" />
                </div>
                <div className="bg-white rounded-xl p-6 flex-grow border border-primary-100">
                  <h4 className="font-bold text-primary-900 mb-1">2021 - Reached 10K Customers</h4>
                  <p className="text-primary-600">Expanded our catalog and launched in 5 new countries.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-accent-100 rounded-full p-3 flex-shrink-0">
                  <FiAward className="text-xl text-accent-600" />
                </div>
                <div className="bg-white rounded-xl p-6 flex-grow border border-primary-100">
                  <h4 className="font-bold text-primary-900 mb-1">2022 - Won Best Online Bookstore Award</h4>
                  <p className="text-primary-600">Recognized for excellence in service and selection by industry leaders.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-accent-100 rounded-full p-3 flex-shrink-0">
                  <FiUsers className="text-xl text-accent-600" />
                </div>
                <div className="bg-white rounded-xl p-6 flex-grow border border-primary-100">
                  <h4 className="font-bold text-primary-900 mb-1">2023 - Reached 100K Customers</h4>
                  <p className="text-primary-600">Launched mobile app and expanded to 150+ countries worldwide.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-accent-100 rounded-full p-3 flex-shrink-0">
                  <FiZap className="text-xl text-accent-600" />
                </div>
                <div className="bg-white rounded-xl p-6 flex-grow border border-primary-100">
                  <h4 className="font-bold text-primary-900 mb-1">2024 - Today & Beyond</h4>
                  <p className="text-primary-600">Continuing to innovate and serve readers around the world with new features and services.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-accent-500 to-accent-600 text-white py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Growing Community</h2>
            <p className="text-lg text-accent-100 mb-8">
              Discover thousands of books and connect with book lovers from around the world.
            </p>
            <button className="bg-white text-accent-600 px-8 py-3 rounded-lg hover:bg-accent-50 transition-all font-semibold shadow-lg">
              Start Exploring
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
