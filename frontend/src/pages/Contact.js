import React, { useState } from "react";
import Layout from "./../components/Layout/Layout";
import toast from "react-hot-toast";
import {
  FiClock,
  FiFacebook,
  FiHeadphones,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
  FiTwitter,
} from "react-icons/fi";

const contactCards = [
  {
    title: "Email Support",
    subtitle: "Response within 24 hours",
    primary: "help@booklet.com",
    secondary: "support@booklet.com",
    icon: FiMail,
  },
  {
    title: "Phone Support",
    subtitle: "Available all week",
    primary: "+1 (800) 123-4567",
    secondary: "+1 (800) 266-5538",
    icon: FiPhone,
  },
  {
    title: "Office",
    subtitle: "Headquarters",
    primary: "Booklet Inc.",
    secondary: "123 Book Street, BC 12345, Canada",
    icon: FiMapPin,
  },
];

const faqs = [
  {
    question: "How do I track my order?",
    answer:
      "You will receive a tracking link by email. You can also check order status in your dashboard.",
  },
  {
    question: "What is the return window?",
    answer:
      "Most items are eligible for return within 30 days in original condition.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to multiple countries with shipping options shown at checkout.",
  },
  {
    question: "How fast do refunds process?",
    answer:
      "Approved refunds are typically processed within 7 to 10 business days.",
  },
];

const socialLinks = [
  { label: "Facebook", icon: FiFacebook, href: "https://facebook.com" },
  { label: "Twitter", icon: FiTwitter, href: "https://twitter.com" },
  { label: "Instagram", icon: FiInstagram, href: "https://instagram.com" },
  { label: "LinkedIn", icon: FiLinkedin, href: "https://linkedin.com" },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
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
      <div className="pt-24 pb-14 min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50">
        <section className="bg-gradient-to-r from-primary-900 via-primary-800 to-accent-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
            <h1 className="text-3xl sm:text-4xl font-bold">Contact Booklet</h1>
            <p className="mt-2 text-sm sm:text-base text-primary-100 max-w-2xl">
              Questions about orders, payments, or recommendations? Reach out and our
              support team will help quickly.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              {contactCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article
                    key={card.title}
                    className="rounded-2xl border border-primary-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-accent-100 text-accent-700 inline-flex items-center justify-center shrink-0">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-semibold text-primary-900 m-0">
                          {card.title}
                        </h2>
                        <p className="mt-1 text-xs sm:text-sm text-primary-500 m-0">
                          {card.subtitle}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm font-medium text-primary-800 m-0">{card.primary}</p>
                    <p className="mt-1 text-sm text-primary-600 m-0">{card.secondary}</p>
                  </article>
                );
              })}

              <article className="rounded-2xl border border-primary-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <FiHeadphones className="h-4.5 w-4.5 text-accent-700" />
                  <h2 className="text-base sm:text-lg font-semibold text-primary-900 m-0">
                    Social Support
                  </h2>
                </div>
                <p className="text-sm text-primary-600 leading-relaxed">
                  For updates and quick responses, connect with us on social channels.
                </p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={social.label}
                        className="h-10 w-10 rounded-lg border border-accent-200 bg-accent-50 text-accent-700 hover:bg-accent-100 inline-flex items-center justify-center transition-colors"
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </a>
                    );
                  })}
                </div>
              </article>
            </div>

            <div className="lg:col-span-7">
              <article className="rounded-2xl border border-primary-200 bg-white p-5 sm:p-6 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-semibold text-primary-900">
                  Send us a message
                </h2>
                <p className="mt-1.5 text-sm text-primary-600">
                  Share your request and we will get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-primary-800">Name</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="mt-1.5 w-full h-11 rounded-lg border border-primary-200 bg-white px-3.5 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-accent-300"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-primary-800">Email</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="mt-1.5 w-full h-11 rounded-lg border border-primary-200 bg-white px-3.5 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-accent-300"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-sm font-medium text-primary-800">Subject</span>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className="mt-1.5 w-full h-11 rounded-lg border border-primary-200 bg-white px-3.5 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-accent-300"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-sm font-medium text-primary-800">Message</span>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      placeholder="Tell us more..."
                      className="mt-1.5 w-full rounded-lg border border-primary-200 bg-white px-3.5 py-3 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-accent-300 resize-y"
                    />
                  </label>

                  <button
                    type="submit"
                    className="sm:col-span-2 h-11 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold inline-flex items-center justify-center gap-2"
                  >
                    <FiSend className="h-4 w-4" />
                    Send Message
                  </button>
                </form>
              </article>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <article className="rounded-xl border border-primary-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <FiClock className="h-4.5 w-4.5 text-accent-700" />
                    <h3 className="text-base font-semibold text-primary-900 m-0">Business Hours</h3>
                  </div>
                  <p className="text-sm text-primary-600 m-0">Mon - Fri: 9:00 AM to 6:00 PM</p>
                  <p className="text-sm text-primary-600 m-0">Sat: 10:00 AM to 4:00 PM</p>
                  <p className="text-sm text-primary-600 m-0">Sun: Limited support</p>
                </article>
                <article className="rounded-xl border border-primary-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <FiHeadphones className="h-4.5 w-4.5 text-accent-700" />
                    <h3 className="text-base font-semibold text-primary-900 m-0">Quick Help</h3>
                  </div>
                  <p className="text-sm text-primary-600 m-0">
                    For urgent order questions, phone and email support are prioritized.
                  </p>
                </article>
              </div>
            </div>
          </div>

          <section className="mt-8 rounded-2xl border border-primary-200 bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary-900">
              Frequently Asked Questions
            </h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {faqs.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-xl border border-primary-100 bg-primary-50/60 p-4"
                >
                  <h3 className="text-sm sm:text-base font-semibold text-primary-900 m-0">
                    {faq.question}
                  </h3>
                  <p className="mt-1.5 text-sm text-primary-600 leading-relaxed m-0">
                    {faq.answer}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
