const prisma = require("../../config/prisma");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// GET /api/v1/vouchers
const getAllVouchers = async (req, res) => {
  try {
    const vouchers = await prisma.voucher.findMany({
      include: {
        booking: {
          include: { client: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return res.status(200).json({
      success: true,
      message: "Vouchers fetched successfully",
      data: vouchers
    });
  } catch (error) {
    console.error("[getAllVouchers]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vouchers"
    });
  }
};

// GET /api/v1/vouchers/:id
const getVoucherById = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await prisma.voucher.findUnique({
      where: { id: Number(id) },
      include: {
        booking: {
          include: { client: true }
        }
      }
    });

    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: "Voucher not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Voucher fetched successfully",
      data: voucher
    });
  } catch (error) {
    console.error("[getVoucherById]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch voucher"
    });
  }
};

// GET /api/v1/bookings/:bookingId/vouchers
const getVouchersByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const vouchers = await prisma.voucher.findMany({
      where: { bookingId: Number(bookingId) }
    });

    return res.status(200).json({
      success: true,
      message: "Vouchers fetched for booking",
      data: vouchers
    });
  } catch (error) {
    console.error("[getVouchersByBookingId]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vouchers"
    });
  }
};

// POST /api/v1/vouchers
const createOrUpsertVoucher = async (req, res) => {
  try {
    const {
      bookingId,
      fileNo,
      reservationNo,
      hotelName,
      hotelAddress,
      hotelPhone,
      guestName,
      checkInDate,
      checkOutDate,
      roomType,
      numberOfRooms,
      mealPlan,
      nationality,
      status
    } = req.body;

    if (!bookingId || !fileNo || !hotelName || !guestName || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "bookingId, fileNo, hotelName, guestName, checkInDate and checkOutDate are required"
      });
    }

    // Verify booking
    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Check if voucher already exists for this booking - update it, otherwise create
    const existing = await prisma.voucher.findFirst({
      where: { bookingId: Number(bookingId) }
    });

    let voucher;
    const voucherData = {
      bookingId: Number(bookingId),
      fileNo,
      reservationNo: reservationNo || "",
      hotelName,
      hotelAddress: hotelAddress || null,
      hotelPhone: hotelPhone || null,
      guestName,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      roomType: roomType || "DELUXE ROOM",
      numberOfRooms: numberOfRooms || "1 ROOM",
      mealPlan: mealPlan || "ROOM WITH BREAKFAST AND DINNER",
      nationality: nationality || "",
      status: status || "DRAFT"
    };

    if (existing) {
      voucher = await prisma.voucher.update({
        where: { id: existing.id },
        data: {
          ...voucherData,
          status: status || existing.status
        }
      });
    } else {
      voucher = await prisma.voucher.create({
        data: voucherData
      });
    }

    return res.status(existing ? 200 : 201).json({
      success: true,
      message: existing ? "Voucher updated successfully" : "Voucher created successfully",
      data: voucher
    });
  } catch (error) {
    console.error("[createOrUpsertVoucher]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save voucher"
    });
  }
};

// PUT /api/v1/vouchers/:id
const updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existing = await prisma.voucher.findUnique({
      where: { id: Number(id) }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Voucher not found"
      });
    }

    const data = { ...updateData };
    if (data.bookingId) data.bookingId = Number(data.bookingId);
    if (data.checkInDate) data.checkInDate = new Date(data.checkInDate);
    if (data.checkOutDate) data.checkOutDate = new Date(data.checkOutDate);

    const updated = await prisma.voucher.update({
      where: { id: Number(id) },
      data
    });

    return res.status(200).json({
      success: true,
      message: "Voucher updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("[updateVoucher]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update voucher"
    });
  }
};

// GET /api/v1/vouchers/:id/pdf
const downloadVoucherPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await prisma.voucher.findUnique({
      where: { id: Number(id) }
    });

    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: "Voucher not found"
      });
    }

    // Set headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=Hotel_Voucher_${voucher.fileNo.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);

    // Stream PDF directly to client response
    generateVoucherStream(voucher, res);
  } catch (error) {
    console.error("[downloadVoucherPDF]", error);
    return res.status(500).send("Error generating PDF");
  }
};

