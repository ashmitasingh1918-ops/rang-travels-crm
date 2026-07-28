const tourService = require("../../services/tour.service");

// POST /api/v1/tours
const createTour = async (req, res) => {
  try {
    const tour = await tourService.createTour(req.body);

    return res.status(201).json({
      success: true,
      message: "Tour created successfully",
      data: tour,
    });
  } catch (error) {
    console.error("[createTour]", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to create tour",
      data: null,
    });
  }
};

// GET /api/v1/tours
const getAllTours = async (req, res) => {
  try {
    const data = await tourService.getAllTours(req.query);

    return res.status(200).json({
      success: true,
      message: "Tours fetched successfully",
      data,
    });
  } catch (error) {
    console.error("[getAllTours]", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tours",
      data: null,
    });
  }
};

// GET /api/v1/tours/:id
const getTourById = async (req, res) => {
  try {
    const tour = await tourService.getTourById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Tour fetched successfully",
      data: tour,
    });
  } catch (error) {
    console.error("[getTourById]", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to fetch tour",
      data: null,
    });
  }
};

// PUT /api/v1/tours/:id
const updateTour = async (req, res) => {
  try {
    const tour = await tourService.updateTour(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Tour updated successfully",
      data: tour,
    });
  } catch (error) {
    console.error("[updateTour]", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to update tour",
      data: null,
    });
  }
};

// PATCH /api/v1/tours/:id/status
const updateTripStatus = async (req, res) => {
  try {
    const tour = await tourService.updateTripStatus(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Trip status updated successfully",
      data: tour,
    });
  } catch (error) {
    console.error("[updateTripStatus]", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to update trip status",
      data: null,
    });
  }
};

// DELETE /api/v1/tours/:id
const deleteTour = async (req, res) => {
  try {
    await tourService.deleteTour(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Tour deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("[deleteTour]", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to delete tour",
      data: null,
    });
  }
};

module.exports = {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  updateTripStatus,
  deleteTour,
};
