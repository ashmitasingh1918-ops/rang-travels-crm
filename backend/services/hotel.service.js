const prisma = require("../config/prisma");
const { validateHotel } = require("../validators/hotel.validator");

// Helper: Verify city exists
const findCity = async (cityId) => {
    return prisma.city.findUnique({
        where: { id: Number(cityId) },
    });
};

// Create Hotel
const createHotel = async (hotelData) => {
    const validation = validateHotel(hotelData);

    if (!validation.isValid) {
        throw {
            status: 400,
            message: validation.message,
        };
    }

    const {
        name,
        category,
        rating,
        contactPerson,
        email,
        phone,
        cityId,
    } = hotelData;





    // Check city exists
    const city = await findCity(cityId);

    if (!city) {
        throw {
            status: 404,
            message: "City not found",
        };
    }

    // Prevent duplicate email
    if (email) {
        const emailExists = await prisma.hotel.findFirst({
            where: { email },
        });

        if (emailExists) {
            throw {
                status: 409,
                message: "Hotel email already exists",
            };
        }
    }

    const hotel = await prisma.hotel.create({
        data: {
            name,
            category,
            rating,
            contactPerson,
            email: email || null,
            phone: phone || null,
            cityId: Number(cityId),
        },
        include: {
            city: true,
        },
    });

    return hotel;
};

const getAllHotels = async (query) => {
  const search = query.search || "";
  const cityId = query.cityId ? Number(query.cityId) : null;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  // Search by hotel name
  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  // Filter by city
  if (cityId) {
    where.cityId = cityId;
  }

  const hotels = await prisma.hotel.findMany({
    where,
    include: {
      city: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: limit,
  });

  const totalItems = await prisma.hotel.count({ where });

  return {
    hotels,
    pagination: {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      limit,
    },
  };
};

const getHotelById = async (id) => {
  const hotel = await prisma.hotel.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      city: true,
    },
  });

  if (!hotel) {
    throw {
      status: 404,
      message: "Hotel not found",
    };
  }

  return hotel;
};

// Update Hotel
const updateHotel = async (id, hotelData) => {
    // Verify hotel exists
    const existing = await prisma.hotel.findUnique({
        where: { id: Number(id) },
    });

    if (!existing) {
        throw {
            status: 404,
            message: "Hotel not found",
        };
    }

    const { name, category, rating, contactPerson, email, phone, cityId } = hotelData;

    // Verify city exists if cityId is being changed
    if (cityId && Number(cityId) !== existing.cityId) {
        const city = await findCity(cityId);

        if (!city) {
            throw {
                status: 404,
                message: "City not found",
            };
        }
    }

    // Prevent duplicate email except for the current hotel
    if (email && email !== existing.email) {
        const emailExists = await prisma.hotel.findFirst({
            where: {
                email,
                NOT: { id: Number(id) },
            },
        });

        if (emailExists) {
            throw {
                status: 409,
                message: "Hotel email already exists",
            };
        }
    }

    // Build partial update payload — only include fields provided
    const data = {};
    if (name !== undefined) data.name = name;
    if (category !== undefined) data.category = category;
    if (rating !== undefined) data.rating = rating;
    if (contactPerson !== undefined) data.contactPerson = contactPerson;
    if (email !== undefined) data.email = email || null;
    if (phone !== undefined) data.phone = phone || null;
    if (cityId !== undefined) data.cityId = Number(cityId);

    const hotel = await prisma.hotel.update({
        where: { id: Number(id) },
        data,
        include: {
            city: true,
        },
    });

    return hotel;
};

// Delete Hotel
const deleteHotel = async (id) => {
    // Verify hotel exists
    const existing = await prisma.hotel.findUnique({
        where: { id: Number(id) },
    });

    if (!existing) {
        throw {
            status: 404,
            message: "Hotel not found",
        };
    }

    await prisma.hotel.delete({
        where: { id: Number(id) },
    });
};

module.exports = {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
};