// POST /api/v1/vouchers/preview-pdf
// Allows previewing pdf directly from request body before saving
const previewVoucherPDF = async (req, res) => {
  try {
    const voucherData = req.body;
    
    // Set headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=Hotel_Voucher_Preview.pdf");

    generateVoucherStream(voucherData, res);
  } catch (error) {
    console.error("[previewVoucherPDF]", error);
    return res.status(500).send("Error generating preview PDF");
  }
};

// Helper PDF generation function
function generateVoucherStream(voucher, stream) {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 40, bottom: 40, left: 40, right: 40 }
  });

  doc.pipe(stream);

  // 1. Centered Logo at the top
  const logoPath = path.join(__dirname, "../../logo.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, (595.28 - 120) / 2, 35, { width: 120 });
  } else {
    doc.fillColor("#0284c7")
       .font("Helvetica-Bold")
       .fontSize(16)
       .text("RANG TRAVELS", 40, 45, { align: "center" });
    doc.fillColor("#eab308")
       .font("Helvetica-Oblique")
       .fontSize(9)
       .text("Explore the Colors of India", 40, 65, { align: "center" });
  }

  // 2. Large faded watermark behind the lower portion of the table
  // The lower table resides roughly at y = 230 to 390
  if (fs.existsSync(logoPath)) {
    doc.save();
    doc.opacity(0.08); // 8% opacity watermark
    doc.image(logoPath, (595.28 - 200) / 2, 230, { width: 200 });
    doc.restore();
  }

  // Positioning
  const startX = 40;
  const col1Width = 160;
  const col2Width = 355;
  const totalWidth = 515;
  const col1EndX = startX + col1Width;
  const col2EndX = col1EndX + col2Width;

  let currentY = 110;

  // Draw Horizontal and Vertical borders for table cell
  const drawRowBorder = (y, height) => {
    doc.strokeColor("#94a3b8").lineWidth(0.5);
    // Horizontal lines
    doc.line(startX, y, col2EndX, y).stroke();
    doc.line(startX, y + height, col2EndX, y + height).stroke();
    // Vertical lines
    doc.line(startX, y, startX, y + height).stroke();
    doc.line(col1EndX, y, col1EndX, y + height).stroke();
    doc.line(col2EndX, y, col2EndX, y + height).stroke();
  };

  // Helper to draw row text
  const drawRowText = (leftText, rightText, y, height, leftBold = true, rightBold = false) => {
    doc.fillColor("#1e293b"); // dark slate text color
    
    // Left Column
    doc.font(leftBold ? "Helvetica-Bold" : "Helvetica")
       .fontSize(9)
       .text(leftText, startX + 8, y + 6, {
         width: col1Width - 16,
         align: "left"
       });

    // Right Column (with check for multi-line formatting)
    if (leftText === "HOTEL NAME" && typeof rightText === "string") {
      const lines = rightText.split("\n");
      const hotelTitle = lines[0] || "";
      const otherInfo = lines.slice(1).join("\n");

      doc.font("Helvetica-Bold")
         .fontSize(9)
         .text(hotelTitle, col1EndX + 8, y + 6, {
           width: col2Width - 16,
           align: "left",
           continued: otherInfo.length > 0
         });
      
      if (otherInfo.length > 0) {
        doc.font("Helvetica")
           .fontSize(8.5)
           .text("\n" + otherInfo, {
             width: col2Width - 16,
             align: "left"
           });
      }
    } else {
      doc.font(rightBold ? "Helvetica-Bold" : "Helvetica")
         .fontSize(9)
         .text(rightText || "", col1EndX + 8, y + 6, {
           width: col2Width - 16,
           align: "left"
         });
    }
  };

  // HOTEL VOUCHER header row
  doc.strokeColor("#94a3b8").lineWidth(0.5);
  doc.line(startX, currentY, col2EndX, currentY).stroke();
  doc.line(startX, currentY + 22, col2EndX, currentY + 22).stroke();
  doc.line(startX, currentY, startX, currentY + 22).stroke();
  doc.line(col2EndX, currentY, col2EndX, currentY + 22).stroke();

  doc.fillColor("#1e293b")
     .font("Helvetica-Bold")
     .fontSize(10)
     .text("HOTEL VOUCHER", startX, currentY + 6, {
       width: totalWidth,
       align: "center"
     });

  currentY += 22;

  // Compile formatting lines
  const hotelVal = `${voucher.hotelName || ""}\n${voucher.hotelAddress || ""}\nPHONE: ${voucher.hotelPhone || ""}`;

  const formatDateVal = (dateVal) => {
    if (!dateVal) return "";
    const d = new Date(dateVal);
    const day = d.getDate();
    const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const checkInStr = formatDateVal(voucher.checkInDate);
  const checkOutStr = formatDateVal(voucher.checkOutDate);

  // Definition of table grid rows
  const rows = [
    { left: "HOTEL NAME", right: hotelVal, isMultiLine: true },
    { type: "blank" },
    { left: "FILE NO", right: voucher.fileNo || "" },
    { type: "blank" },
    { left: "RESERVATION NO", right: voucher.reservationNo || "" },
    { type: "blank" },
    { left: "GUEST NAME", right: voucher.guestName || "" },
    { type: "blank" },
    { left: "CHECK IN DATE", right: checkInStr },
    { type: "blank" },
    { left: "CHECK OUT DATE", right: checkOutStr },
    { type: "blank" },
    { left: "TYPE OF ROOM", right: voucher.roomType || "" },
    { type: "blank" },
    { left: "NUMBER ROOMS", right: voucher.numberOfRooms || "1 ROOM", rightBold: true },
    { type: "blank" },
    { left: "MEAL PLAN", right: voucher.mealPlan || "" },
    { type: "blank" },
    { left: "NATIONALITY", right: voucher.nationality || "" },
    { type: "blank" }
  ];

  rows.forEach((row) => {
    if (row.type === "blank") {
      const h = 15;
      drawRowBorder(currentY, h);
      currentY += h;
    } else {
      let h = 22;
      if (row.isMultiLine) {
        // Measure text height of the details block
        const rightTextHeight = doc.heightOfString(row.right, { width: col2Width - 16 });
        h = Math.max(22, rightTextHeight + 14);
      }
      drawRowBorder(currentY, h);
      drawRowText(row.left, row.right, currentY, h, true, row.rightBold);
      currentY += h;
    }
  });

  // 3. GST NO centered & bold immediately below the table
  currentY += 15;
  doc.fillColor("#1e293b")
     .font("Helvetica-Bold")
     .fontSize(10)
     .text("GST NO: 07CUQPS0511N1Z5", startX, currentY, {
       width: totalWidth,
       align: "center"
     });

  currentY += 15;

  // 4. Authorised Rang Travels signature/stamp
  const sigPath = path.join(__dirname, "../../signature.png");
  if (fs.existsSync(sigPath)) {
    // Draw signature image
    doc.image(sigPath, col2EndX - 130, currentY + 10, { width: 130 });
  }

  // 5. Fixed A4 Bottom Footer
  const footerY = 740;
  
  doc.fillColor("#b45309") // dark orange/mustard
     .font("Helvetica-Bold")
     .fontSize(9.5)
     .text("Rang Travels - Explore the Colors of India", startX, footerY, {
       width: totalWidth,
       align: "center"
     });

  doc.fillColor("#475569") // slate gray
     .font("Helvetica")
     .fontSize(8.5)
     .text("106 - A second Floor, Jain Park, Uttam Nagar, New Delhi - 110059", startX, footerY + 14, {
       width: totalWidth,
       align: "center"
     });

  doc.text("Rishi Chandel : ++91-9810256394 / Kamlesh : ++91-9891400557", startX, footerY + 24, {
    width: totalWidth,
    align: "center"
  });

  // Link styling for Email and Website
  doc.fillColor("#475569")
     .text("| Email: ", startX, footerY + 34, { width: totalWidth, align: "center", continued: true })
     .fillColor("#2563eb")
     .text("info@rangtravels.com", { underline: true, continued: true })
     .fillColor("#475569")
     .text(" | website: ", { underline: false, continued: true })
     .fillColor("#2563eb")
     .text("Rangtravels.com", { underline: true, continued: true })
     .fillColor("#475569")
     .text(" | ", { underline: false });

  doc.fillColor("#475569")
     .fontSize(8.5)
     .text("GST NUMBER: 07CUQPS0511N1Z5", startX, footerY + 46, {
       width: totalWidth,
       align: "center"
     });

  doc.end();
}

module.exports = {
  getAllVouchers,
  getVoucherById,
  getVouchersByBookingId,
  createOrUpsertVoucher,
  updateVoucher,
  downloadVoucherPDF,
  previewVoucherPDF
};
