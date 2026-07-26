const express = require("express");
const router = express.Router();
const {
  createStaff,
  getStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
} = require("../controllers/staff/staff.controller");
const {
  validateCreateStaff,
  validateUpdateStaff,
} = require("../validators/staff.validator");

router.post("/", validateCreateStaff, createStaff);
router.get("/", getStaff);
router.get("/:id", getStaffById);
router.put("/:id", validateUpdateStaff, updateStaff);
router.delete("/:id", deleteStaff);

module.exports = router;