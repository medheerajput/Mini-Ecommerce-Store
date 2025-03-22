const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {connectDB,seedDB} = require("./config/db");

dotenv.config();
connectDB();
// seedDB();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/orderRoutes"));
app.use("/api", require("./routes/productsRoute"));
app.use("/api", require("./routes/paymentRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
