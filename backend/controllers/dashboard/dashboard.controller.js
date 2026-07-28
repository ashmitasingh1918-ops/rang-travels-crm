const dashboardService = require("../../services/dashboard.service");

// GET /api/v1/dashboard
const getDashboardData = async (req, res) => {
    try {
        const data = await dashboardService.getDashboardData();

        return res.status(200).json({
            success: true,
            message: "Dashboard data fetched successfully",
            data,
        });
    } catch (error) {
        console.error("[getDashboardData]", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data",
            data: null,
        });
    }
};

module.exports = {
    getDashboardData,
};
