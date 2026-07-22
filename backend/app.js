const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const prisma = require("./config/prisma");

const authRoutes = require("./routes/authRoutes");
const cityRoutes = require("./routes/cityRoutes");

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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/v1/cities", cityRoutes);

app.get("/", (req, res) => {
  res.send("Rang Travels CRM Backend is running...");
});

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json({
      success: true,
      message: "Database connected successfully",
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

module.exports = app;