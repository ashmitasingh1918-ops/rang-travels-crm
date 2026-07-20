const prisma = require("../config/prisma");

/**
 * Get all cities
 * GET /api/v1/cities
 */
const getAllCities = async (req, res) => {
  try {
    const cities = await prisma.city.findMany({
      orderBy: { createdAt: "desc" }
    });
    return res.status(200).json({
      success: true,
      message: "Cities retrieved successfully",
      data: cities
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve cities",
      error: error.message
    });
  }
};

/**
 * Get a single city by ID
 * GET /api/v1/cities/:id
 */
const getCityById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid city ID format",
        error: "ID must be a number"
      });
    }

    const city = await prisma.city.findUnique({
      where: { id }
    });

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
        error: `City with ID ${id} does not exist`
      });
    }

    return res.status(200).json({
      success: true,
      message: "City retrieved successfully",
      data: city
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve city",
      error: error.message
    });
  }
};

/**
 * Create a new city
 * POST /api/v1/cities
 */
const createCity = async (req, res) => {
  try {
    const { name, state, code } = req.body;

    // Validation
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: "Name is required and must be a non-empty string"
      });
    }
    if (!state || typeof state !== "string" || state.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: "State is required and must be a non-empty string"
      });
    }
    if (!code || typeof code !== "string" || code.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: "Code is required and must be a non-empty string"
      });
    }

    const normalizedCode = code.trim().toUpperCase();

    // Prevent duplicate city code
    const existingCity = await prisma.city.findUnique({
      where: { code: normalizedCode }
    });

    if (existingCity) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: `City with code '${normalizedCode}' already exists`
      });
    }

    const newCity = await prisma.city.create({
      data: {
        name: name.trim(),
        state: state.trim(),
        code: normalizedCode
      }
    });

    return res.status(201).json({
      success: true,
      message: "City created successfully",
      data: newCity
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create city",
      error: error.message
    });
  }
};

/**
 * Update city details by ID
 * PUT /api/v1/cities/:id
 */
const updateCity = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid city ID format",
        error: "ID must be a number"
      });
    }

    const { name, state, code } = req.body;

    // Check if city exists
    const existingCity = await prisma.city.findUnique({
      where: { id }
    });

    if (!existingCity) {
      return res.status(404).json({
        success: false,
        message: "City not found",
        error: `City with ID ${id} does not exist`
      });
    }

    // Validation
    if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: "Name must be a non-empty string"
      });
    }
    if (state !== undefined && (typeof state !== "string" || state.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: "State must be a non-empty string"
      });
    }
    if (code !== undefined && (typeof code !== "string" || code.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: "Code must be a non-empty string"
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (state !== undefined) updateData.state = state.trim();
    
    if (code !== undefined) {
      const normalizedCode = code.trim().toUpperCase();
      // Prevent duplicate city code if code has changed
      if (normalizedCode !== existingCity.code) {
        const duplicateCodeCity = await prisma.city.findUnique({
          where: { code: normalizedCode }
        });
        if (duplicateCodeCity) {
          return res.status(400).json({
            success: false,
            message: "Validation failed",
            error: `City with code '${normalizedCode}' already exists`
          });
        }
      }
      updateData.code = normalizedCode;
    }

    const updatedCity = await prisma.city.update({
      where: { id },
      data: updateData
    });

    return res.status(200).json({
      success: true,
      message: "City updated successfully",
      data: updatedCity
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update city",
      error: error.message
    });
  }
};

/**
 * Delete a city by ID
 * DELETE /api/v1/cities/:id
 */
const deleteCity = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid city ID format",
        error: "ID must be a number"
      });
    }

    // Check if city exists
    const existingCity = await prisma.city.findUnique({
      where: { id }
    });

    if (!existingCity) {
      return res.status(404).json({
        success: false,
        message: "City not found",
        error: `City with ID ${id} does not exist`
      });
    }

    await prisma.city.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: "City deleted successfully",
      data: existingCity
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete city",
      error: error.message
    });
  }
};

module.exports = {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity
};
