const prisma = require("../config/prisma");
const { validateTour, validateTourStatus } = require("../validators/tour.validator");

// Helper: Verify client exists
const findClient = async (clientId) => {
    return prisma.client.findUnique({
        where: { id: Number(clientId) },
    });
};

// Create Tour
const createTour = async (tourData) => {
    const validation = validateTour(tourData);
    if (!validation.isValid) {
        throw {
            status: 400,
            message: validation.message,
        };
    }

    const {
        clientId,
        destination,
        packageName,
        travelDate,
        numberOfTravelers,
        paymentStatus,
        tripStatus,
        remarks,
    } = tourData;

    const clientExists = await findClient(clientId);
    if (!clientExists) {
        throw {
            status: 404,
            message: "Client not found",
        };
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
        include: {
            client: {
                include: {
                    city: true,
                },
            },
        },
    });

    return tour;
};

// Get All Tours (Search, Filters, Pagination, Sorting)
const getAllTours = async (query = {}) => {
    const search = query.search || "";
    const clientId = query.clientId ? Number(query.clientId) : null;
    const tripStatus = query.tripStatus || "";
    const paymentStatus = query.paymentStatus || "";
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = query.sortBy || "travelDate";
    const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

    const where = {};

    // Text Search
    if (search) {
        where.OR = [
            { destination: { contains: search, mode: "insensitive" } },
            { packageName: { contains: search, mode: "insensitive" } },
            { client: { fullName: { contains: search, mode: "insensitive" } } },
            { client: { phone: { contains: search, mode: "insensitive" } } },
        ];
    }

    // Client Filter
    if (clientId) {
        where.clientId = clientId;
    }

    // Trip Status Filter
    if (tripStatus) {
        where.tripStatus = tripStatus;
    }

    // Payment Status Filter
    if (paymentStatus) {
        where.paymentStatus = paymentStatus;
    }

    const allowedSortFields = [
        "travelDate",
        "bookingDate",
        "createdAt",
        "updatedAt",
        "numberOfTravelers",
    ];
    const actualSortBy = allowedSortFields.includes(sortBy) ? sortBy : "travelDate";

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

    const totalItems = await prisma.tour.count({ where });

    return {
        tours,
        pagination: {
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
            limit,
        },
    };
};

// Get Tour By ID
const getTourById = async (id) => {
    const tour = await prisma.tour.findUnique({
        where: { id: Number(id) },
        include: {
            client: {
                include: {
                    city: true,
                },
            },
        },
    });

    if (!tour) {
        throw {
            status: 404,
            message: "Tour not found",
        };
    }

    return tour;
};

// Update Tour Details
const updateTour = async (id, tourData) => {
    const existing = await prisma.tour.findUnique({
        where: { id: Number(id) },
    });

    if (!existing) {
        throw {
            status: 404,
            message: "Tour not found",
        };
    }

    const {
        destination,
        packageName,
        travelDate,
        numberOfTravelers,
        paymentStatus,
        tripStatus,
        remarks,
    } = tourData;

    const data = {};
    if (destination !== undefined) data.destination = destination;
    if (packageName !== undefined) data.packageName = packageName;
    if (travelDate !== undefined) data.travelDate = new Date(travelDate);
    if (numberOfTravelers !== undefined) data.numberOfTravelers = Number(numberOfTravelers);
    if (paymentStatus !== undefined) data.paymentStatus = paymentStatus;
    if (tripStatus !== undefined) data.tripStatus = tripStatus;
    if (remarks !== undefined) data.remarks = remarks || null;

    const updatedTour = await prisma.tour.update({
        where: { id: Number(id) },
        data,
        include: {
            client: {
                include: {
                    city: true,
                },
            },
        },
    });

    return updatedTour;
};

// Update Trip Status Only
const updateTripStatus = async (id, statusData) => {
    const validation = validateTourStatus(statusData);
    if (!validation.isValid) {
        throw {
            status: 400,
            message: validation.message,
        };
    }

    const existing = await prisma.tour.findUnique({
        where: { id: Number(id) },
    });

    if (!existing) {
        throw {
            status: 404,
            message: "Tour not found",
        };
    }

    const updatedTour = await prisma.tour.update({
        where: { id: Number(id) },
        data: { tripStatus: statusData.tripStatus },
        include: {
            client: {
                include: {
                    city: true,
                },
            },
        },
    });

    return updatedTour;
};

// Delete Tour
const deleteTour = async (id) => {
    const existing = await prisma.tour.findUnique({
        where: { id: Number(id) },
    });

    if (!existing) {
        throw {
            status: 404,
            message: "Tour not found",
        };
    }

    await prisma.tour.delete({
        where: { id: Number(id) },
    });
};

module.exports = {
    createTour,
    getAllTours,
    getTourById,
    updateTour,
    updateTripStatus,
    deleteTour,
};
