import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft, Plus, Trash2, Send, Building2, MapPin,
  Calendar, Users, Check, X, Clock, MessageSquare, RefreshCw
} from "lucide-react";
import api from "../services/axios";
import {
  addDestination, getDestinations, deleteDestination,
  addHotelToTour, getHotelsByTour, removeHotelSelection,
  sendHotelRequests, previewEmailTemplate
} from "../services/tourHotelService";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  PENDING:    { label: "Pending",     color: "#f59e0b", bg: "#fef3c7" },
  EMAIL_SENT: { label: "Email Sent",  color: "#3b82f6", bg: "#dbeafe" },
  REPLIED:    { label: "Replied",     color: "#8b5cf6", bg: "#f5f3ff" },
  CONFIRMED:  { label: "Confirmed",   color: "#10b981", bg: "#ecfdf5" },
  REJECTED:   { label: "Rejected",    color: "#ef4444", bg: "#fef2f2" },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.PENDING;
  return (
    <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      {s.label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TourDetail() {
  const { tourId } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [hotelGroups, setHotelGroups] = useState([]);
  const [cities, setCities] = useState([]);
  const [allHotels, setAllHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for adding destination
  const [destForm, setDestForm] = useState({ cityId: "", checkIn: "", checkOut: "", nights: 1, roomType: "Standard", mealPlan: "CP", roomCount: 1 });
  const [showDestForm, setShowDestForm] = useState(false);

  // Email state
  const [selectedHotelIds, setSelectedHotelIds] = useState([]);
  const [customNote, setCustomNote] = useState("");
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [sending, setSending] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [tourRes, destsRes, hotelGroupsRes, citiesRes, hotelsRes] = await Promise.all([
        api.get(`/v1/tours/${tourId}`),
        getDestinations(tourId),
        getHotelsByTour(tourId),
        api.get("/v1/cities"),
        api.get("/v1/hotels"),
      ]);
      setTour(tourRes.data.data);
      setDestinations(destsRes.data || []);
      setHotelGroups(hotelGroupsRes.data || []);
      setCities(citiesRes.data.data || []);
      setAllHotels(hotelsRes.data.data || []);
    } catch (e) {
      toast.error("Failed to load tour details");
    } finally {
      setLoading(false);
    }
  }, [tourId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Auto-calculate nights
  useEffect(() => {
    if (destForm.checkIn && destForm.checkOut) {
      const diff = Math.ceil((new Date(destForm.checkOut) - new Date(destForm.checkIn)) / 86400000);
      if (diff > 0) setDestForm(p => ({ ...p, nights: diff }));
    }
  }, [destForm.checkIn, destForm.checkOut]);

  // ── Add Destination ──────────────────────────────────────────────────────────
  const handleAddDestination = async (e) => {
    e.preventDefault();
    if (!destForm.cityId) return toast.error("Select a city");
    try {
      await addDestination(tourId, destForm);
      toast.success("Destination added");
      setDestForm({ cityId: "", checkIn: "", checkOut: "", nights: 1, roomType: "Standard", mealPlan: "CP", roomCount: 1 });
      setShowDestForm(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add destination");
    }
  };

  // ── Remove Destination ───────────────────────────────────────────────────────
  const handleDeleteDestination = async (destId) => {
    if (!window.confirm("Remove this destination? All hotel selections for it will also be removed.")) return;
    try {
      await deleteDestination(destId);
      toast.success("Destination removed");
      fetchAll();
    } catch {
      toast.error("Failed to remove destination");
    }
  };

  // ── Add Hotel ────────────────────────────────────────────────────────────────
  const handleAddHotel = async (destinationId, hotelId) => {
    if (!hotelId) return;
    try {
      await addHotelToTour(tourId, { destinationId, hotelId });
      toast.success("Hotel added");
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add hotel");
    }
  };

  // ── Remove Hotel ─────────────────────────────────────────────────────────────
  const handleRemoveHotel = async (tourHotelId) => {
    try {
      await removeHotelSelection(tourHotelId);
      toast.success("Hotel removed");
      fetchAll();
    } catch {
      toast.error("Failed to remove hotel");
    }
  };

  // ── Toggle select for email ──────────────────────────────────────────────────
  const toggleSelect = (id) => {
    setSelectedHotelIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // ── Preview email ────────────────────────────────────────────────────────────
  const handlePreview = async () => {
    if (selectedHotelIds.length === 0) return toast.error("Select at least one hotel");
    try {
      const res = await previewEmailTemplate({ tourHotelId: selectedHotelIds[0], customNote });
      setPreviewData(res);
      setShowPreview(true);
    } catch {
      toast.error("Failed to generate preview");
    }
  };

  // ── Send emails ──────────────────────────────────────────────────────────────
  const handleSendEmails = async () => {
    if (selectedHotelIds.length === 0) return toast.error("Select at least one hotel to email");
    if (!window.confirm(`Send hotel request emails to ${selectedHotelIds.length} hotel(s)?`)) return;
    try {
      setSending(true);
      const res = await sendHotelRequests({ tourId, tourHotelIds: selectedHotelIds, customNote });
      toast.success(res.message);
      setSelectedHotelIds([]);
      setShowPreview(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send emails");
    } finally {
      setSending(false);
    }
  };

  // ── Hotels available for a destination (not already added) ───────────────────
  const getAvailableHotels = (destId, destCityId) => {
    const existingGroup = hotelGroups.find(g => g.destination.id === destId);
    const existingIds = existingGroup ? existingGroup.hotels.map(h => h.hotelId) : [];
    return allHotels.filter(h => h.isActive && h.cityId === destCityId && !existingIds.includes(h.id));
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 300 }}>
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!tour) {
    return <div className="alert alert-danger m-4">Tour not found.</div>;
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/tours")}>
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h4 className="mb-0 fw-bold">{tour.packageName}</h4>
          <small className="text-muted">{tour.client?.fullName} &bull; {tour.numberOfTravelers} Pax</small>
        </div>
        <span className="badge bg-warning text-dark ms-auto">{tour.bookingStatus || "DRAFT"}</span>
      </div>

      {/* Tour Info Card */}
      <div className="card border-0 shadow-sm rounded-3 mb-4">
        <div className="card-body d-flex flex-wrap gap-4 p-4">
          <div><small className="text-muted d-block">Client</small><strong>{tour.client?.fullName}</strong></div>
          <div><small className="text-muted d-block">Package</small><strong>{tour.packageName}</strong></div>
          <div><small className="text-muted d-block">Travel Date</small><strong>{new Date(tour.travelDate).toLocaleDateString("en-IN")}</strong></div>
          <div><small className="text-muted d-block">Travelers</small><strong>{tour.numberOfTravelers}</strong></div>
          <div><small className="text-muted d-block">Coordinator</small><strong>{tour.coordinator || "—"}</strong></div>
          {tour.roomRequirements && <div><small className="text-muted d-block">Room Req.</small><strong>{tour.roomRequirements}</strong></div>}
        </div>
      </div>

      {/* Email Actions Bar */}
      {selectedHotelIds.length > 0 && (
        <div className="alert alert-primary d-flex align-items-center gap-3 mb-3" role="alert">
          <Send size={18} />
          <span><strong>{selectedHotelIds.length}</strong> hotel{selectedHotelIds.length > 1 ? "s" : ""} selected for email</span>
          <div className="ms-auto d-flex gap-2">
            <input
              className="form-control form-control-sm"
              placeholder="Optional note to hotels…"
              value={customNote}
              onChange={e => setCustomNote(e.target.value)}
              style={{ width: 260 }}
            />
            <button className="btn btn-outline-primary btn-sm" onClick={handlePreview}>Preview</button>
            <button className="btn btn-primary btn-sm" onClick={handleSendEmails} disabled={sending}>
              {sending ? <><RefreshCw size={14} className="me-1" style={{ animation: "spin 1s linear infinite" }} />Sending…</> : <><Send size={14} className="me-1" />Send Emails</>}
            </button>
          </div>
        </div>
      )}

      {/* Destinations */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-semibold mb-0"><MapPin size={18} className="me-2 text-primary" />Destinations & Hotels</h5>
        <button className="btn btn-primary btn-sm" onClick={() => setShowDestForm(!showDestForm)}>
          <Plus size={16} className="me-1" />Add Destination
        </button>
      </div>

      {/* Add Destination Form */}
      {showDestForm && (
        <div className="card border-primary border-2 shadow-sm rounded-3 mb-3">
          <div className="card-body p-4">
            <h6 className="fw-semibold mb-3">New Destination</h6>
            <form onSubmit={handleAddDestination}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold fs-7">City *</label>
                  <select className="form-select" value={destForm.cityId} onChange={e => setDestForm(p => ({ ...p, cityId: e.target.value }))} required>
                    <option value="">Select city…</option>
                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}, {c.state}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold fs-7">Check In</label>
                  <input type="date" className="form-control" value={destForm.checkIn} onChange={e => setDestForm(p => ({ ...p, checkIn: e.target.value }))} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold fs-7">Check Out</label>
                  <input type="date" className="form-control" value={destForm.checkOut} onChange={e => setDestForm(p => ({ ...p, checkOut: e.target.value }))} />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold fs-7">Nights</label>
                  <input type="number" min="1" className="form-control" value={destForm.nights} onChange={e => setDestForm(p => ({ ...p, nights: +e.target.value }))} />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold fs-7">Room Type</label>
                  <select className="form-select" value={destForm.roomType} onChange={e => setDestForm(p => ({ ...p, roomType: e.target.value }))}>
                    {["Standard", "Deluxe", "Super Deluxe", "Suite", "Premium Suite"].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold fs-7">Meal Plan</label>
                  <select className="form-select" value={destForm.mealPlan} onChange={e => setDestForm(p => ({ ...p, mealPlan: e.target.value }))}>
                    {["EP", "CP", "MAP", "AP"].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold fs-7">Rooms</label>
                  <input type="number" min="1" className="form-control" value={destForm.roomCount} onChange={e => setDestForm(p => ({ ...p, roomCount: +e.target.value }))} />
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-primary btn-sm">Add Destination</button>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowDestForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {destinations.length === 0 && !showDestForm && (
        <div className="text-center py-5 border rounded-3 bg-white text-muted">
          <MapPin size={40} className="mb-3 opacity-25" />
          <p>No destinations added yet.<br />Click "Add Destination" to begin.</p>
        </div>
      )}

      {/* Destination Cards */}
      {destinations.map(dest => {
        const group = hotelGroups.find(g => g.destination.id === dest.id);
        const hotelList = group?.hotels || [];
        const available = getAvailableHotels(dest.id, dest.cityId);

        return (
          <div key={dest.id} className="card border-0 shadow-sm rounded-3 mb-3">
            <div className="card-header bg-white border-bottom d-flex align-items-center gap-3 py-3 px-4">
              <MapPin size={16} className="text-primary" />
              <div>
                <strong>{dest.city?.name}</strong>
                <span className="text-muted ms-2 fs-7">
                  {dest.checkIn ? new Date(dest.checkIn).toLocaleDateString("en-IN") : "—"} →{" "}
                  {dest.checkOut ? new Date(dest.checkOut).toLocaleDateString("en-IN") : "—"}
                  {" "}• {dest.nights} night{dest.nights !== 1 ? "s" : ""}
                  {" "}• {dest.roomCount} × {dest.roomType} ({dest.mealPlan})
                </span>
              </div>
              <button className="ms-auto btn btn-outline-danger btn-sm" onClick={() => handleDeleteDestination(dest.id)}>
                <Trash2 size={14} />
              </button>
            </div>
            <div className="card-body p-4">
              {/* Hotel list */}
              {hotelList.length === 0 && (
                <p className="text-muted fs-7 mb-3">No hotels selected for this destination yet.</p>
              )}
              <div className="d-flex flex-column gap-2 mb-3">
                {hotelList.map(th => (
                  <div key={th.id} className="d-flex align-items-center gap-3 p-3 border rounded-3 bg-light">
                    <input
                      type="checkbox"
                      checked={selectedHotelIds.includes(th.id)}
                      onChange={() => toggleSelect(th.id)}
                      disabled={["EMAIL_SENT", "REPLIED", "CONFIRMED"].includes(th.status)}
                      title={["EMAIL_SENT", "REPLIED", "CONFIRMED"].includes(th.status) ? "Email already sent" : "Select to send email"}
                    />
                    <Building2 size={16} className="text-secondary flex-shrink-0" />
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{th.hotel?.name}</div>
                      <small className="text-muted">{th.hotel?.email || "No email"} &bull; {th.hotel?.phone || "—"}</small>
                    </div>
                    <StatusBadge status={th.status} />
                    <button className="btn btn-outline-danger btn-sm p-1" onClick={() => handleRemoveHotel(th.id)}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add hotel dropdown */}
              {available.length > 0 && (
                <div className="d-flex align-items-center gap-2">
                  <select
                    className="form-select form-select-sm"
                    defaultValue=""
                    onChange={e => { if (e.target.value) handleAddHotel(dest.id, e.target.value); e.target.value = ""; }}
                    style={{ maxWidth: 300 }}
                  >
                    <option value="">+ Add a hotel in {dest.city?.name}…</option>
                    {available.map(h => <option key={h.id} value={h.id}>{h.name} ({h.category})</option>)}
                  </select>
                </div>
              )}
              {available.length === 0 && hotelList.length === 0 && (
                <p className="text-muted fs-7 mb-0">No hotels available in {dest.city?.name}. Add hotels in the Hotels section first.</p>
              )}
            </div>
          </div>
        );
      })}

      {/* Email Preview Modal */}
      {showPreview && previewData && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Email Preview</h5>
                <button className="btn-close" onClick={() => setShowPreview(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Subject</label>
                  <input className="form-control" readOnly value={previewData.subject} />
                </div>
                <label className="form-label fw-semibold">Body</label>
                <div className="border rounded-3 p-3 bg-light" style={{ fontSize: 14 }}
                  dangerouslySetInnerHTML={{ __html: previewData.body }} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={() => setShowPreview(false)}>Close</button>
                <button className="btn btn-primary" onClick={handleSendEmails} disabled={sending}>
                  <Send size={15} className="me-1" />{sending ? "Sending…" : `Send to ${selectedHotelIds.length} hotel(s)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
