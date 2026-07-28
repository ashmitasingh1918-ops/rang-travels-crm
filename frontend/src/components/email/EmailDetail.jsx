import React, { useState } from "react";
import {
  FaStar,
  FaRegStar,
  FaArchive,
  FaTrash,
  FaEllipsisV,
  FaReply,
  FaReplyAll,
  FaShare,
  FaCheckCircle,
  FaFileInvoice,
  FaPaperPlane,
  FaPaperclip,
  FaArrowLeft,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import { toast } from "sonner";
import ReplyBox from "./ReplyBox";

export default function EmailDetail({
  email,
  onBack, // utilized for mobile response
  toggleStar,
  onDelete,
  onStatusChange,
  onOpenVoucher,
  onSendReply
}) {
  const [activeTab, setActiveTab] = useState("email"); // "email", "attachments", "history"
  const [showOriginal, setShowOriginal] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);

  if (!email) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5 bg-white border border-soft rounded-xl shadow-sm">
        <i className="bi bi-chat-left-dots text-muted display-4 mb-3"></i>
        <h5 className="text-secondary fw-semibold">No Email Selected</h5>
        <p className="text-secondary fs-8">Select an email from the left pane to view its full details and take CRM actions.</p>
      </div>
    );
  }

  // Handle Mark Quotation Received
  const handleMarkQuotation = () => {
    onStatusChange(email.id, "REPLIED");
    toast.success("Quotation marked as received. Status set to REPLIED.");
  };

  // Handle Send Voucher confirmation
  const handleSendVoucher = () => {
    onStatusChange(email.id, "VOUCHER SENT");
    toast.success(`Voucher successfully dispatched to ${email.hotelName} reservations!`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-warning bg-opacity-10 text-warning border border-warning-subtle";
      case "REPLIED":
        return "bg-success bg-opacity-10 text-success border border-success-subtle";
      case "VOUCHER SENT":
        return "bg-primary bg-opacity-10 text-primary border border-primary-subtle";
      default:
        return "bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle";
    }
  };

  return (
    <div className="card border-soft rounded-xl p-4 bg-white shadow-sm d-flex flex-column h-100" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Header toolbar */}
      <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
        <div className="d-flex align-items-center gap-2">
          {/* Mobile Back Button */}
          <button
            type="button"
            className="btn btn-sm btn-light border-0 d-md-none p-1.5 rounded-lg"
            onClick={onBack}
            title="Go back"
          >
            <FaArrowLeft />
          </button>
          <h5 className="m-0 font-display fw-bold text-dark fs-6 truncate" style={{ maxWidth: "450px" }}>
            {email.subject}
          </h5>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Star Toggle */}
          <button
            type="button"
            className="btn btn-sm btn-white border border-soft p-2 rounded-lg text-amber-500 shadow-sm"
            onClick={() => toggleStar(email.id)}
            title="Star email"
          >
            {email.isStarred ? <FaStar style={{ color: "#ffc107" }} /> : <FaRegStar className="text-secondary" />}
          </button>

          {/* Archive */}
          <button
            type="button"
            className="btn btn-sm btn-white border border-soft p-2 rounded-lg text-secondary shadow-sm"
            onClick={() => {
              toast.success("Message archived successfully.");
            }}
            title="Archive"
          >
            <FaArchive />
          </button>

          {/* Delete */}
          <button
            type="button"
            className="btn btn-sm btn-white border border-soft p-2 rounded-lg text-danger shadow-sm"
            onClick={() => onDelete(email.id)}
            title="Delete email"
          >
            <FaTrash />
          </button>

          <div className="vr mx-1"></div>

          {/* More options placeholder */}
          <button
            type="button"
            className="btn btn-sm btn-white border border-soft p-2 rounded-lg text-secondary shadow-sm"
            title="More actions"
          >
            <FaEllipsisV />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs border-bottom mb-3">
        <li className="nav-item">
          <button
            className={`nav-link border-0 fw-semibold fs-7 pb-2 ${activeTab === "email" ? "active border-bottom border-primary text-primary" : "text-secondary"}`}
            onClick={() => setActiveTab("email")}
            style={{ background: "none" }}
          >
            Email
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link border-0 fw-semibold fs-7 pb-2 d-flex align-items-center gap-1.5 ${activeTab === "attachments" ? "active border-bottom border-primary text-primary" : "text-secondary"}`}
            onClick={() => setActiveTab("attachments")}
            style={{ background: "none" }}
          >
            Attachments
            {email.attachments && email.attachments.length > 0 && (
              <span className="badge bg-light text-secondary border border-soft">{email.attachments.length}</span>
            )}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link border-0 fw-semibold fs-7 pb-2 ${activeTab === "history" ? "active border-bottom border-primary text-primary" : "text-secondary"}`}
            onClick={() => setActiveTab("history")}
            style={{ background: "none" }}
          >
            History
          </button>
        </li>
      </ul>

      {/* Scrollable content pane */}
      <div className="flex-grow-1 overflow-y-auto mb-3" style={{ maxHeight: "calc(100vh - 430px)" }}>
        {/* EMAIL TAB CONTENT */}
        {activeTab === "email" && (
          <div>
            {/* Correspondence sender header */}
            <div className="d-flex justify-content-between align-items-start bg-light p-3 rounded-xl mb-3">
              <div className="d-flex align-items-center gap-2">
                <div 
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold font-display" 
                  style={{ width: "40px", height: "40px" }}
                >
                  {(email.hotelName || email.from || "PH").substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="fw-bold text-dark fs-7">{email.hotelName || email.from || "Partner Hotel"}</div>
                  <div className="text-secondary fs-8">From: {email.from}</div>
                  <div className="text-secondary fs-8">To: {email.to}</div>
                </div>
              </div>
              <div className="text-end">
                <div className="text-secondary fs-8">{new Date(email.receivedAt).toLocaleString()}</div>
                <span className={`badge px-2 py-1 fs-8 mt-1.5 ${getStatusBadge(email.status)}`}>
                  {email.status}
                </span>
              </div>
            </div>

            {/* Email message body block */}
            <div 
              className="px-2 py-1 text-dark fs-7 mb-3" 
              style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}
            >
              {email.body}
            </div>

            {/* Original message collapse accordian */}
            <div className="border rounded-xl p-3 bg-light mb-4">
              <div 
                className="d-flex justify-content-between align-items-center cursor-pointer"
                onClick={() => setShowOriginal(!showOriginal)}
              >
                <span className="fs-8 fw-semibold text-secondary">— Original Outgoing Message —</span>
                <span className="text-secondary">
                  {showOriginal ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </span>
              </div>
              {showOriginal && (
                <div className="mt-2 text-secondary fs-8 p-1 border-top border-soft">
                  <div><strong>From:</strong> admin@rangtravels.com</div>
                  <div><strong>To:</strong> reservations@{(email.hotelName || "hotel").toLowerCase().replace(/[^a-z0-9]/g, "") || "hotel"}.com</div>
                  <div><strong>Date:</strong> 26 Jul 2026, 09:12 AM</div>
                  <br />
                  <div>Dear Team,</div>
                  <div>Please verify prices and block standard double occupancies for the Rang Travels group voucher.</div>
                </div>
              )}
            </div>

            {/* Reply Actions */}
            {!showReplyBox ? (
              <div className="d-flex align-items-center gap-2 mb-3">
                <button
                  className="btn btn-outline-primary d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-lg fs-7 transition-click"
                  onClick={() => setShowReplyBox(true)}
                >
                  <FaReply /> Reply
                </button>
                <button
                  className="btn btn-outline-secondary d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-lg fs-7 transition-click"
                  onClick={() => setShowReplyBox(true)}
                >
                  <FaReplyAll /> Reply All
                </button>
                <button
                  className="btn btn-outline-secondary d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-lg fs-7 transition-click"
                  onClick={() => {
                    toast.info("Forwarding email...");
                  }}
                >
                  <FaShare /> Forward
                </button>
              </div>
            ) : (
              <ReplyBox
                email={email}
                onClose={() => setShowReplyBox(false)}
                onSendReply={(replyText) => {
                  onSendReply(email.id, replyText);
                  setShowReplyBox(false);
                }}
              />
            )}
          </div>
        )}

        {/* ATTACHMENTS TAB CONTENT */}
        {activeTab === "attachments" && (
          <div>
            {email.attachments && email.attachments.length > 0 ? (
              <div className="row g-2">
                {email.attachments.map((file, idx) => (
                  <div key={idx} className="col-12 col-md-6">
                    <div className="card p-3 border-soft rounded-xl bg-light flex-row align-items-center justify-content-between shadow-none hover-shadow">
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-primary bg-opacity-10 p-2.5 rounded-lg text-primary">
                          <FaPaperclip />
                        </div>
                        <div>
                          <div className="fw-semibold text-dark fs-7 truncate" style={{ maxWidth: "160px" }}>{file.name}</div>
                          <div className="text-secondary fs-8">{file.size}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-white border rounded-lg px-2.5 py-1.5 fs-8 text-secondary shadow-sm"
                        onClick={() => toast.success(`Downloaded ${file.name}`)}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted fs-7 py-4">No attachments found in this email thread.</p>
            )}
          </div>
        )}

        {/* HISTORY TAB CONTENT */}
        {activeTab === "history" && (
          <div>
            {email.history && email.history.length > 0 ? (
              <div className="timeline ps-3 border-start py-2">
                {email.history.map((log, idx) => (
                  <div key={idx} className="mb-3 position-relative" style={{ left: "-23px" }}>
                    <span 
                      className="position-absolute bg-primary rounded-circle border border-white" 
                      style={{ width: "10px", height: "10px", top: "6px" }}
                    ></span>
                    <div className="ps-4">
                      <span className="text-secondary fs-8 fw-semibold">{log.timestamp}</span>
                      <div className="text-dark fs-7 fw-bold">{log.action}</div>
                      <span className="text-secondary fs-8">By user: {log.user}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-secondary fs-7 py-4">No historical records logged yet.</p>
            )}
          </div>
        )}
      </div>

      {/* CRM ACTIONS SECTION */}
      <div className="border-top pt-3 bg-white mt-auto">
        <span className="overline-title text-secondary mb-2.5 d-block">CRM Actions</span>
        
        <div className="row g-2 mb-3">
          <div className="col-12 col-sm-6">
            <button
              className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center gap-1.5 py-2 rounded-xl fs-7 fw-semibold transition-click"
              onClick={handleMarkQuotation}
              disabled={email.status === "REPLIED"}
            >
              <FaCheckCircle /> Mark Quotation Received
            </button>
          </div>
          <div className="col-12 col-sm-6">
            <button
              className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-1.5 py-2 rounded-xl fs-7 fw-semibold transition-click"
              style={{ borderColor: "#6f42c1", color: "#6f42c1" }} // Purple tone matching custom classes
              onClick={onOpenVoucher}
            >
              <FaFileInvoice /> Generate / Upload Voucher
            </button>
          </div>
        </div>

        <button
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-1.5 py-2.5 rounded-xl fs-7 fw-bold shadow-sm transition-click"
          onClick={handleSendVoucher}
        >
          <FaPaperPlane /> Send Voucher to Hotel
        </button>
      </div>

      {/* Info Details Section */}
      <div className="bg-light p-3 rounded-xl border border-soft d-flex flex-wrap gap-x-4 gap-y-2 mt-3 fs-8">
        <div><strong>Hotel:</strong> <span className="text-dark">{email.hotelName || "General Partner"}</span></div>
        <div><strong>Status:</strong> <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle font-monospace">{email.status}</span></div>
        <div><strong>Booking Ref:</strong> <span className="text-primary fw-bold font-monospace">{email.relatedBookingId || "None"}</span></div>
        <div><strong>Date Received:</strong> <span className="text-dark">{new Date(email.receivedAt).toLocaleDateString()}</span></div>
        <div><strong>From:</strong> <span className="text-dark truncate" style={{ maxWidth: "160px", display: "inline-block", verticalAlign: "middle" }}>{email.from}</span></div>
      </div>
    </div>
  );
}
