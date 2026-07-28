const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const prisma = require("./config/prisma");

// Routes
const authRoutes = require("./routes/authRoutes");
const cityRoutes = require("./routes/cityRoutes");
const clientRoutes = require("./routes/clientRoutes");
const staffRoutes = require("./routes/staff.routes");
const tourRoutes = require("./routes/tour.routes");
const hotelRoutes = require("./routes/hotelRoutes");
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/v1/cities", cityRoutes);
app.use("/api/v1/clients", clientRoutes);
app.use("/api/v1/staff", staffRoutes);
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/hotels", hotelRoutes);
// Home Route
app.get("/", (req, res) => {
  res.send("Rang Travels CRM Backend is running...");
});

// Test Database Connection
app.get("/test-db", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json({
      success: true,
      message: "Database connected successfully",
      users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

module.exports = app;