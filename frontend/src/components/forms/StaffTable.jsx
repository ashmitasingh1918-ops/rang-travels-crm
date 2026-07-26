import React from "react";
import { Edit, Trash2, Mail, Phone, Shield } from "lucide-react";

export default function StaffTable({ staffList, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading staff...</span>
        </div>
        <p className="text-muted mt-2 mb-0">Loading staff data...</p>
      </div>
    );
  }

  if (!staffList || staffList.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <p className="mb-0">No staff members found.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th className="px-4 py-3">Staff Member</th>
            <th className="py-3">Role</th>
            <th className="py-3">Contact</th>
            <th className="py-3">Status</th>
            <th className="px-4 py-3 text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff) => (
            <tr key={staff.id}>
              <td className="px-4 py-3">
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold me-3" 
                    style={{ width: "40px", height: "40px", fontSize: "14px" }}
                  >
                    {staff.fullName ? staff.fullName.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div>
                    <h6 className="mb-0 fw-semibold text-dark">{staff.fullName}</h6>
                    <small className="text-muted d-flex align-items-center gap-1">
                      <Mail size={12} /> {staff.email}
                    </small>
                  </div>
                </div>
              </td>
              <td className="py-3">
                <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1.5 d-inline-flex align-items-center gap-1">
                  <Shield size={12} /> {staff.role}
                </span>
              </td>
              <td className="py-3">
                <span className="text-dark d-flex align-items-center gap-1">
                  <Phone size={12} className="text-muted" /> {staff.phone || "N/A"}
                </span>
              </td>
              <td className="py-3">
                <span className={`badge px-2.5 py-1.5 ${staff.isActive ? "bg-success-subtle text-success border border-success-subtle" : "bg-danger-subtle text-danger border border-danger-subtle"}`}>
                  {staff.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3 text-end">
                <div className="d-flex justify-content-end gap-2">
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onEdit && onEdit(staff)}
                    title="Edit Staff"
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete && onDelete(staff)}
                    title="Delete Staff"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}