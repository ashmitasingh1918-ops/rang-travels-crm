import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function EmailList({
  emails,
  selectedEmailId,
  setSelectedEmailId,
  toggleStar,
  selectedEmails,
  setSelectedEmails
}) {
  const getBadgeClass = (status) => {
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

  const handleSelectCheckbox = (e, emailId) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedEmails([...selectedEmails, emailId]);
    } else {
      setSelectedEmails(selectedEmails.filter(id => id !== emailId));
    }
  };

  const isChecked = (emailId) => selectedEmails.includes(emailId);

  const formatReceivedAt = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const today = new Date();
    
    // If today
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If yesterday
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    
    // Otherwise format date
    return date.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (emails.length === 0) {
    return (
      <div className="text-center py-5 bg-white border border-soft rounded-xl shadow-sm">
        <i className="bi bi-envelope text-secondary display-6"></i>
        <p className="mt-3 text-secondary fs-7 mb-0">No emails match the current mailbox or filters.</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-2" style={{ maxHeight: "calc(100vh - 280px)", overflowY: "auto" }}>
      {emails.map((email) => {
        const isSelected = email.id === selectedEmailId;
        const isUnread = !email.isRead;

        return (
          <div
            key={email.id}
            onClick={() => setSelectedEmailId(email.id)}
            className={`card border-soft rounded-xl p-3 cursor-pointer transition-click ${
              isSelected
                ? "border-primary bg-primary bg-opacity-10"
                : isUnread
                ? "bg-white border-0 shadow-sm"
                : "bg-white bg-opacity-70"
            }`}
            style={{ transition: "all 0.15s ease" }}
          >
            <div className="d-flex align-items-start gap-2.5">
              {/* Checkbox */}
              <div 
                className="pt-0.5" 
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  className="form-check-input shadow-none cursor-pointer"
                  checked={isChecked(email.id)}
                  onChange={(e) => handleSelectCheckbox(e, email.id)}
                  style={{ width: "16px", height: "16px" }}
                />
              </div>

              {/* Star Icon */}
              <button
                type="button"
                className="btn p-0 border-0 bg-transparent text-amber-500 pt-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStar(email.id);
                }}
              >
                {email.isStarred ? (
                  <FaStar size={16} style={{ color: "#ffc107" }} />
                ) : (
                  <FaRegStar size={16} className="text-secondary opacity-50" />
                )}
              </button>

              {/* Text Blocks */}
              <div className="flex-grow-1 min-w-0">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className={`fs-7 text-dark truncate ${isUnread ? "fw-bold" : "fw-medium"}`}>
                    {email.hotelName || email.from || "Partner Hotel"}
                  </span>
                  <span className="text-secondary fs-8 float-end">
                    {formatReceivedAt(email.receivedAt)}
                  </span>
                </div>

                <div className={`fs-7 mb-1 text-dark truncate ${isUnread ? "fw-bold" : "fw-normal"}`}>
                  {email.subject}
                </div>

                <p className="text-secondary fs-8 mb-2 truncate">
                  {email.preview}
                </p>

                <div>
                  <span className={`badge px-2 py-1 rounded fs-8 fw-semibold ${getBadgeClass(email.status)}`}>
                    {email.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
