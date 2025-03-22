const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  try {
    // Fetch only necessary fields to improve performance
    const products = await Product.find({})

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
    
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};
