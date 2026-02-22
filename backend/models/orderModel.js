import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    deliveryLocation: {
      type: String,
      default: "",
    },
    deliveryLocationLabel: {
      type: String,
      default: "",
    },
    deliveryPincode: {
      type: String,
      default: "",
    },
    deliveryDistanceKm: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
