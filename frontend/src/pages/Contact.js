import React, { useState } from "react";
import Layout from "./../components/Layout/Layout";
import toast from "react-hot-toast";
import { FiMail, FiPhone, FiMapPin, FiClock, FiHeadphones, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill all fields");
      return;
    }
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Layout title={"Contact Us - Booklet"}>
      <div className="pt-24 pb-16 bg-primary-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-br from-accent-500 to-accent-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Get in Touch</h1>
            <p className="text-lg text-accent-100">We'd love to hear from you. Send us a message!</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-primary-100 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-accent-100 p-3 rounded-lg">
                  <FiMail className="text-2xl text-accent-600" />
                </div>
                <div>
                  <h3 className="font-bold text-primary-900">Email</h3>
                  <p className="text-sm text-primary-600">We'll respond within 24 hours</p>
                </div>
              </div>
              <p className="text-accent-600 font-semibold">help@booklet.com</p>
              <p className="text-accent-600 font-semibold">support@booklet.com</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-primary-100 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-accent-100 p-3 rounded-lg">
                  <FiPhone className="text-2xl text-accent-600" />
                </div>
                <div>
                  <h3 className="font-bold text-primary-900">Phone</h3>
                  <p className="text-sm text-primary-600">Available 24/7</p>
                </div>
              </div>
              <p className="text-accent-600 font-semibold">+1 (800) 123-4567</p>
              <p className="text-accent-600 font-semibold">+1 (800) BOOKLET</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-primary-100 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-accent-100 p-3 rounded-lg">
                  <FiMapPin className="text-2xl text-accent-600" />
                </div>
                <div>
                  <h3 className="font-bold text-primary-900">Address</h3>
                  <p className="text-sm text-primary-600">Headquarters</p>
                </div>
              </div>
              <p className="text-primary-700 font-semibold">Booklet Inc.</p>
              <p className="text-primary-600 text-sm">123 Book Street, Library City<br />BC 12345, Canada</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-primary-100">
              <h2 className="text-2xl font-bold text-primary-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-primary-900 font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-primary-900 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-primary-900 font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-primary-900 font-semibold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    placeholder="Tell us more..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent-100 text-accent-700 py-3 rounded-lg hover:bg-accent-200 transition-all font-semibold border border-accent-200 shadow-sm"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Additional Info */}
            <div className="space-y-6">
              {/* Hours */}
              <div className="bg-white rounded-xl shadow-lg p-8 border border-primary-100">
                <div className="flex items-center gap-3 mb-4">
                  <FiClock className="text-2xl text-accent-600" />
                  <h3 className="text-xl font-bold text-primary-900">Business Hours</h3>
                </div>
                <div className="space-y-2 text-primary-700">
                  <p><span className="font-semibold">Monday - Friday:</span> 9:00 AM - 6:00 PM</p>
                  <p><span className="font-semibold">Saturday:</span> 10:00 AM - 4:00 PM</p>
                  <p><span className="font-semibold">Sunday:</span> 11:00 AM - 3:00 PM</p>
                  <p className="text-sm text-primary-600 mt-3">📞 24/7 Phone Support Available</p>
                </div>
              </div>

              {/* Support */}
              <div className="bg-white rounded-xl shadow-lg p-8 border border-primary-100">
                <div className="flex items-center gap-3 mb-4">
                  <FiHeadphones className="text-2xl text-accent-600" />
                  <h3 className="text-xl font-bold text-primary-900">Support</h3>
                </div>
                <p className="text-primary-700 mb-4">
                  Our dedicated support team is here to help with any questions about your orders, accounts, or the Booklet experience.
                </p>
                <button className="w-full bg-primary-100 text-primary-800 py-3 rounded-lg hover:bg-primary-200 transition-all font-semibold">
                  Chat with Support
                </button>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-xl shadow-lg p-8 border border-primary-100">
                <h3 className="text-xl font-bold text-primary-900 mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="p-3 bg-accent-100 text-accent-600 rounded-lg hover:bg-accent-200 transition-all">
                    <FiFacebook className="text-xl" />
                  </a>
                  <a href="#" className="p-3 bg-accent-100 text-accent-600 rounded-lg hover:bg-accent-200 transition-all">
                    <FiTwitter className="text-xl" />
                  </a>
                  <a href="#" className="p-3 bg-accent-100 text-accent-600 rounded-lg hover:bg-accent-200 transition-all">
                    <FiInstagram className="text-xl" />
                  </a>
                  <a href="#" className="p-3 bg-accent-100 text-accent-600 rounded-lg hover:bg-accent-200 transition-all">
                    <FiLinkedin className="text-xl" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-primary-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-primary-100">
                <h4 className="font-bold text-primary-900 mb-2">How do I track my order?</h4>
                <p className="text-primary-600 text-sm">You'll receive a tracking email with a link. You can also track orders in your dashboard under "Orders".</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8 border border-primary-100">
                <h4 className="font-bold text-primary-900 mb-2">What's your return policy?</h4>
                <p className="text-primary-600 text-sm">We offer 30-day returns on most items. Books must be in original condition with all original packaging.</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8 border border-primary-100">
                <h4 className="font-bold text-primary-900 mb-2">Do you ship internationally?</h4>
                <p className="text-primary-600 text-sm">Yes! We ship to over 100 countries. Shipping costs vary based on location and weight.</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8 border border-primary-100">
                <h4 className="font-bold text-primary-900 mb-2">How can I get a refund?</h4>
                <p className="text-primary-600 text-sm">Request a return within 30 days of purchase. Refunds are processed within 7-10 business days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
