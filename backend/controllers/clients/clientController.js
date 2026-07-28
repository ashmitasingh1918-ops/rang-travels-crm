const prisma = require("../../config/prisma");

// ─────────────────────────────────────────────
// Helper: verify city exists
// ─────────────────────────────────────────────
const findCity = (cityId) =>
  prisma.city.findUnique({ where: { id: Number(cityId) } });

// ─────────────────────────────────────────────
// POST /api/v1/clients
// ─────────────────────────────────────────────
const createClient = async (req, res) => {
  try {
    const { fullName, phone, email, address, cityId } = req.body;

    // Required field validation
    if (!fullName || !phone || !cityId) {
      return res.status(400).json({
        success: false,
        message: "fullName, phone, and cityId are required",
        data: null,
      });
    }

    // Verify city exists
    const city = await findCity(cityId);
    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
        data: null,
      });
    }

    // Prevent duplicate phone
    const phoneExists = await prisma.client.findUnique({ where: { phone } });
    if (phoneExists) {
      return res.status(409).json({
        success: false,
        message: "A client with this phone number already exists",
        data: null,
      });
    }

    // Prevent duplicate email (only if provided)
    if (email) {
      const emailExists = await prisma.client.findUnique({ where: { email } });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "A client with this email address already exists",
          data: null,
        });
      }
    }

    const client = await prisma.client.create({
      data: {
        fullName,
        phone,
        email: email || null,
        address: address || null,
        cityId: Number(cityId),
      },
      include: { city: true },
    });

    return res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client,
    });
  } catch (error) {
    console.error("[createClient]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create client",
      data: null,
    });
  }
};

// ─────────────────────────────────────────────
// GET /api/v1/clients (Joined with Tours & stats)
// ─────────────────────────────────────────────
const getAllClients = async (req, res) => {
  try {
    const search = req.query.search || "";
    const cityId = req.query.cityId ? Number(req.query.cityId) : null;
    const tripStatus = req.query.tripStatus || "";
    const travelDate = req.query.travelDate || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build the query where clause
    const where = {};

    // 1. Text Search (fullName, phone, email)
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // 2. City Filter
    if (cityId) {
      where.cityId = cityId;
    }

    // 3. Trip Status / Travel Date filters via relation
    if (tripStatus || travelDate) {
      const tourConditions = {};
      
      if (tripStatus) {
        tourConditions.tripStatus = tripStatus;
      }
      
      if (travelDate) {
        const startOfDay = new Date(travelDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(travelDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        tourConditions.travelDate = {
          gte: startOfDay,
          lte: endOfDay,
        };
      }

      where.tours = {
        some: tourConditions,
      };
    }

    // Get paginated clients list
    const clients = await prisma.client.findMany({
      where,
      include: {
        city: true,
        tours: {
          orderBy: { bookingDate: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    // Get total match count for pagination
    const totalItems = await prisma.client.count({ where });

    // Calculate dynamic stats from DB
    const totalClients = await prisma.client.count();
    const upcomingTrips = await prisma.tour.count({ where: { tripStatus: "UPCOMING" } });
    const ongoingTrips = await prisma.tour.count({ where: { tripStatus: "ONGOING" } });
    const completedTrips = await prisma.tour.count({ where: { tripStatus: "COMPLETED" } });
    const cancelledTrips = await prisma.tour.count({ where: { tripStatus: "CANCELLED" } });

    return res.status(200).json({
      success: true,
      message: "Clients fetched successfully",
      data: {
        clients,
        pagination: {
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
          limit,
        },
        stats: {
          totalClients,
          upcomingTrips,
          ongoingTrips,
          completedTrips,
          cancelledTrips,
        },
      },
    });
  } catch (error) {
    console.error("[getAllClients]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// GET /api/v1/clients/:id
// ─────────────────────────────────────────────
const getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: { id: Number(id) },
      include: {
        city: true,
        tours: {
          orderBy: { bookingDate: "desc" },
        },
      },
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client fetched successfully",
      data: client,
    });
  } catch (error) {
    console.error("[getClientById]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch client",
      data: null,
    });
  }
};

// ─────────────────────────────────────────────
// PUT /api/v1/clients/:id
// ─────────────────────────────────────────────
const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, email, address, cityId, isActive } = req.body;

    // Check client exists
    const existing = await prisma.client.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
        data: null,
      });
    }

    // Verify city exists (if cityId is being updated)
    if (cityId) {
      const city = await findCity(cityId);
      if (!city) {
        return res.status(404).json({
          success: false,
          message: "City not found",
          data: null,
        });
      }
    }

    // Prevent duplicate phone (excluding current client)
    if (phone && phone !== existing.phone) {
      const phoneExists = await prisma.client.findUnique({ where: { phone } });
      if (phoneExists) {
        return res.status(409).json({
          success: false,
          message: "A client with this phone number already exists",
          data: null,
        });
      }
    }

    // Prevent duplicate email (excluding current client)
    if (email && email !== existing.email) {
      const emailExists = await prisma.client.findUnique({ where: { email } });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "A client with this email address already exists",
          data: null,
        });
      }
    }

    const updatedClient = await prisma.client.update({
      where: { id: Number(id) },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email: email || null }),
        ...(address !== undefined && { address: address || null }),
        ...(cityId !== undefined && { cityId: Number(cityId) }),
        ...(isActive !== undefined && { isActive }),
      },
      include: { city: true, tours: { orderBy: { bookingDate: "desc" } } },
    });

    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: updatedClient,
    });
  } catch (error) {
    console.error("[updateClient]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update client",
      data: null,
    });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/v1/clients/:id
// ─────────────────────────────────────────────
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.client.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
        data: null,
      });
    }

    await prisma.client.delete({ where: { id: Number(id) } });

    return res.status(200).json({
      success: true,
      message: "Client deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("[deleteClient]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete client",
      data: null,
    });
  }
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
};