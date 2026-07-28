import React, { useState, useEffect } from "react";
import { FaTimes, FaFileInvoice, FaDownload, FaEnvelope, FaChevronRight, FaEdit } from "react-icons/fa";
import { toast } from "sonner";
import { getAllBookings } from "../../services/bookingService";
import { saveVoucher, previewVoucherPdf, downloadVoucherBlob } from "../../services/voucherService";

export default function VoucherModal({
  open,
  onClose,
  email,
  booking,
  onUploadSuccess
}) {
  // Booking Selection State
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Voucher Form State
  const [hotelName, setHotelName] = useState("");
  const [hotelAddress, setHotelAddress] = useState("");
  const [hotelPhone, setHotelPhone] = useState("");
  const [fileNo, setFileNo] = useState("");
  const [reservationNo, setReservationNo] = useState("");
  const [guestName, setGuestName] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [roomType, setRoomType] = useState("");
  const [numberOfRooms, setNumberOfRooms] = useState("");
  const [mealPlan, setMealPlan] = useState("");
  const [nationality, setNationality] = useState("");

  const [notes, setNotes] = useState("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Fetch confirmed bookings when modal opens
  useEffect(() => {
    if (open) {
      if (booking) {
        handleSelectBooking(booking);
      } else {
        setSelectedBooking(null);
      }
      fetchBookings();
    }
  }, [open, booking]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await getAllBookings("hotel_confirmed");
      if (res.success) {
        setConfirmedBookings(res.data);
        
        // Auto-select booking matching fileNo or relatedBookingId
        if (email && !booking) {
          const match = res.data.find(
            b => b.fileNo === email.fileNo || 
            b.id === email.relatedBookingId || 
            b.client?.fullName === email.clientName
          );
          if (match) {
            handleSelectBooking(match);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load confirmed bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking);
    setHotelName(booking.hotelName || "");
    setHotelAddress(booking.hotelAddress || "");
    setHotelPhone(booking.hotelPhone || "");
    setFileNo(booking.fileNo || "");
    setReservationNo(""); // Pre-fill empty or if already generated?
    setGuestName(booking.client?.fullName || booking.guestName || "");
    setCheckInDate(booking.startDate ? booking.startDate.substring(0, 10) : "");
    setCheckOutDate(booking.endDate ? booking.endDate.substring(0, 10) : "");
    setRoomType(booking.roomType || "DELUXE ROOM");
    setNumberOfRooms(booking.numberOfRooms || "1 ROOM");
    setMealPlan(booking.mealPlan || "ROOM WITH BREAKFAST AND DINNER");
    setNationality(booking.nationality || "ITALIAN");
  };

  if (!open) return null;

  // Formatter for visual preview dates
  const formatDatePreview = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    const day = date.getDate();
    const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Preview PDF Blob trigger
  const handlePreviewPdfBlob = async () => {
    try {
      const voucherData = {
        hotelName,
        hotelAddress,
        hotelPhone,
        fileNo,
        reservationNo,
        guestName,
        checkInDate,
        checkOutDate,
        roomType,
        numberOfRooms,
        mealPlan,
        nationality
      };
      
      const blob = await previewVoucherPdf(voucherData);
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Preview PDF error:", error);
      toast.error("Failed to generate PDF preview");
    }
  };

  // Download PDF file
  const handleDownloadPDF = async () => {
    if (!selectedBooking) {
      toast.error("Please select a booking first");
      return;
    }
    
    setIsGeneratingPdf(true);
    try {
      // 1. Save voucher metadata first
      const voucherData = {
        bookingId: selectedBooking.id,
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
        status: "GENERATED"
      };
      
      const res = await saveVoucher(voucherData);
      if (res.success) {
        // 2. Download the pdf blob
        const blob = await downloadVoucherBlob(res.data.id);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Hotel_Voucher_${fileNo.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Voucher generated and downloaded!");
      }
    } catch (error) {
      console.error("Download voucher error:", error);
      toast.error("Failed to save and download voucher");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Save Voucher, generate file metadata, link to Email Center
  const handleAttachToEmail = async () => {
    if (!selectedBooking) {
      toast.error("Please select a booking first");
      return;
    }

    setIsGeneratingPdf(true);
    try {
      const voucherData = {
        bookingId: selectedBooking.id,
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
        status: "SENT"
      };

      const res = await saveVoucher(voucherData);
      if (res.success) {
        // Prepare attachment meta for email center
        const mockAttachment = {
          id: `voucher-${res.data.id}`,
          name: `Hotel_Voucher_${fileNo.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
          size: "45 KB",
          type: "pdf",
          voucherId: res.data.id
        };

        if (onUploadSuccess) {
          onUploadSuccess(email.id, mockAttachment, notes);
        }

        toast.success("Voucher successfully generated and attached to email!");
        onClose();
      }
    } catch (error) {
      console.error("Attach voucher error:", error);
      toast.error("Failed to save and attach voucher");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", zIndex: 1070 }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-2xl rounded-2xl overflow-hidden bg-white" style={{ fontFamily: "'Outfit', sans-serif", maxHeight: "90vh" }}>
          
          {/* Header */}
          <div className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between bg-light">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary bg-opacity-10 p-2 rounded-circle text-primary">
                <FaFileInvoice />
              </div>
              <div>
                <h5 className="m-0 font-display fw-bold text-dark fs-6">Hotel Voucher Generator</h5>
                <p className="m-0 fs-8 text-secondary">Translate confirmed bookings into branded A4 vouchers.</p>
              </div>
            </div>
            <button
              type="button"
              className="border-0 bg-transparent text-secondary p-1 hover:text-dark transition-colors"
              onClick={onClose}
              aria-label="Close"
            >
              <FaTimes size={18} />
            </button>
          </div>

          <div className="modal-body p-0 dynamic-scroll">
            <div className="row g-0" style={{ height: "calc(90vh - 125px)" }}>
              
              {/* Left Column: Form Editor (width: 5) */}
              <div className="col-lg-5 border-end d-flex flex-column h-100 bg-light">
                
                {/* Step 1: Select Confirmed Booking if not selected */}
                {!selectedBooking ? (
                  <div className="p-4 flex-grow-1 overflow-y-auto">
                    <h6 className="fw-bold mb-3 text-dark">Step 1: Select Confirmed Booking</h6>
                    {isLoading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                        <p className="mt-2 text-secondary fs-7">Loading bookings...</p>
                      </div>
                    ) : confirmedBookings.length === 0 ? (
                      <div className="alert alert-warning fs-7 border-0 rounded-xl" role="alert">
                        No confirmed hotel bookings found. Please ensure booking status is marked as "Hotel Confirmed" under Tours.
                      </div>
                    ) : (
                      <div className="list-group rounded-xl overflow-hidden border">
                        {confirmedBookings.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            className="list-group-item list-group-item-action p-3 d-flex justify-content-between align-items-center border-0 border-bottom"
                            onClick={() => handleSelectBooking(b)}
                          >
                            <div>
                              <div className="fw-bold fs-7 text-dark">{b.hotelName}</div>
                              <div className="text-secondary fs-8 mt-1">
                                File: <span className="font-monospace text-primary fw-semibold">{b.fileNo}</span> | Guest: {b.client?.fullName}
                              </div>
                              <div className="text-secondary fs-8">
                                Dates: {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                              </div>
                            </div>
                            <FaChevronRight className="text-muted fs-8" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Step 2: Edit Voucher details
                  <div className="p-4 flex-grow-1 overflow-y-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold m-0 text-dark">Step 2: Review & Edit Details</h6>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm rounded-lg py-1 px-2 fs-8 font-display d-flex align-items-center gap-1"
                        onClick={() => setSelectedBooking(null)}
                      >
                        <FaEdit /> Change Booking
                      </button>
                    </div>

                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-bold text-dark fs-7 mb-1">Hotel Name</label>
                        <input
                          type="text"
                          className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                          value={hotelName}
                          onChange={(e) => setHotelName(e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-dark fs-7 mb-1">Hotel Address</label>
                        <textarea
                          className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                          rows="2"
                          value={hotelAddress}
                          onChange={(e) => setHotelAddress(e.target.value)}
                          style={{ resize: "none" }}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-dark fs-7 mb-1">Hotel Phone number</label>
                        <input
                          type="text"
                          className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                          value={hotelPhone}
                          onChange={(e) => setHotelPhone(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-dark fs-7 mb-1">File No</label>
                        <input
                          type="text"
                          className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                          value={fileNo}
                          onChange={(e) => setFileNo(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-dark fs-7 mb-1">Reservation No</label>
                        <input
                          type="text"
                          className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                          placeholder="e.g. 23737300"
                          value={reservationNo}
                          onChange={(e) => setReservationNo(e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-dark fs-7 mb-1">Guest Name</label>
                        <input
                          type="text"
                          className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-dark fs-7 mb-1">Check In Date</label>
                        <input
                          type="date"
                          className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                          value={checkInDate}
                          onChange={(e) => setCheckInDate(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-dark fs-7 mb-1">Check Out Date</label>
                        <input
                          type="date"
                          className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                          value={checkOutDate}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-dark fs-7 mb-1">Type of Room</label>
                        <input
                          type="text"
                          className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                          value={roomType}
                          onChange={(e) => setRoomType(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-dark fs-7 mb-1">Number Rooms</label>
                        <input
                          type="text"
                          className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                          value={numberOfRooms}
                          onChange={(e) => setNumberOfRooms(e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-dark fs-7 mb-1">Meal Plan</label>
                        <input
                          type="text"
                          className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                          value={mealPlan}
                          onChange={(e) => setMealPlan(e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-dark fs-7 mb-1">Nationality</label>
                        <input
                          type="text"
                          className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                          value={nationality}
                          onChange={(e) => setNationality(e.target.value)}
                        />
                      </div>

                      {/* Internal Email Notes */}
                      {email && (
                        <div className="col-12 mt-3 pt-3 border-top">
                          <label className="form-label fw-bold text-dark fs-7 mb-1">Email Notes / Remarks</label>
                          <textarea
                            className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                            rows="2"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="e.g. Booking confirmed via email, attached voucher PDF."
                            style={{ resize: "none" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Live A4 sheet preview (width: 7) */}
              <div className="col-lg-7 d-flex flex-column h-100 bg-secondary bg-opacity-10 overflow-y-auto p-4 justify-content-start align-items-center">
                <div className="w-100 mb-2 py-1 px-3 d-flex justify-content-between align-items-center border bg-white rounded-lg shadow-sm" style={{ maxWidth: "560px" }}>
                  <span className="fs-8 text-secondary fw-semibold">Voucher PDF Layout Preview</span>
                  <button
                    type="button"
                    className="btn btn-link fs-8 py-1 text-decoration-none fw-bold"
                    onClick={handlePreviewPdfBlob}
                    disabled={!selectedBooking}
                  >
                    Open PDF in New Tab
                  </button>
                </div>

                {/* Simulated A4 Container */}
                <div 
                  className="w-100 bg-white shadow-lg p-5 position-relative overflow-hidden mb-4"
                  style={{
                    maxWidth: "560px",
                    minHeight: "790px",
                    fontSize: "12px",
                    lineHeight: "1.4",
                    color: "#1e293b",
                    boxSizing: "border-box"
                  }}
                >
                  
                  {/* Faded Watermark Image */}
                  <div
                    className="position-absolute"
                    style={{
                      top: "220px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "200px",
                      height: "200px",
                      backgroundImage: "url('/logo.png')",
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      opacity: 0.08,
                      pointerEvents: "none"
                    }}
                  />

                  {/* Top Header Logo */}
                  <div className="text-center mb-4">
                    <img 
                      src="/logo.png" 
                      alt="Rang Travels" 
                      style={{ height: "65px", width: "auto" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        // Fallback text if logo.png not loaded
                        const textLogo = document.getElementById("fallback-logo");
                        if (textLogo) textLogo.style.display = "block";
                      }} 
                    />
                    <div id="fallback-logo" style={{ display: "none" }}>
                      <h4 className="m-0 fw-extrabold text-primary font-display">RANG TRAVELS</h4>
                      <small className="text-warning fw-semibold font-monospace">Explore the Colors of India</small>
                    </div>
                  </div>

                  {/* Voucher Table */}
                  <div className="table-responsive">
                    <table 
                      className="w-100 text-start" 
                      style={{ 
                        borderCollapse: "collapse",
                        border: "0.5px solid #94a3b8"
                      }}
                    >
                      <tbody>
                        {/* Header Row */}
                        <tr style={{ borderBottom: "0.5px solid #94a3b8" }}>
                          <td colSpan="2" className="text-center py-2 fw-bold text-dark fs-7 bg-light bg-opacity-50">
                            HOTEL VOUCHER
                          </td>
                        </tr>

                        {/* HOTEL NAME Row */}
                        <tr style={{ borderBottom: "0.5px solid #94a3b8" }}>
                          <td className="p-2 fw-bold align-top" style={{ width: "160px", borderRight: "0.5px solid #94a3b8" }}>
                            HOTEL NAME
                          </td>
                          <td className="p-2">
                            <div className="fw-bold text-black">{hotelName || "DELHI-JAYPEE VASANT CONTINENTAL"}</div>
                            <div className="text-secondary fs-8 mt-0.5">{hotelAddress || "VASANT VIHAR, NEW DELHI - 110057, INDIA"}</div>
                            {hotelPhone && <div className="text-secondary fs-8 mt-0.5">PHONE: {hotelPhone}</div>}
                          </td>
                        </tr>

                        {/* Blank row */}
                        <tr style={{ height: "15px", borderBottom: "0.5px solid #94a3b8" }}>
                          <td style={{ borderRight: "0.5px solid #94a3b8" }}></td>
                          <td></td>
                        </tr>

                        {/* FILE NO */}
                        <tr style={{ borderBottom: "0.5px solid #94a3b8" }}>
                          <td className="p-2 fw-bold" style={{ borderRight: "0.5px solid #94a3b8" }}>
                            FILE NO
                          </td>
                          <td className="p-2 font-monospace fw-semibold text-primary">
                            {fileNo || "RT|MS|206|26-27"}
                          </td>
                        </tr>

                        {/* Blank row */}
                        <tr style={{ height: "15px", borderBottom: "0.5px solid #94a3b8" }}>
                          <td style={{ borderRight: "0.5px solid #94a3b8" }}></td>
                          <td></td>
                        </tr>

                        {/* RESERVATION NO */}
                        <tr style={{ borderBottom: "0.5px solid #94a3b8" }}>
                          <td className="p-2 fw-bold" style={{ borderRight: "0.5px solid #94a3b8" }}>
                            RESERVATION NO
                          </td>
                          <td className="p-2 fw-bold text-dark">
                            {reservationNo || "23737300"}
                          </td>
                        </tr>

                        {/* Blank row */}
                        <tr style={{ height: "15px", borderBottom: "0.5px solid #94a3b8" }}>
                          <td style={{ borderRight: "0.5px solid #94a3b8" }}></td>
                          <td></td>
                        </tr>

                        {/* GUEST NAME */}
                        <tr style={{ borderBottom: "0.5px solid #94a3b8" }}>
                          <td className="p-2 fw-bold" style={{ borderRight: "0.5px solid #94a3b8" }}>
                            GUEST NAME
                          </td>
                          <td className="p-2 text-dark uppercase fw-semibold">
                            {guestName || "MICHELA UCCELLI AND PIERPAOLO PULLINI"}
                          </td>
                        </tr>

                        {/* Blank row */}
                        <tr style={{ height: "15px", borderBottom: "0.5px solid #94a3b8" }}>
                          <td style={{ borderRight: "0.5px solid #94a3b8" }}></td>
                          <td></td>
                        </tr>

                        {/* CHECK IN DATE */}
                        <tr style={{ borderBottom: "0.5px solid #94a3b8" }}>
                          <td className="p-2 fw-bold" style={{ borderRight: "0.5px solid #94a3b8" }}>
                            CHECK IN DATE
                          </td>
                          <td className="p-2 text-dark font-monospace text-uppercase fw-semibold">
                            {formatDatePreview(checkInDate) || "30-JULY-2026"}
                          </td>
                        </tr>

                        {/* Blank row */}
                        <tr style={{ height: "15px", borderBottom: "0.5px solid #94a3b8" }}>
                          <td style={{ borderRight: "0.5px solid #94a3b8" }}></td>
                          <td></td>
                        </tr>

                        {/* CHECK OUT DATE */}
                        <tr style={{ borderBottom: "0.5px solid #94a3b8" }}>
                          <td className="p-2 fw-bold" style={{ borderRight: "0.5px solid #94a3b8" }}>
                            CHECK OUT DATE
                          </td>
                          <td className="p-2 text-dark font-monospace text-uppercase fw-semibold">
                            {formatDatePreview(checkOutDate) || "31-JULY-2026"}
                          </td>
                        </tr>

                        {/* Blank row */}
                        <tr style={{ height: "15px", borderBottom: "0.5px solid #94a3b8" }}>
                          <td style={{ borderRight: "0.5px solid #94a3b8" }}></td>
                          <td></td>
                        </tr>

                        {/* TYPE OF ROOM */}
                        <tr style={{ borderBottom: "0.5px solid #94a3b8" }}>
                          <td className="p-2 fw-bold" style={{ borderRight: "0.5px solid #94a3b8" }}>
                            TYPE OF ROOM
                          </td>
                          <td className="p-2 text-dark text-uppercase">
                            {roomType || "DELUXE ROOM"}
                          </td>
                        </tr>

                        {/* Blank row */}
                        <tr style={{ height: "15px", borderBottom: "0.5px solid #94a3b8" }}>
                          <td style={{ borderRight: "0.5px solid #94a3b8" }}></td>
                          <td></td>
                        </tr>

                        {/* NUMBER ROOMS */}
                        <tr style={{ borderBottom: "0.5px solid #94a3b8" }}>
                          <td className="p-2 fw-bold" style={{ borderRight: "0.5px solid #94a3b8" }}>
                            NUMBER ROOMS
                          </td>
                          <td className="p-2 fw-bold text-dark text-uppercase">
                            {numberOfRooms || "1 ROOM"}
                          </td>
                        </tr>

                        {/* Blank row */}
                        <tr style={{ height: "15px", borderBottom: "0.5px solid #94a3b8" }}>
                          <td style={{ borderRight: "0.5px solid #94a3b8" }}></td>
                          <td></td>
                        </tr>

                        {/* MEAL PLAN */}
                        <tr style={{ borderBottom: "0.5px solid #94a3b8" }}>
                          <td className="p-2 fw-bold" style={{ borderRight: "0.5px solid #94a3b8" }}>
                            MEAL PLAN
                          </td>
                          <td className="p-2 text-dark text-uppercase text-secondary">
                            {mealPlan || "ROOM WITH BREAKFAST AND DINNER"}
                          </td>
                        </tr>

                        {/* Blank row */}
                        <tr style={{ height: "15px", borderBottom: "0.5px solid #94a3b8" }}>
                          <td style={{ borderRight: "0.5px solid #94a3b8" }}></td>
                          <td></td>
                        </tr>

                        {/* NATIONALITY */}
                        <tr style={{ borderBottom: "0.5px solid #94a3b8" }}>
                          <td className="p-2 fw-bold" style={{ borderRight: "0.5px solid #94a3b8" }}>
                            NATIONALITY
                          </td>
                          <td className="p-2 text-dark text-uppercase">
                            {nationality || "ITALIAN"}
                          </td>
                        </tr>

                        {/* Blank row */}
                        <tr style={{ height: "15px" }}>
                          <td style={{ borderRight: "0.5px solid #94a3b8" }}></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* GST NO bold & centered directly below the table */}
                  <div className="text-center fw-bold text-dark fs-7 mt-3">
                    GST NO: 07CUQPS0511N1Z5
                  </div>

                  {/* Signature/Stamp element aligned to bottom right */}
                  <div className="d-flex justify-content-end mt-3">
                    <img 
                      src="/signature.png" 
                      alt="Authorized Signature" 
                      style={{ width: "120px", height: "auto" }}
                      onError={(e) => { e.target.style.display = "none"; }} 
                    />
                  </div>

                  {/* Intentional Whitespace Spacer */}
                  <div style={{ height: "100px" }} />

                  {/* Company Footer positioned at the bottom */}
                  <div className="text-center w-100" style={{ borderTop: "0.5px solid #e2e8f0", paddingTop: "15px", fontSize: "10px" }}>
                    <div className="fw-bold text-warning mb-1" style={{ color: "#b45309" }}>
                      Rang Travels - Explore the Colors of India
                    </div>
                    <div className="text-secondary fs-8">
                      106 - A second Floor, Jain Park, Uttam Nagar, New Delhi - 110059
                    </div>
                    <div className="text-secondary fs-8">
                      Rishi Chandel : ++91-9810256394 / Kamlesh : ++91-9891400557
                    </div>
                    <div className="text-secondary fs-8 mt-0.5">
                      | Email: <span className="text-primary text-decoration-underline" style={{ cursor: "pointer" }}>info@rangtravels.com</span> | website: <span className="text-primary text-decoration-underline" style={{ cursor: "pointer" }}>Rangtravels.com</span> |
                    </div>
                    <div className="text-secondary fs-8 mt-1 font-monospace fw-semibold">
                      GST NUMBER: 07CUQPS0511N1Z5
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* Footer Bar */}
          <div className="modal-footer px-4 py-3 bg-light border-top d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-link link-secondary text-decoration-none fw-semibold fs-7"
              onClick={onClose}
              disabled={isGeneratingPdf}
            >
              Cancel
            </button>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary px-3 py-2 rounded-xl fw-semibold fs-7 d-flex align-items-center gap-1.5"
                onClick={handleDownloadPDF}
                disabled={!selectedBooking || isGeneratingPdf}
              >
                {isGeneratingPdf ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : (
                  <FaDownload />
                )}
                Download PDF
              </button>
              
              {email && (
                <button
                  type="button"
                  className="btn btn-primary px-4 py-2 rounded-xl fw-bold border-0 shadow-sm transition-click d-flex align-items-center gap-1.5"
                  onClick={handleAttachToEmail}
                  disabled={!selectedBooking || isGeneratingPdf}
                >
                  {isGeneratingPdf ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    <FaEnvelope />
                  )}
                  Save & Attach to Email
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
