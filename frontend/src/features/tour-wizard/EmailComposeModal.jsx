/**
 * EmailComposeModal.jsx
 * HTML formatting and templating mail composer modal.
 */
import React, { useState, useEffect, useRef } from "react";
import { X, Mail, Eye, EyeOff, Bold, Italic, Underline, List, ListOrdered, Paperclip, Send } from "lucide-react";
import { toast } from "sonner";
import { substituteTemplate, DEFAULT_EMAIL_TEMPLATE } from "./emailTemplate";

export default function EmailComposeModal({ open, onOpenChange, tour, hotelRequest, hotels = [], onSend }) {
  const [toChips, setToChips] = useState([]);
  const [toInput, setToInput] = useState("");
  const [subject, setSubject] = useState("");
  const [isHtmlPreview, setIsHtmlPreview] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const editorRef = useRef(null);

  // Initialize data on opening
  useEffect(() => {
    if (open && hotelRequest) {
      // Find hotel email in current hotels DB
      const matchedHotel = (hotels || []).find(
        h => h.name?.toLowerCase() === hotelRequest.hotel?.toLowerCase()
      );
      const initialEmail = matchedHotel?.email || `reservations@${hotelRequest.hotel?.toLowerCase().replace(/[^a-z0-9]/g, "") || "hotel"}.com`;
      setToChips([initialEmail]);
      
      const fileNo = tour?.fileNumber || tour?.file_no || "RT-NEW";
      setSubject(`Booking Request ${fileNo} — ${hotelRequest.hotel} (${hotelRequest.check_in} → ${hotelRequest.check_out})`);
      
      // Setup substitution object
      const subData = {
        tour: tour,
        hotel: {
          name: hotelRequest.hotel,
          city: hotelRequest.city
        },
        booking: {
          check_in: hotelRequest.check_in,
          check_out: hotelRequest.check_out,
          nights: hotelRequest.nights,
          rooms_single: hotelRequest.rooms_single,
          rooms_double: hotelRequest.rooms_double,
          rooms_triple: hotelRequest.rooms_triple,
          meal_plan: hotelRequest.meal_plan,
          remarks: hotelRequest.remarks
        },
        sender: {
          name: localStorage.getItem("currentUserName") || "Operations Manager"
        }
      };

      const mailBody = substituteTemplate(DEFAULT_EMAIL_TEMPLATE, subData);
      
      if (editorRef.current) {
        // Convert double newlines to paragraph tags or line breaks for contentEditable html representation
        const htmlFormatted = mailBody.split("\n").map(line => line.trim() ? `<div>${line}</div>` : "<div><br></div>").join("");
        editorRef.current.innerHTML = htmlFormatted;
      }
      setAttachments([]);
      setIsHtmlPreview(false);
    }
  }, [open, hotelRequest, tour, hotels]);

  if (!open || !hotelRequest) return null;

  // Tag chip input behavior
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = toInput.trim().replace(",", "");
      if (val && !toChips.includes(val)) {
        setToChips([...toChips, val]);
      }
      setToInput("");
    } else if (e.key === "Backspace" && !toInput && toChips.length > 0) {
      setToChips(toChips.slice(0, -1));
    }
  };

  const removeChip = (index) => {
    setToChips(toChips.filter((_, i) => i !== index));
  };

  // Rich Text Commands
  const runCommand = (cmd) => {
    document.execCommand(cmd, false, null);
    editorRef.current?.focus();
  };

  // Handle Attachment Drag and Drop
  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        raw: file
      }));
      setAttachments([...attachments, ...filesArr]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArr = Array.from(e.dataTransfer.files).map(file => ({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        raw: file
      }));
      setAttachments([...attachments, ...filesArr]);
    }
  };

  const removeAttachment = (idx) => {
    setAttachments(attachments.filter((_, i) => i !== idx));
  };

  const handleSend = () => {
    if (toChips.length === 0) {
      toast.error("Please specify at least one recipient in 'To' field.");
      return;
    }
    const htmlBody = editorRef.current ? editorRef.current.innerHTML : "";
    
    // Call trigger
    if (onSend) {
      onSend({
        tour_id: tour?.fileNumber || tour?.file_no,
        to: toChips,
        subject,
        body: htmlBody,
        attachments: attachments.map(a => a.name)
      });
    }

    toast.success(`Booking request email successfully dispatched to ${hotelRequest.hotel}!`);
    onOpenChange(false);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(15, 23, 42, 0.4)", zIndex: 1100 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-2xl overflow-hidden bg-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
          
          {/* Header */}
          <div className="px-5 py-4 border-bottom bg-light d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-10 p-2.5 rounded-xl text-primary d-flex align-items-center justify-content-center">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="m-0 fs-5 font-display fw-bold text-dark">Send Booking Request</h4>
                <p className="m-0 text-secondary fs-8">File Ref: <span className="font-monospace fw-bold text-primary">{tour?.fileNumber || tour?.file_no || "RT-NEW"}</span></p>
              </div>
            </div>
            <button
              type="button"
              className="border-0 bg-transparent text-slate-400 hover:text-slate-600 p-1 transition-colors d-flex align-items-center justify-content-center"
              onClick={() => onOpenChange(false)}
              data-testid="email-close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="modal-body p-4 bg-white space-y-4" style={{ maxHeight: "65vh", overflowY: "auto" }}>
            
            {/* To chip field */}
            <div>
              <label className="form-label fw-bold text-dark fs-7 mb-1">To</label>
              <div className="form-control d-flex flex-wrap align-items-center gap-1.5 px-3 py-2 border shadow-none bg-light rounded-xl">
                {toChips.map((chip, idx) => (
                  <span key={idx} className="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle d-flex align-items-center gap-1 px-2.5 py-1.5 rounded-pill fs-8">
                    {chip}
                    <X size={12} className="cursor-pointer" onClick={() => removeChip(idx)} />
                  </span>
                ))}
                <input
                  type="text"
                  className="border-0 bg-transparent flex-grow-1 shadow-none fs-7 outline-none m-0 p-0"
                  placeholder={toChips.length === 0 ? "Enter email recipient to add Tag..." : ""}
                  value={toInput}
                  onChange={(e) => setToInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{ outline: "none", minWidth: "120px" }}
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="form-label fw-bold text-dark fs-7 mb-1">Subject</label>
              <input
                type="text"
                className="form-control px-3 py-2.5 border rounded-xl shadow-none fs-7 text-dark fw-medium"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Booking request subject..."
              />
            </div>

            {/* Editor Container */}
            <div>
              <div className="d-flex align-items-center justify-content-between mb-1.5">
                <label className="form-label fw-bold text-dark fs-7 m-0">Message</label>
                
                {/* Mode toggle */}
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm fs-8 border-soft text-slate-600 px-3.5 py-1.5 rounded-lg d-flex align-items-center gap-1.5 hover-shadow"
                  onClick={() => setIsHtmlPreview(!isHtmlPreview)}
                >
                  {isHtmlPreview ? (
                    <>
                      <EyeOff size={13} />
                      <span>Edit Mode</span>
                    </>
                  ) : (
                    <>
                      <Eye size={13} />
                      <span>HTML Output</span>
                    </>
                  )}
                </button>
              </div>

              {/* Text formatting tools */}
              {!isHtmlPreview && (
                <div className="d-flex align-items-center gap-2 p-2 border-top border-start border-end rounded-t-xl bg-light">
                  <button type="button" onClick={() => runCommand("bold")} className="btn btn-sm btn-white border border-soft p-1.5 text-secondary rounded shadow-sm hover-shadow" title="Bold"><Bold size={14} /></button>
                  <button type="button" onClick={() => runCommand("italic")} className="btn btn-sm btn-white border border-soft p-1.5 text-secondary rounded shadow-sm hover-shadow" title="Italic"><Italic size={14} /></button>
                  <button type="button" onClick={() => runCommand("underline")} className="btn btn-sm btn-white border border-soft p-1.5 text-secondary rounded shadow-sm hover-shadow" title="Underline"><Underline size={14} /></button>
                  <div className="vr mx-1 my-1.5"></div>
                  <button type="button" onClick={() => runCommand("insertUnorderedList")} className="btn btn-sm btn-white border border-soft p-1.5 text-secondary rounded shadow-sm hover-shadow" title="Bullet List"><List size={14} /></button>
                  <button type="button" onClick={() => runCommand("insertOrderedList")} className="btn btn-sm btn-white border border-soft p-1.5 text-secondary rounded shadow-sm hover-shadow" title="Numbered List"><ListOrdered size={14} /></button>
                </div>
              )}

              {/* contentEditable editor */}
              <div className="position-relative">
                <div
                  ref={editorRef}
                  contentEditable={!isHtmlPreview}
                  className={`form-control px-3 py-3 border shadow-none fs-7 text-dark font-monospace ${
                    isHtmlPreview ? "bg-light text-slate-800" : "bg-white"
                  }`}
                  style={{
                    minHeight: "220px",
                    outline: "none",
                    borderRadius: isHtmlPreview ? "0.75rem" : "0 0 0.75rem 0.75rem",
                    borderTop: isHtmlPreview ? undefined : "none",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "break-word"
                  }}
                  data-testid="email-body-editor"
                ></div>
              </div>
            </div>

            {/* Attachments Section */}
            <div>
              <label className="form-label fw-bold text-dark fs-7 mb-1.5">Attachments</label>
              
              {/* Drop area */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-dashed border-2 border-slate-200 rounded-xl p-4 bg-light text-center cursor-pointer hover:bg-slate-50 transition-colors"
                style={{ borderStyle: "dashed" }}
              >
                <input
                  type="file"
                  id="mail-files"
                  className="d-none"
                  multiple
                  onChange={handleFileChange}
                />
                <label htmlFor="mail-files" className="cursor-pointer d-flex flex-column align-items-center justify-content-center m-0">
                  <Paperclip size={24} className="text-secondary mb-2" />
                  <span className="text-dark fw-semibold fs-7">Drag & drop files or click to browser</span>
                  <span className="text-secondary fs-8 mt-1">PDFs, vouchers, tickets (Max 10MB)</span>
                </label>
              </div>

              {/* Files list */}
              {attachments.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {attachments.map((file, idx) => (
                    <span key={idx} className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle d-flex align-items-center gap-1.5 px-3 py-2 rounded-xl fs-8">
                      <Paperclip size={12} />
                      <span className="fw-medium text-dark">{file.name}</span>
                      <span className="opacity-75">({file.size})</span>
                      <X size={13} className="cursor-pointer text-slate-600 rounded-full hover:bg-slate-200 p-0.5" onClick={() => removeAttachment(idx)} />
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="modal-footer px-5 py-3-5 bg-light border-top d-flex justify-content-between align-items-center">
            <button
              type="button"
              className="btn btn-link shadow-none text-secondary text-decoration-none fw-semibold fs-7 p-2 transition-click"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2.5 rounded-xl border-0 fs-7 fw-semibold shadow-sm transition-click"
              onClick={handleSend}
              data-testid="email-send-confirm"
            >
              <Send size={15} />
              <span>Send Email</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
