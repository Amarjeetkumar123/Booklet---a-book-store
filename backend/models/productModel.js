import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    shipping: {
      type: Boolean,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    serviceLocations: {
      type: [String],
      default: ["all"],
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);
