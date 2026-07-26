const validateCreateStaff = (req, res, next) => {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email",
        });
    }

    if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({
            success: false,
            message: "Phone number must be exactly 10 digits",
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters",
        });
    }

    next();
};

const validateUpdateStaff = (req, res, next) => {
    const { fullName, email, phone } = req.body;

    if (!fullName || !email || !phone) {
        return res.status(400).json({
            success: false,
            message: "Full Name, Email, and Phone number are required",
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email",
        });
    }

    if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({
            success: false,
            message: "Phone number must be exactly 10 digits",
        });
    }

    next();
};

module.exports = {
    validateCreateStaff,
    validateUpdateStaff,
};