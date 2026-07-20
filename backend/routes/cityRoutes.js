const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");

// GET /api/v1/cities
router.get("/", cityController.getAllCities);

// GET /api/v1/cities/:id
router.get("/:id", cityController.getCityById);

// POST /api/v1/cities
router.post("/", cityController.createCity);

// PUT /api/v1/cities/:id
router.put("/:id", cityController.updateCity);

// DELETE /api/v1/cities/:id
router.delete("/:id", cityController.deleteCity);

module.exports = router;
