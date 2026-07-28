const hotelService = require("../../services/hotel.service");

// POST /api/v1/hotels
const createHotel = async (req, res) => {
    try {
        const hotel = await hotelService.createHotel(req.body);

        return res.status(201).json({
            success: true,
            message: "Hotel created successfully",
            data: hotel,
        });
    } catch (error) {
        console.error("[createHotel]", error);

        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Failed to create hotel",
            data: null,
        });
    }
};

const getAllHotels = async (req, res) => {
  try {
    const data = await hotelService.getAllHotels(req.query);

    return res.status(200).json({
      success: true,
      message: "Hotels fetched successfully",
      data,
    });
  } catch (error) {
    console.error("[getAllHotels]", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch hotels",
      data: null,
    });
  }
};


const getHotelById = async (req, res) => {
  try {
    const hotel = await hotelService.getHotelById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Hotel fetched successfully",
      data: hotel,
    });
  } catch (error) {
    console.error("[getHotelById]", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to fetch hotel",
      data: null,
    });
  }
};

// PUT /api/v1/hotels/:id
const updateHotel = async (req, res) => {
    try {
        const hotel = await hotelService.updateHotel(req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: "Hotel updated successfully",
            data: hotel,
        });
    } catch (error) {
        console.error("[updateHotel]", error);

        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Failed to update hotel",
            data: null,
        });
    }
};

// DELETE /api/v1/hotels/:id
const deleteHotel = async (req, res) => {
    try {
        await hotelService.deleteHotel(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Hotel deleted successfully",
            data: null,
        });
    } catch (error) {
        console.error("[deleteHotel]", error);

        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Failed to delete hotel",
            data: null,
        });
    }
};

module.exports = {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
};