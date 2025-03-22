const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const { getProducts } = require("../controllers/getProducts");

const router = express.Router();

router.get("/products", verifyToken, getProducts);

module.exports = router;
