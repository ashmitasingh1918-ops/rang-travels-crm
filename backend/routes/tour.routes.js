const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tours/tour.controller");

// POST create tour
router.post("/", tourController.createTour);

// GET all tours
router.get("/", tourController.getAllTours);

// GET tour by ID
router.get("/:id", tourController.getTourById);

// PUT update tour details
router.put("/:id", tourController.updateTour);

// DELETE tour
router.delete("/:id", tourController.deleteTour);

// PATCH update trip status only
router.patch("/:id/status", tourController.updateTripStatus);

module.exports = router;
