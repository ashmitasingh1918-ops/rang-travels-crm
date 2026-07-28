import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { toast } from "sonner";

export default function ReplyBox({ email, onClose, onSendReply }) {
  const [replyText, setReplyText] = useState("");

  const handleSend = () => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply message.");
      return;
    }

    onSendReply(replyText);
    setReplyText("");
    toast.success(`Reply sent successfully to ${email.hotelName || email.from || "recipient"}!`);
  };

  return (
    <div className="card p-3 border-soft rounded-xl bg-light mt-3 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="fs-8 fw-semibold text-secondary">
          Replying to <strong>{email.from}</strong>
        </span>
        <button
          type="button"
          className="btn-close shadow-none"
          style={{ fontSize: "0.7rem" }}
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>

      <textarea
        className="form-control px-3 py-2 border rounded-xl shadow-none fs-7 mb-2 text-dark bg-white"
        rows="4"
        placeholder="Type your response to the hotel here..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        style={{ resize: "none" }}
      />

      <div className="d-flex justify-content-end gap-2">
        <button
          className="btn btn-sm btn-white border rounded-lg px-3 py-1.5 fs-8 text-secondary shadow-sm"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="btn btn-sm btn-primary rounded-lg px-3.5 py-1.5 fs-8 fw-bold d-flex align-items-center gap-1 border-0 shadow-sm transition-click"
          onClick={handleSend}
        >
          <FaPaperPlane size={11} /> Send Reply
        </button>
      </div>
    </div>
  );
}
