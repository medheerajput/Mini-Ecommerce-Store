const express = require("express");
const { registerUser, loginUser, getMe, logoutUser } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { getProducts } = require("../controllers/getProducts");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", verifyToken, getMe);
router.get("/products", verifyToken, getProducts);
router.post("/logout", logoutUser);

module.exports = router;
