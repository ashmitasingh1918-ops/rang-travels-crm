import React, { useState } from "react";
import { FaTimes, FaPaperclip, FaPlaneDeparture } from "react-icons/fa";
import { toast } from "sonner";

export default function ComposeEmailModal({
  open,
  onClose,
  hotelsList,
  onSendEmail
}) {
  const [to, setTo] = useState("");
  const [selectedHotelName, setSelectedHotelName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);

  if (!open) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleHotelSelect = (hotelName) => {
    setSelectedHotelName(hotelName);
    
    // Auto-fill To field based on selected hotel reservations address
    const dummyEmail = `reservations@${hotelName.toLowerCase().replace(/[^a-z0-9]/g, "") || "hotel"}.com`;
    setTo(dummyEmail);
    
    // Auto-fill a professional subject template
    if (!subject) {
      setSubject(`Booking Inquiry / Quotation Request — ${hotelName}`);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!to || !selectedHotelName || !subject || !message) {
      toast.error("Please fill in all required fields (To, Hotel, Subject, Message).");
      return;
    }

    const payload = {
      id: `mail-${Date.now()}`,
      gmailMessageId: `msg_${Math.random().toString(36).substring(2, 15)}`,
      threadId: `thread_${Math.random().toString(36).substring(2, 15)}`,
      hotelName: selectedHotelName,
      from: "admin@rangtravels.com",
      to: to,
      subject: subject,
      preview: message.substring(0, 60) + (message.length > 60 ? "..." : ""),
      body: message,
      status: "PENDING",
      mailbox: "sent",
      isRead: true,
      isStarred: false,
      receivedAt: new Date().toISOString(),
      attachments: attachment ? [{ name: attachment.name, size: (attachment.size / 1024).toFixed(0) + " KB", type: "file" }] : [],
      relatedBookingId: `BK-${2026}-${Math.floor(Math.random() * 900 + 100)}`,
      history: [
        { action: `Inquiry composed and sent to ${selectedHotelName}`, timestamp: new Date().toLocaleTimeString(), user: "Admin User" }
      ]
    };

    onSendEmail(payload);
    
    // Reset state & close
    setTo("");
    setSelectedHotelName("");
    setSubject("");
    setMessage("");
    setAttachment(null);
    onClose();
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(15, 23, 42, 0.4)", zIndex: 1060 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-2xl overflow-hidden bg-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
          
          {/* Header */}
          <div className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between bg-light">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary bg-opacity-10 p-2 rounded-circle text-primary">
                <FaPlaneDeparture />
              </div>
              <h5 className="m-0 font-display fw-bold text-dark fs-6">Compose New Email</h5>
            </div>
            <button
              type="button"
              className="border-0 bg-transparent text-secondary p-1 hover:text-dark transition-colors"
              onClick={onClose}
              aria-label="Close"
            >
              <FaTimes size={16} />
            </button>
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className="modal-body p-4 space-y-3">
              {/* Hotel Selector */}
              <div>
                <label className="form-label fw-bold text-dark fs-7 mb-1">Select Hotel Partner <span className="text-danger">*</span></label>
                <select
                  className="form-select fs-7 px-3 py-2 border rounded-xl shadow-none text-dark"
                  value={selectedHotelName}
                  onChange={(e) => handleHotelSelect(e.target.value)}
                  required
                >
                  <option value="">-- Choose Hotel --</option>
                  {hotelsList.map(h => (
                    <option key={h.id} value={h.name}>{h.name}</option>
                  ))}
                </select>
              </div>

              {/* To field */}
              <div>
                <label className="form-label fw-bold text-dark fs-7 mb-1">To <span className="text-danger">*</span></label>
                <input
                  type="email"
                  className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                  placeholder="recipient@hoteldomain.com"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label className="form-label fw-bold text-dark fs-7 mb-1">Subject <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                  placeholder="Inquiry Reference / Booking Subject..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="form-label fw-bold text-dark fs-7 mb-1">Message <span className="text-danger">*</span></label>
                <textarea
                  className="form-control px-3 py-2 border rounded-xl shadow-none fs-7"
                  rows="6"
                  placeholder="Write your email correspondence detail here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  style={{ resize: "none" }}
                />
              </div>

              {/* File Attachment */}
              <div>
                <label className="form-label fw-bold text-dark fs-7 mb-1">Attach File</label>
                <div className="input-group border rounded-xl overflow-hidden bg-light shadow-none">
                  <span className="input-group-text bg-transparent border-0 text-muted ps-3 pe-2">
                    <FaPaperclip />
                  </span>
                  <input
                    type="file"
                    className="form-control border-0 bg-transparent py-2 fs-7"
                    onChange={handleFileChange}
                  />
                </div>
                {attachment && (
                  <div className="mt-1 text-secondary fs-8">
                    Selected file: <strong>{attachment.name}</strong> ({(attachment.size / 1024).toFixed(0)} KB)
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer px-4 py-3 bg-light border-top d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-link link-secondary text-decoration-none fw-semibold fs-7"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 rounded-xl fw-bold border-0 shadow-sm transition-click"
              >
                Send Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
