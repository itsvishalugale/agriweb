const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    crop: { type: mongoose.Schema.Types.ObjectId, ref: "Crop", required: true },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    txHash: { type: String }, // Mock for future blockchain
    deliveryDetails: {
      address: String,
      expectedDelivery: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
