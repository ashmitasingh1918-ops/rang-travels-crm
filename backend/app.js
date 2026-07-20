const express = require("express");
const cors = require("cors");
const prisma = require("./config/prisma");
const cityRoutes = require("./routes/cityRoutes");

const app = express();

app.use(cors());
app.use(express.json());

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