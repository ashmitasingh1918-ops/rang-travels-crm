const prisma = require("../../config/prisma");
const { generateNextTourId } = require("../../utils/tourIdGenerator");


// GET /api/v1/bookings
const getAllBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const bookings = await prisma.booking.findMany({
      where: status ? { status } : {},
      include: {
        client: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings
    });
  } catch (error) {
    console.error("[getAllBookings]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings"
    });
  }
};

// GET /api/v1/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
      include: {
        client: true
      }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: booking
    });
  } catch (error) {
    console.error("[getBookingById]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking"
    });
  }
};

// POST /api/v1/bookings
const createBooking = async (req, res) => {
  try {
    const {
      clientId,
      startDate,
      endDate,
      status,
      hotelName,
      hotelAddress,
      hotelPhone,
      hotelEmail,
      roomType,
      numberOfRooms,
      mealPlan,
      nationality,
      travelers
    } = req.body;

    if (!clientId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "clientId, startDate, and endDate are required"
      });
    }

    // Verify client exists
    const client = await prisma.client.findUnique({
      where: { id: Number(clientId) }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }

    const booking = await prisma.$transaction(async (tx) => {
      // Safely generate the next sequential unique Tour ID
      const generatedFileNo = await generateNextTourId(tx, new Date());

      return await tx.booking.create({
        data: {
          fileNo: generatedFileNo,
          clientId: Number(clientId),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          status: status || "planning",
          hotelName,
          hotelAddress,
          hotelPhone,
          hotelEmail,
          roomType,
          numberOfRooms: numberOfRooms || "1 ROOM",
          mealPlan,
          nationality,
          travelers: Number(travelers || 1)
        },
        include: {
          client: true
        }
      });
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking
    });
  } catch (error) {
    console.error("[createBooking]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create booking"
    });
  }
};

// PUT /api/v1/bookings/:id
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existing = await prisma.booking.findUnique({
      where: { id: Number(id) }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Check fileNo unique if updated
    if (updateData.fileNo && updateData.fileNo !== existing.fileNo) {
      const duplicate = await prisma.booking.findUnique({
        where: { fileNo: updateData.fileNo }
      });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "A booking with this file number already exists"
        });
      }
    }

    // Prepare data
    const data = { ...updateData };
    if (data.clientId) data.clientId = Number(data.clientId);
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    if (data.travelers) data.travelers = Number(data.travelers);

    const updated = await prisma.booking.update({
      where: { id: Number(id) },
      data,
      include: {
        client: true
      }
    });

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("[updateBooking]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update booking"
    });
  }
};

// DELETE /api/v1/bookings/:id
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.booking.findUnique({
      where: { id: Number(id) }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    await prisma.booking.delete({
      where: { id: Number(id) }
    });

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully"
    });
  } catch (error) {
    console.error("[deleteBooking]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete booking"
    });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
};
