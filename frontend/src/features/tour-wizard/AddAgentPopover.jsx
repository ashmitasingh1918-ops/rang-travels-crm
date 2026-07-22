/**
 * AddAgentPopover.jsx
 * Popover modal to add agents quickly.
 */
import React, { useState } from "react";
import { X, Plus, Info } from "lucide-react";
import { toast } from "sonner";

export default function AddAgentPopover({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    country: "India",
    contactPerson: "",
    email: "",
    phone: ""
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Agent Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save
    const savedAgent = {
      id: `agent-${Date.now()}`,
      ...formData
    };

    onSave(savedAgent);
    toast.success(`Agent "${formData.name}" added successfully!`);
    onClose();
    setFormData({ name: "", country: "India", contactPerson: "", email: "", phone: "" });
    setErrors({});
  };

  return (
    <div className="position-absolute bg-white rounded-xl shadow-lg border p-4" style={{ zIndex: 100, right: 0, top: "45px", width: "320px", fontFamily: "'Outfit', sans-serif" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="m-0 font-display fw-bold text-dark fs-7">Add New Partner Agent</h6>
        <button
          type="button"
          className="border-0 bg-transparent text-slate-400 hover:text-slate-600 p-0 transition-colors d-flex align-items-center justify-content-center"
          onClick={onClose}
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3" data-testid="popover-agent-form">
        <div>
          <label className="form-label fw-bold text-secondary fs-8 mb-1">Agent Name <span className="text-danger">*</span></label>
          <input
            type="text"
            className={`form-control form-control-sm px-2 py-1.5 border shadow-none fs-7 ${errors.name ? "is-invalid" : ""}`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Thomas Cook London"
            data-testid="input-new-agent-name"
          />
        </div>

        <div>
          <label className="form-label fw-bold text-secondary fs-8 mb-1">Country</label>
          <input
            type="text"
            className="form-control form-control-sm px-2 py-1.5 border shadow-none fs-7"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            placeholder="e.g. United Kingdom"
          />
        </div>

        <div>
          <label className="form-label fw-bold text-secondary fs-8 mb-1">Contact Person</label>
          <input
            type="text"
            className="form-control form-control-sm px-2 py-1.5 border shadow-none fs-7"
            value={formData.contactPerson}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            placeholder="e.g. Mr. John Doe"
          />
        </div>

        <div>
          <label className="form-label fw-bold text-secondary fs-8 mb-1">Email <span className="text-danger">*</span></label>
          <input
            type="email"
            className={`form-control form-control-sm px-2 py-1.5 border shadow-none fs-7 ${errors.email ? "is-invalid" : ""}`}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="agent@company.com"
          />
        </div>

        <div>
          <label className="form-label fw-bold text-secondary fs-8 mb-1">Phone</label>
          <input
            type="text"
            className="form-control form-control-sm px-2 py-1.5 border shadow-none fs-7"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="e.g. +44 20 7946 0958"
          />
        </div>

        <div className="pt-2 d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-sm btn-light border px-3 py-1.5 rounded-lg fs-8 hover-shadow text-slate-600 transition-click"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-sm btn-primary px-3 py-1.5 rounded-lg fs-8 border-0 fw-semibold transition-click"
            id="save-new-agent"
            data-testid="save-new-agent"
          >
            Save agent
          </button>
        </div>
      </form>
    </div>
  );
}
