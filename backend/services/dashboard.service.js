const prisma = require("../config/prisma");

// Get Dashboard Summary Data
const getDashboardData = async () => {
    const [
        totalClients,
        totalHotels,
        totalCities,
        totalTours,
        activeHotels,
        inactiveHotels,
    ] = await Promise.all([
        prisma.client.count(),
        prisma.hotel.count(),
        prisma.city.count(),
        prisma.tour.count(),
        prisma.hotel.count({ where: { isActive: true } }),
        prisma.hotel.count({ where: { isActive: false } }),
    ]);

    return {
        totalClients,
        totalHotels,
        totalCities,
        totalTours,
        activeHotels,
        inactiveHotels,
    };
};

module.exports = {
    getDashboardData,
};