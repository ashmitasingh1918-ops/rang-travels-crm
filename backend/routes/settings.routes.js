const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
  changePassword,
  getCompany,
  updateCompany,
} = require("../controllers/settings/settings.controller");

router.use(authenticate);

// Profile
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// Security
router.put("/change-password", changePassword);

// Company
router.get("/company", getCompany);
router.put("/company", updateCompany);

module.exports = router;