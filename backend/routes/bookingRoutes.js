const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookings/bookingController");
const authenticate = require("../middleware/authMiddleware");

router.use(authenticate);

router.get("/", bookingController.getAllBookings);
router.get("/:id", bookingController.getBookingById);
router.post("/", bookingController.createBooking);
router.put("/:id", bookingController.updateBooking);
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
