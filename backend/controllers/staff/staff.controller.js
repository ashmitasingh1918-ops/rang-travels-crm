const {
    createStaffService,
    getAllStaff,
    getStaffById: getStaffByIdService,
    updateStaff: updateStaffService,
    deleteStaff: deleteStaffService,
} = require("../../services/staffService");

const createStaff = async (req, res) => {
    try {
        const staff = await createStaffService(req.body);

        res.status(201).json({
            success: true,
            message: "Staff created successfully",
            data: staff,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getStaff = async (req, res) => {
    try {
        const staff = await getAllStaff();

        res.status(200).json({
            success: true,
            data: staff,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getStaffById = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await getStaffByIdService(id);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff member not found",
            });
        }

        res.status(200).json({
            success: true,
            data: staff,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await updateStaffService(id, req.body);

        res.status(200).json({
            success: true,
            message: "Staff updated successfully",
            data: staff,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteStaffService(id);

        res.status(200).json({
            success: true,
            message: "Staff deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createStaff,
    getStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
};