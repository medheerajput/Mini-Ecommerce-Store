const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Reference to the User model

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ], // Stores product details for each item in the order

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    }, // Total price of the order

    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
    }, // Stripe payment intent ID

    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    }, // Order status with predefined values
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
