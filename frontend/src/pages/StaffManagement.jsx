import { useState, useEffect } from "react";
import {
  Plus,
  Users,
  UserCheck,
  UserX,
  Clock3,
  Search,
} from "lucide-react";
import "./StaffManagement.css";
import StaffForm from "../components/forms/StaffForm";
import StaffTable from "../components/forms/StaffTable";
import { getStaff, deleteStaff } from "../services/staffService";

export default function StaffManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [deletingStaff, setDeletingStaff] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchStaff = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getStaff();
      if (result.success) {
        setStaffList(result.data || []);
      } else {
        setError(result.message || "Failed to fetch staff list");
      }
    } catch (err) {
      console.error("Error fetching staff:", err);
      setError(err.response?.data?.message || err.message || "Could not retrieve staff list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setShowForm(false);
    setEditingStaff(null);
    setDeletingStaff(null);
    fetchStaff();
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStaff) return;
    setDeleteLoading(true);
    setError("");
    try {
      const result = await deleteStaff(deletingStaff.id);
      if (result.success) {
        handleSuccess(result.message || "Staff member deleted successfully!");
      } else {
        setError(result.message || "Failed to delete staff member");
        setDeletingStaff(null);
      }
    } catch (err) {
      console.error("Error deleting staff:", err);
      setError(err.response?.data?.message || err.message || "Could not delete staff member");
      setDeletingStaff(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Stats calculation
  const totalStaff = staffList.length;
  const activeStaff = staffList.filter(s => s.isActive).length;
  const inactiveStaff = staffList.filter(s => !s.isActive).length;

  const staffStats = [
    { title: "Total Staff", value: totalStaff, icon: <Users size={22} /> },
    { title: "Active Staff", value: activeStaff, icon: <UserCheck size={22} /> },
    { title: "Average Response", value: "0 min", icon: <Clock3 size={22} /> },
    { title: "Inactive Staff", value: inactiveStaff, icon: <UserX size={22} /> },
  ];

  // Filtering
  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = 
      staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.phone && staff.phone.includes(searchTerm));

    const matchesRole = roleFilter === "ALL" || staff.role === roleFilter;

    const matchesStatus = 
      statusFilter === "ALL" || 
      (statusFilter === "ACTIVE" && staff.isActive) ||
      (statusFilter === "INACTIVE" && !staff.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Staff Management</h2>
          <p className="text-muted mb-0">
            Manage your agency's team, assign roles and track activity.
          </p>
        </div>

        <button
          className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 shadow-sm rounded-3"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          Add Staff
        </button>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show border-0 shadow-sm mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {successMessage}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setSuccessMessage("")} 
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show border-0 shadow-sm mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError("")} 
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Modal Overlay for Creating Staff */}
      {showForm && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div 
            className="modal fade show d-block" 
            tabIndex="-1" 
            role="dialog"
            style={{ zIndex: 1055, overflowY: "auto" }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content shadow-lg border-0" style={{ borderRadius: "16px" }}>
                <StaffForm 
                  onClose={() => setShowForm(false)} 
                  onSuccess={handleSuccess} 
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal Overlay for Editing Staff */}
      {editingStaff && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div 
            className="modal fade show d-block" 
            tabIndex="-1" 
            role="dialog"
            style={{ zIndex: 1055, overflowY: "auto" }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content shadow-lg border-0" style={{ borderRadius: "16px" }}>
                <StaffForm 
                  staff={editingStaff}
                  onClose={() => setEditingStaff(null)} 
                  onSuccess={handleSuccess} 
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal Overlay for Delete Confirmation */}
      {deletingStaff && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div 
            className="modal fade show d-block" 
            tabIndex="-1" 
            role="dialog"
            style={{ zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content shadow border-0" style={{ borderRadius: "16px" }}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold text-danger">Delete Staff</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setDeletingStaff(null)}
                    disabled={deleteLoading}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body text-start py-4">
                  <p className="mb-2">
                    Are you sure you want to delete <strong>{deletingStaff.fullName}</strong>?
                  </p>
                  <p className="text-muted mb-0 small">This action cannot be undone.</p>
                </div>
                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setDeletingStaff(null)}
                    disabled={deleteLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger d-flex align-items-center gap-2"
                    onClick={handleDeleteConfirm}
                    disabled={deleteLoading}
                  >
                    {deleteLoading && (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Stats */}
      <div className="row g-4 mb-4">
        {staffStats.map((item, index) => (
          <div className="col-lg-3 col-md-6" key={index}>
            <div className="card shadow-sm border-0 h-100 stats-card">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 stats-title">{item.title}</p>
                  <h3 className="fw-bold mb-0 stats-value">{item.value}</h3>
                </div>

                <div className="stats-icon">
                  {item.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Table */}
      <div className="card shadow-sm border-0 mb-4 staff-table-card">
        <div className="card-body">
          <div className="d-flex flex-wrap gap-3 justify-content-between mb-4">
            <div className="input-group search-width search-box">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <Search size={18} />
              </span>
              <input
                className="form-control border-start-0 ps-0"
                placeholder="Search Staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="d-flex gap-2">
              <select 
                className="form-select text-muted" 
                value={roleFilter} 
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{ width: "auto", minWidth: "130px" }}
              >
                <option value="ALL">All Roles</option>
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>

              <select 
                className="form-select text-muted" 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ width: "auto", minWidth: "130px" }}
              >
                <option value="ALL">Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <StaffTable 
            staffList={filteredStaff} 
            loading={loading}
            onEdit={setEditingStaff}
            onDelete={setDeletingStaff}
          />
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100 activity-card">
            <div className="card-body">
              <h4 className="fw-semibold text-dark mb-3">Recent Activity</h4>
              <div className="text-center py-5 text-muted bg-light rounded-3">
                No recent activity available.
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100 training-card">
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h4 className="fw-semibold mb-3">Staff Training</h4>
                <p className="flex-grow-1 text-white-50">
                  Track your team's learning progress and review completion status.
                </p>
              </div>

              <button className="btn btn-light text-primary fw-semibold px-4 py-2 rounded-3 mt-3 w-100">
                Review Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}