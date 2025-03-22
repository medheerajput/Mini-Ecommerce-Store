const express = require("express");
const { createOrder, getUserOrders } = require("../controllers/orderController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Create Order (Protected)
router.post("/create-order", verifyToken, createOrder);

// Get All Orders for Logged-in User (Protected)
router.get("/user-orders", verifyToken, getUserOrders);

module.exports = router;
