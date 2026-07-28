import React from "react";
import {
  FaInbox,
  FaPaperPlane,
  FaHourglassHalf,
  FaReply,
  FaStar,
  FaTrash,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendarAlt,
  FaFilter,
  FaTimesCircle
} from "react-icons/fa";

export default function EmailSidebar({
  emails,
  activeMailbox,
  setActiveMailbox,
  activeSmartView,
  setActiveSmartView,
  selectedHotel,
  setSelectedHotel,
  selectedStatus,
  setSelectedStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  clearFilters,
  hotelsList
}) {
  // Derive counts
  const inboxCount = emails.filter(m => m.mailbox === "inbox").length;
  const sentCount = emails.filter(m => m.mailbox === "sent").length;
  const awaitingCount = emails.filter(m => m.status === "PENDING").length;
  const repliedCount = emails.filter(m => m.status === "REPLIED").length;
  const starredCount = emails.filter(m => m.isStarred).length;
  const trashCount = emails.filter(m => m.mailbox === "trash").length;

  const mailboxes = [
    { id: "inbox", label: "Inbox", icon: <FaInbox />, count: inboxCount },
    { id: "sent", label: "Sent", icon: <FaPaperPlane />, count: sentCount },
    { id: "awaiting_reply", label: "Awaiting Reply", icon: <FaHourglassHalf />, count: awaitingCount },
    { id: "replied", label: "Replied", icon: <FaReply />, count: repliedCount },
    { id: "starred", label: "Starred", icon: <FaStar />, count: starredCount },
    { id: "trash", label: "Trash", icon: <FaTrash />, count: trashCount }
  ];

  const smartViews = [
    { id: "today", label: "Today", icon: <FaCalendarDay /> },
    { id: "this_week", label: "This Week", icon: <FaCalendarWeek /> },
    { id: "this_month", label: "This Month", icon: <FaCalendarAlt /> }
  ];

  return (
    <div className="d-flex flex-column gap-4 border-end pe-lg-3 h-100">
      {/* Mailboxes */}
      <div>
        <span className="overline-title text-secondary mb-2 d-block">Mailboxes</span>
        <div className="nav flex-column nav-pills gap-1">
          {mailboxes.map((mb) => (
            <button
              key={mb.id}
              onClick={() => {
                setActiveMailbox(mb.id);
                setActiveSmartView(null);
              }}
              className={`nav-link text-start d-flex align-items-center justify-content-between py-2 px-3 fs-7 border-0 w-100 ${
                activeMailbox === mb.id && !activeSmartView
                  ? "active"
                  : "bg-transparent text-secondary"
              }`}
              style={{ borderRadius: "8px" }}
            >
              <div className="d-flex align-items-center gap-2">
                {mb.icon}
                <span>{mb.label}</span>
              </div>
              {mb.count > 0 && (
                <span className={`badge rounded-pill ${
                  activeMailbox === mb.id && !activeSmartView
                    ? "bg-white text-primary"
                    : "bg-light text-secondary border border-soft"
                }`}>
                  {mb.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Smart Views */}
      <div>
        <span className="overline-title text-secondary mb-2 d-block">Smart Views</span>
        <div className="nav flex-column nav-pills gap-1">
          {smartViews.map((sv) => (
            <button
              key={sv.id}
              onClick={() => {
                setActiveSmartView(sv.id);
                setActiveMailbox("");
              }}
              className={`nav-link text-start d-flex align-items-center gap-2 py-2 px-3 fs-7 border-0 w-100 ${
                activeSmartView === sv.id
                  ? "active"
                  : "bg-transparent text-secondary"
              }`}
              style={{ borderRadius: "8px" }}
            >
              {sv.icon}
              <span>{sv.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters Section */}
      <div className="border-top pt-3">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="overline-title text-secondary d-flex align-items-center gap-1.5 m-0">
            <FaFilter size={10} /> Filters
          </span>
          {(selectedHotel !== "All" || selectedStatus !== "All" || startDate || endDate) && (
            <button
              type="button"
              className="btn btn-link p-0 text-danger text-decoration-none fs-8 d-flex align-items-center gap-1 border-0 bg-transparent"
              onClick={clearFilters}
            >
              <FaTimesCircle /> Clear
            </button>
          )}
        </div>

        <div className="space-y-3">
          {/* Hotel Filter */}
          <div>
            <label className="form-label text-dark fw-semibold fs-8 mb-1">Hotel</label>
            <select
              className="form-select form-select-sm fs-7 border rounded-lg shadow-none"
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
            >
              <option value="All">All Hotels</option>
              {hotelsList.map(h => (
                <option key={h.id} value={h.name}>{h.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="form-label text-dark fw-semibold fs-8 mb-1">Status</label>
            <select
              className="form-select form-select-sm fs-7 border rounded-lg shadow-none"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="PENDING">PENDING</option>
              <option value="REPLIED">REPLIED</option>
              <option value="VOUCHER SENT">VOUCHER SENT</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="form-label text-dark fw-semibold fs-8 mb-1">From Date</label>
            <input
              type="date"
              className="form-control form-control-sm fs-7 border rounded-lg shadow-none"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div>
            <label className="form-label text-dark fw-semibold fs-8 mb-1">To Date</label>
            <input
              type="date"
              className="form-control form-control-sm fs-7 border rounded-lg shadow-none"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
