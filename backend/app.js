const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors(
    {
    origin: "http://localhost:5173",
    credentials: true,
  }
));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

module.exports = app;