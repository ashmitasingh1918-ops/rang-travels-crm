import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaFilter, FaFileInvoice, FaEdit, FaTrash, FaCheckCircle, FaCalendarAlt, FaUser, FaBuilding, FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { getAllBookings, createBooking, updateBooking, deleteBooking } from "../services/bookingService";
import { getAllClients } from "../services/clientService";
import VoucherModal from "../components/email/VoucherModal";

// Determine financial year using the Indian financial year: April 1 through March 31
const getIndianFinancialYear = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11
  let fiscalStartYear;
  if (month >= 3) {
    fiscalStartYear = year;
  } else {
    fiscalStartYear = year - 1;
  }
  const start = String(fiscalStartYear).slice(-2);
  const end = String(fiscalStartYear + 1).slice(-2);
  return `${start}-${end}`;
};


export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Multi-purpose Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);

  // Form Fields
  const [clientId, setClientId] = useState("");
  const [fileNo, setFileNo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("planning");
  const [hotelName, setHotelName] = useState("");
  const [hotelAddress, setHotelAddress] = useState("");
  const [hotelPhone, setHotelPhone] = useState("");
  const [hotelEmail, setHotelEmail] = useState("");
  const [roomType, setRoomType] = useState("");
  const [numberOfRooms, setNumberOfRooms] = useState("1 ROOM");
  const [mealPlan, setMealPlan] = useState("");
  const [nationality, setNationality] = useState("");
  const [travelers, setTravelers] = useState(1);

  // Load Bookings and Clients on page open
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [bookingsRes, clientsRes] = await Promise.all([
        getAllBookings(),
        getAllClients()
      ]);
      if (bookingsRes.success) setBookings(bookingsRes.data);
      if (clientsRes.success) {
        const clientsList = clientsRes.data?.clients || (Array.isArray(clientsRes.data) ? clientsRes.data : []);
        setClients(clientsList);
      }
    } catch (error) {
      console.error("Fetcher error:", error);
      toast.error("Failed to load database records");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateForm = () => {
    setEditingBooking(null);
    setClientId(clients[0]?.id || "");
    setFileNo(`RT|MS|Auto-Generated|${getIndianFinancialYear()}`);
    setStartDate("");
    setEndDate("");
    setStatus("planning");
    setHotelName("");
    setHotelAddress("");
    setHotelPhone("");
    setHotelEmail("");
    setRoomType("DELUXE ROOM");
    setNumberOfRooms("1 ROOM");
    setMealPlan("ROOM WITH BREAKFAST AND DINNER");
    setNationality("ITALIAN");
    setTravelers(1);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (b) => {
    setEditingBooking(b);
    setClientId(b.clientId);
    setFileNo(b.fileNo);
    setStartDate(b.startDate ? b.startDate.substring(0, 10) : "");
    setEndDate(b.endDate ? b.endDate.substring(0, 10) : "");
    setStatus(b.status);
    setHotelName(b.hotelName || "");
    setHotelAddress(b.hotelAddress || "");
    setHotelPhone(b.hotelPhone || "");
    setHotelEmail(b.hotelEmail || "");
    setRoomType(b.roomType || "DELUXE ROOM");
    setNumberOfRooms(b.numberOfRooms || "1 ROOM");
    setMealPlan(b.mealPlan || "");
    setNationality(b.nationality || "");
    setTravelers(b.travelers || 1);
    setIsFormOpen(true);
  };

  const handleSaveBooking = async (e) => {
    e.preventDefault();
    if (!clientId || !fileNo || !startDate || !endDate) {
      toast.error("Required fields: client, fileNo, check-in, check-out");
      return;
    }

    const payload = {
      clientId: Number(clientId),
      fileNo,
      startDate,
      endDate,
      status,
      hotelName,
      hotelAddress,
      hotelPhone,
      hotelEmail,
      roomType,
      numberOfRooms,
      mealPlan,
      nationality,
      travelers: Number(travelers)
    };

    try {
      if (editingBooking) {
        const res = await updateBooking(editingBooking.id, payload);
        if (res.success) {
          toast.success("Booking details updated successfully!");
          fetchData();
          setIsFormOpen(false);
        }
      } else {
        const res = await createBooking(payload);
        if (res.success) {
          toast.success("Booking created successfully!");
          fetchData();
          setIsFormOpen(false);
        }
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.response?.data?.message || "Failed to save booking");
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      const res = await deleteBooking(id);
      if (res.success) {
        toast.success("Booking deleted successfully");
        fetchData();
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete booking");
    }
  };

  const handleVoucherClick = (b) => {
    setSelectedBooking(b);
    setIsVoucherOpen(true);
  };

  // Filter Bookings logic
  const filteredBookings = bookings.filter((b) => {
    const textMatch = 
      b.fileNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.client?.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.hotelName || "").toLowerCase().includes(searchQuery.toLowerCase());

    const statusMatch = statusFilter === "all" || b.status === statusFilter;

    return textMatch && statusMatch;
  });

  const getStatusBadge = (statusName) => {
    switch (statusName) {
      case "planning":
        return <span className="badge bg-secondary bg-opacity-10 text-secondary border px-2.5 py-1.5 rounded-full font-display">Planning</span>;
      case "emails_sent":
        return <span className="badge bg-warning bg-opacity-10 text-warning-emphasis border px-2.5 py-1.5 rounded-full font-display">Emails Sent</span>;
      case "quotation_received":
        return <span className="badge bg-info bg-opacity-10 text-info border px-2.5 py-1.5 rounded-full font-display">Quotation Received</span>;
      case "hotel_confirmed":
        return <span className="badge bg-success bg-opacity-10 text-success border px-2.5 py-1.5 rounded-full font-display">Hotel Confirmed</span>;
      case "completed":
        return <span className="badge bg-primary bg-opacity-10 text-primary border px-2.5 py-1.5 rounded-full font-display">Completed</span>;
      case "cancelled":
        return <span className="badge bg-danger bg-opacity-10 text-danger border px-2.5 py-1.5 rounded-full font-display">Cancelled</span>;
      default:
        return <span className="badge bg-light text-dark border px-2.5 py-1.5 rounded-full font-display">{statusName}</span>;
    }
  };

  return (
    <div className="container-fluid p-0" style={{ fontFamily: "'Outfit', sans-serif" }}>
      
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1 text-dark fw-bold font-display">Bookings & Vouchers</h1>
          <p className="text-secondary mb-0 fs-7">Manage operational bookings and generate hotel voucher PDFs.</p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 shadow-sm rounded-xl"
          onClick={handleOpenCreateForm}
        >
          <FaPlus />
          <span className="fw-semibold">Add Booking</span>
        </button>
      </div>

      {/* Toolbar filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-lg-4">
          <div className="input-group border rounded-xl overflow-hidden bg-white shadow-sm">
            <span className="input-group-text bg-transparent border-0 text-muted ps-3 pe-2">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control border-0 bg-transparent py-2.5 fs-7 shadow-none"
              placeholder="Search file no, guest, or hotel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="col-md-6 col-lg-3">
          <div className="input-group border rounded-xl overflow-hidden bg-white shadow-sm">
            <span className="input-group-text bg-transparent border-0 text-muted ps-3 pe-2">
              <FaFilter />
            </span>
            <select
              className="form-select border-0 bg-transparent py-2.5 fs-7 shadow-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="planning">Planning</option>
              <option value="emails_sent">Emails Sent</option>
              <option value="quotation_received">Quotation Received</option>
              <option value="hotel_confirmed">Hotel Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Database Grid */}
      <div className="card border rounded-2xl shadow-sm overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 fs-7">
            <thead className="table-light py-3 border-bottom fs-8 text-uppercase fw-semibold text-secondary">
              <tr>
                <th className="px-4 py-3">File No</th>
                <th className="py-3">Guest & Nationality</th>
                <th className="py-3">Hotel & Details</th>
                <th className="py-3">Travel Dates</th>
                <th className="py-3">Status</th>
                <th className="px-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-secondary">
                    <div className="spinner-border spinner-border-sm text-primary mb-2" role="status"></div>
                    <div>Loading bookings record logs...</div>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-secondary">
                    No bookings found matching filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="px-4 py-3 align-middle font-monospace fw-semibold text-primary">
                      {b.fileNo}
                    </td>
                    <td className="py-3 align-middle">
                      <div className="fw-semibold text-dark d-flex align-items-center gap-1.5">
                        <FaUser className="text-muted fs-8" />
                        {b.client?.fullName || "General Client"}
                      </div>
                      <div className="text-secondary fs-8 mt-0.5">
                        Nationality: <span className="fw-semibold">{b.nationality || "Italian"}</span> (Pax: {b.travelers || 2})
                      </div>
                    </td>
                    <td className="py-3 align-middle">
                      <div className="fw-bold text-dark d-flex align-items-center gap-1.5">
                        <FaBuilding className="text-muted fs-8" />
                        {b.hotelName || "No hotel associated"}
                      </div>
                      <div className="text-secondary fs-8 mt-0.5">
                        {b.roomType} | {b.numberOfRooms} Room(s)
                      </div>
                    </td>
                    <td className="py-3 align-middle">
                      <div className="text-dark fw-semibold d-flex align-items-center gap-1.5">
                        <FaCalendarAlt className="text-muted fs-8" />
                        {b.startDate ? new Date(b.startDate).toLocaleDateString() : ""} - {b.endDate ? new Date(b.endDate).toLocaleDateString() : ""}
                      </div>
                      <div className="text-secondary fs-8 mt-0.5">
                        Meal Plan: {b.mealPlan || "N/A"}
                      </div>
                    </td>
                    <td className="py-3 align-middle">
                      {getStatusBadge(b.status)}
                    </td>
                    <td className="px-4 py-3 align-middle text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {b.status === "hotel_confirmed" && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 font-display rounded-lg py-1.5 px-3 fw-bold border-0 bg-primary bg-opacity-10 text-primary transition-click"
                            onClick={() => handleVoucherClick(b)}
                          >
                            <FaFileInvoice />
                            Generate Voucher
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-icon btn-light rounded-lg text-secondary border hover:text-dark"
                          onClick={() => handleOpenEditForm(b)}
                          aria-label="Edit booking"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-icon btn-light rounded-lg text-danger border hover:bg-danger hover:bg-opacity-10"
                          onClick={() => handleDeleteBooking(b.id)}
                          aria-label="Delete booking"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Booking Form Modal */}
      {isFormOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(15, 23, 42, 0.5)", zIndex: 1060 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-2xl overflow-hidden bg-white">
              
              <div className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between bg-light">
                <h5 className="m-0 font-display fw-bold text-dark fs-6">
                  {editingBooking ? "Edit Booking Details" : "Create New operational Booking"}
                </h5>
                <button
                  type="button"
                  className="border-0 bg-transparent text-secondary p-1 hover:text-dark transition-colors"
                  onClick={() => setIsFormOpen(false)}
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveBooking}>
                <div className="modal-body p-4 overflow-y-auto" style={{ maxHeight: "70vh" }}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark fs-7 mb-1">Select Client <span className="text-danger">*</span></label>
                      <select
                        className="form-select px-3 py-2 border rounded-xl shadow-none fs-7"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        required
                      >
                        <option value="">-- Choose Client --</option>
                        {clients.map((c) => (
                          <option key={c.id} value={c.id}>{c.fullName}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold text-secondary fs-7 mb-1">File Number (System Generated)</label>
                      <input
                        type="text"
                        className="form-control px-3 py-2 border rounded-xl shadow-none fs-7 font-monospace bg-light text-muted"
                        value={fileNo}
                        readOnly
                        style={{ cursor: "not-allowed", fontWeight: "600" }}
                      />
                      <small className="text-muted d-block mt-1" style={{ fontSize: "11px" }}>Securely auto-allocated on creation.</small>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark fs-7 mb-1">Check-in Date <span className="text-danger">*</span></label>
                      <input
                        type="date"
                        className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark fs-7 mb-1">Check-out Date <span className="text-danger">*</span></label>
                      <input
                        type="date"
                        className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold text-dark fs-7 mb-1">Status</label>
                      <select
                        className="form-select px-3 py-2 border rounded-xl shadow-none fs-7"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="planning">Planning</option>
                        <option value="emails_sent">Emails Sent</option>
                        <option value="quotation_received">Quotation Received</option>
                        <option value="hotel_confirmed">Hotel Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold text-dark fs-7 mb-1">Pax Count</label>
                      <input
                        type="number"
                        className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                        min="1"
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold text-dark fs-7 mb-1">Guest Nationality</label>
                      <input
                        type="text"
                        className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                        placeholder="e.g. Italian"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                      />
                    </div>

                    <div className="col-12 border-top mt-3 pt-3">
                      <h6 className="fs-7 fw-bold text-secondary text-uppercase mb-2">Hotel Partners Information</h6>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark fs-7 mb-1">Hotel Name</label>
                      <input
                        type="text"
                        className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                        placeholder="e.g. DELHI-JAYPEE VASANT CONTINENTAL"
                        value={hotelName}
                        onChange={(e) => setHotelName(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark fs-7 mb-1">Hotel Email</label>
                      <input
                        type="email"
                        className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                        placeholder="reservations@hotel.com"
                        value={hotelEmail}
                        onChange={(e) => setHotelEmail(e.target.value)}
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label fw-bold text-dark fs-7 mb-1">Hotel Phone number</label>
                      <input
                        type="text"
                        className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                        placeholder="e.g. +91-11-2614 8800"
                        value={hotelPhone}
                        onChange={(e) => setHotelPhone(e.target.value)}
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label fw-bold text-dark fs-7 mb-1">Hotel Address</label>
                      <textarea
                        className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                        rows="2"
                        placeholder="VASANT VIHAR, NEW DELHI - 110057, INDIA"
                        value={hotelAddress}
                        onChange={(e) => setHotelAddress(e.target.value)}
                        style={{ resize: "none" }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark fs-7 mb-1">Type of Room</label>
                      <input
                        type="text"
                        className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                        placeholder="e.g. DELUXE ROOM"
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark fs-7 mb-1">Number Rooms</label>
                      <input
                        type="text"
                        className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                        placeholder="1 ROOM"
                        value={numberOfRooms}
                        onChange={(e) => setNumberOfRooms(e.target.value)}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-bold text-dark fs-7 mb-1">Meal Plan</label>
                      <input
                        type="text"
                        className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                        placeholder="e.g. ROOM WITH BREAKFAST AND DINNER"
                        value={mealPlan}
                        onChange={(e) => setMealPlan(e.target.value)}
                      />
                    </div>

                  </div>
                </div>

                <div className="modal-footer px-4 py-3 bg-light border-top d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-link link-secondary text-decoration-none fw-semibold fs-7"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2 rounded-xl fw-bold border-0 shadow-sm transition-click"
                  >
                    {editingBooking ? "Save Changes" : "Create Booking"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* Voucher Editor & Preview Modal triggered for selected booking */}
      <VoucherModal
        open={isVoucherOpen}
        onClose={() => {
          setIsVoucherOpen(false);
          setSelectedBooking(null);
          fetchData(); // Reload booking table to update any details
        }}
        booking={selectedBooking}
      />

    </div>
  );
}
