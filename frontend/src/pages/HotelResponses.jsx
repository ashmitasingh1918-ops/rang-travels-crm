import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Check, X, Clock, MessageSquare, FileText, Download, Send, RefreshCw } from "lucide-react";
import { getAllTourHotels, updateHotelStatus, updateHotelNotes } from "../services/tourHotelService";
import { generateVoucher, sendVoucher, getVoucherDownloadUrl } from "../services/tourHotelService";
import api from "../services/axios";

const STATUS_OPTIONS = ["PENDING", "EMAIL_SENT", "REPLIED", "CONFIRMED", "REJECTED"];
const STATUS_LABELS = {
  PENDING:    { label: "Pending",    color: "#f59e0b", bg: "#fef3c7", icon: Clock },
  EMAIL_SENT: { label: "Email Sent", color: "#3b82f6", bg: "#dbeafe", icon: Send },
  REPLIED:    { label: "Replied",    color: "#8b5cf6", bg: "#f5f3ff", icon: MessageSquare },
  CONFIRMED:  { label: "Confirmed",  color: "#10b981", bg: "#ecfdf5", icon: Check },
  REJECTED:   { label: "Rejected",   color: "#ef4444", bg: "#fef2f2", icon: X },
};

function StatusBadge({ status }) {
  const s = STATUS_LABELS[status] || STATUS_LABELS.PENDING;
  const Icon = s.icon;
  return (
    <span style={{ background: s.bg, color: s.color, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
      <Icon size={12} /> {s.label}
    </span>
  );
}

export default function HotelResponses() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [notesMap, setNotesMap] = useState({});
  const [generating, setGenerating] = useState({});
  const [sendingVoucher, setSendingVoucher] = useState({});

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllTourHotels(statusFilter !== "all" ? { status: statusFilter } : {});
      setRows(res.data || []);
    } catch {
      toast.error("Failed to load hotel responses");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateHotelStatus(id, status);
      toast.success("Status updated");
      fetch();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update status");
    }
  };

  const handleNotesSave = async (id) => {
    try {
      await updateHotelNotes(id, notesMap[id] || "");
      toast.success("Notes saved");
    } catch {
      toast.error("Failed to save notes");
    }
  };

  const handleGenerateVoucher = async (row) => {
    if (row.status !== "CONFIRMED") return toast.error("Only confirmed hotels can generate vouchers");
    try {
      setGenerating(p => ({ ...p, [row.id]: true }));
      const data = {
        tourHotelId: row.id,
        guestName: row.tour?.client?.fullName || "",
        checkInDate: row.destination?.checkIn,
        checkOutDate: row.destination?.checkOut,
        roomType: row.destination?.roomType || "Standard",
        numberOfRooms: row.destination?.roomCount || 1,
        mealPlan: row.destination?.mealPlan || "CP",
        nationality: "Indian",
        hotelName: row.hotel?.name,
        hotelPhone: row.hotel?.phone || "",
      };
      await generateVoucher(data);
      toast.success("Voucher generated successfully");
      fetch();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to generate voucher");
    } finally {
      setGenerating(p => ({ ...p, [row.id]: false }));
    }
  };

  const handleSendVoucher = async (voucher, row) => {
    if (!voucher?.pdfPath) return toast.error("Generate the voucher PDF first");
    if (!window.confirm("Send this voucher to the hotel via email?")) return;
    try {
      setSendingVoucher(p => ({ ...p, [voucher.id]: true }));
      await sendVoucher(voucher.id);
      toast.success("Voucher sent to hotel");
      fetch();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to send voucher");
    } finally {
      setSendingVoucher(p => ({ ...p, [voucher.id]: false }));
    }
  };

  const filtered = rows.filter(r => {
    const q = search.toLowerCase();
    return !q || r.hotel?.name?.toLowerCase().includes(q) || r.tour?.packageName?.toLowerCase().includes(q) || r.tour?.client?.fullName?.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Hotel Responses</h4>
          <p className="text-muted fs-7 mb-0">Manage hotel confirmations and generate vouchers</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={fetch}><RefreshCw size={15} className="me-1" />Refresh</button>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm rounded-3 mb-4">
        <div className="card-body d-flex gap-3 p-3">
          <input className="form-control" placeholder="Search hotel, tour, client…" value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300 }} />
          <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ maxWidth: 200 }}>
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s].label}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5 text-muted border rounded-3 bg-white">No hotel responses found.</div>
      ) : (
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
          <table className="table table-hover mb-0" style={{ fontSize: 14 }}>
            <thead style={{ background: "#f8faff" }}>
              <tr>
                <th className="py-3 px-4">Hotel</th>
                <th className="py-3">Tour / Client</th>
                <th className="py-3">Destination</th>
                <th className="py-3">Status</th>
                <th className="py-3">Notes</th>
                <th className="py-3">Voucher</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => {
                const voucher = row.vouchers?.[0];
                return (
                  <tr key={row.id}>
                    <td className="py-3 px-4">
                      <div className="fw-semibold">{row.hotel?.name}</div>
                      <small className="text-muted">{row.hotel?.email || "No email"}</small>
                    </td>
                    <td className="py-3">
                      <div>{row.tour?.packageName}</div>
                      <small className="text-muted">{row.tour?.client?.fullName}</small>
                    </td>
                    <td className="py-3">
                      <div>{row.destination?.city?.name}</div>
                      <small className="text-muted">
                        {row.destination?.checkIn ? new Date(row.destination.checkIn).toLocaleDateString("en-IN") : "—"} →{" "}
                        {row.destination?.checkOut ? new Date(row.destination.checkOut).toLocaleDateString("en-IN") : "—"}
                      </small>
                    </td>
                    <td className="py-3">
                      <select
                        className="form-select form-select-sm"
                        value={row.status}
                        onChange={e => handleStatusChange(row.id, e.target.value)}
                        style={{ width: 140 }}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s].label}</option>)}
                      </select>
                    </td>
                    <td className="py-3">
                      <div className="d-flex gap-1">
                        <input
                          className="form-control form-control-sm"
                          placeholder="Add notes…"
                          value={notesMap[row.id] ?? (row.notes || "")}
                          onChange={e => setNotesMap(p => ({ ...p, [row.id]: e.target.value }))}
                          style={{ width: 160 }}
                        />
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => handleNotesSave(row.id)}>✓</button>
                      </div>
                    </td>
                    <td className="py-3">
                      {voucher ? (
                        <div className="d-flex flex-column gap-1">
                          <span className={`badge ${voucher.status === "SENT" ? "bg-success" : voucher.status === "GENERATED" ? "bg-info" : "bg-secondary"}`}>{voucher.status}</span>
                          {voucher.pdfPath && (
                            <a href={`http://localhost:5000${voucher.pdfPath}`} target="_blank" rel="noreferrer" className="btn btn-outline-secondary btn-sm p-1">
                              <Download size={13} />
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted fs-8">No voucher</span>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          disabled={row.status !== "CONFIRMED" || generating[row.id]}
                          onClick={() => handleGenerateVoucher(row)}
                          title="Generate Voucher PDF"
                        >
                          {generating[row.id] ? <RefreshCw size={13} /> : <FileText size={13} />}
                        </button>
                        {voucher && (
                          <button
                            className="btn btn-sm btn-success"
                            disabled={!voucher?.pdfPath || voucher.status === "SENT" || sendingVoucher[voucher.id]}
                            onClick={() => handleSendVoucher(voucher, row)}
                            title="Send Voucher via Email"
                          >
                            {sendingVoucher[voucher.id] ? <RefreshCw size={13} /> : <Send size={13} />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
