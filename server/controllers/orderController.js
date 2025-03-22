const { default: mongoose } = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, totalAmount, paymentIntentId } = req.body;
    console.log("🛒 Order Details:", { items, totalAmount, paymentIntentId });

    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Prevent duplicate orders with the same paymentIntentId
    const existingOrder = await Order.findOne({ paymentIntentId }).session(session);
    if (existingOrder) {
      return res.status(400).json({ error: "Order already exists for this payment intent" });
    }

    // Validate stock availability and update stock in the Product model
    const updatedItems = [];

    for (const item of items) {
      if (!item._id) {
        return res.status(400).json({ error: "Each item must have a productId" });
      }

      const product = await Product.findById(item._id).session(session);
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${item._id}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        });
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save({ session });

      updatedItems.push({
        productId: item._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    // Create the order
    const order = new Order({
      userId,
      items: updatedItems,
      totalAmount,
      paymentIntentId,
      status: "paid",
    });

    console.log("✅ Saving order:", order);
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Error creating order:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from token

    // Fetch user's orders, sorted by latest first, and populate product details
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("items.productId", "name price image"); // Adjust fields as needed

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching orders.",
      error: error.message,
    });
  }
};
