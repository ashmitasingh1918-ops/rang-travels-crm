const prisma = require("../../config/prisma");

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const findClient = (clientId) =>
  prisma.client.findUnique({ where: { id: Number(clientId) } });

// ─────────────────────────────────────────────
// POST /api/v1/tours
// ─────────────────────────────────────────────
const createTour = async (req, res) => {
  try {
    const {
      clientId,
      destination,
      packageName,
      travelDate,
      numberOfTravelers,
      paymentStatus,
      tripStatus,
      remarks,
    } = req.body;

    if (!clientId || !destination || !packageName || !travelDate) {
      return res.status(400).json({
        success: false,
        message: "clientId, destination, packageName, and travelDate are required",
        data: null,
      });
    }

    const clientExists = await findClient(clientId);
    if (!clientExists) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
        data: null,
      });
    }

    const tour = await prisma.tour.create({
      data: {
        clientId: Number(clientId),
        destination,
        packageName,
        travelDate: new Date(travelDate),
        numberOfTravelers: numberOfTravelers ? Number(numberOfTravelers) : 1,
        paymentStatus: paymentStatus || "UNPAID",
        tripStatus: tripStatus || "UPCOMING",
        remarks: remarks || null,
      },
      include: { client: true },
    });

    return res.status(201).json({
      success: true,
      message: "Tour created successfully",
      data: tour,
    });
  } catch (error) {
    console.error("[createTour]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create tour",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// GET /api/v1/tours
// ─────────────────────────────────────────────
const getAllTours = async (req, res) => {
  try {
    const search = req.query.search || "";
    const clientId = req.query.clientId ? Number(req.query.clientId) : null;
    const tripStatus = req.query.tripStatus || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "travelDate";
    const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

    // Build the query where clause
    const where = {};

    // 1. Text Search (destination, packageName)
    if (search) {
      where.OR = [
        { destination: { contains: search, mode: "insensitive" } },
        { packageName: { contains: search, mode: "insensitive" } },
      ];
    }

    // 2. Client ID Filter
    if (clientId) {
      where.clientId = clientId;
    }

    // 3. Trip Status Filter
    if (tripStatus) {
      where.tripStatus = tripStatus;
    }

    // Determine allowed sortBy fields
    const allowedSortFields = ["travelDate", "bookingDate", "createdAt", "updatedAt", "numberOfTravelers"];
    const actualSortBy = allowedSortFields.includes(sortBy) ? sortBy : "travelDate";

    // Get paginated tours list
    const tours = await prisma.tour.findMany({
      where,
      include: {
        client: {
          include: {
            city: true,
          },
        },
      },
      orderBy: { [actualSortBy]: sortOrder },
      skip,
      take: limit,
    });

    // Get total match count for pagination
    const totalItems = await prisma.tour.count({ where });

    return res.status(200).json({
      success: true,
      message: "Tours fetched successfully",
      data: {
        tours,
        pagination: {
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
          limit,
        },
      },
    });
  } catch (error) {
    console.error("[getAllTours]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tours",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// GET /api/v1/tours/:id
// ─────────────────────────────────────────────
const getTourById = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await prisma.tour.findUnique({
      where: { id: Number(id) },
      include: { client: { include: { city: true } } },
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tour fetched successfully",
      data: tour,
    });
  } catch (error) {
    console.error("[getTourById]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tour",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// PUT /api/v1/tours/:id
// ─────────────────────────────────────────────
const updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      destination,
      packageName,
      travelDate,
      numberOfTravelers,
      paymentStatus,
      tripStatus,
      remarks,
    } = req.body;

    const existing = await prisma.tour.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
        data: null,
      });
    }

    const updatedTour = await prisma.tour.update({
      where: { id: Number(id) },
      data: {
        ...(destination !== undefined && { destination }),
        ...(packageName !== undefined && { packageName }),
        ...(travelDate !== undefined && { travelDate: new Date(travelDate) }),
        ...(numberOfTravelers !== undefined && { numberOfTravelers: Number(numberOfTravelers) }),
        ...(paymentStatus !== undefined && { paymentStatus }),
        ...(tripStatus !== undefined && { tripStatus }),
        ...(remarks !== undefined && { remarks: remarks || null }),
      },
      include: { client: true },
    });

    return res.status(200).json({
      success: true,
      message: "Tour updated successfully",
      data: updatedTour,
    });
  } catch (error) {
    console.error("[updateTour]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update tour",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/v1/tours/:id
// ─────────────────────────────────────────────
const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.tour.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
        data: null,
      });
    }

    await prisma.tour.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      success: true,
      message: "Tour deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("[deleteTour]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete tour",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// PATCH /api/v1/tours/:id/status
// ─────────────────────────────────────────────
const updateTripStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { tripStatus } = req.body;

    if (!tripStatus) {
      return res.status(400).json({
        success: false,
        message: "tripStatus is required",
        data: null,
      });
    }

    const existing = await prisma.tour.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
        data: null,
      });
    }

    const updatedTour = await prisma.tour.update({
      where: { id: Number(id) },
      data: { tripStatus },
      include: { client: true },
    });

    return res.status(200).json({
      success: true,
      message: "Trip status updated successfully",
      data: updatedTour,
    });
  } catch (error) {
    console.error("[updateTripStatus]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update trip status",
      error: error.message,
    });
  }
};

module.exports = {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
  updateTripStatus,
};
