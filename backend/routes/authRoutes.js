const express = require("express");
const router = express.Router();

const { login } = require("../controllers/auth/auth.controller");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post("/login", login);

router.get("/profile", authenticate, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

// Admin-only route
router.get(
    "/admin-dashboard",
    authenticate,
    authorize("ADMIN"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome Admin!"
        });
    }
);

module.exports = router;