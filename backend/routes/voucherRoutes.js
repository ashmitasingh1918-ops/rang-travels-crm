const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/vouchers/voucherController");
const authenticate = require("../middleware/authMiddleware");

router.use(authenticate);

router.get("/", voucherController.getAllVouchers);
router.get("/:id", voucherController.getVoucherById);
router.get("/booking/:bookingId", voucherController.getVouchersByBookingId);
router.post("/", voucherController.createOrUpsertVoucher);
router.put("/:id", voucherController.updateVoucher);
router.get("/:id/pdf", voucherController.downloadVoucherPDF);
router.post("/preview-pdf", voucherController.previewVoucherPDF);

module.exports = router;
