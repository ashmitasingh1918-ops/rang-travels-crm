import {
  Plus,
  Users,
  UserCheck,
  UserX,
  Clock3,
  Search,
  ChevronDown,
} from "lucide-react";
import "./StaffManagement.css";

const staffStats = [
  { title: "Total Staff", value: 0, icon: <Users size={22} /> },
  { title: "Active Staff", value: 0, icon: <UserCheck size={22} /> },
  { title: "Average Response", value: "0 min", icon: <Clock3 size={22} /> },
  { title: "Inactive Staff", value: 0, icon: <UserX size={22} /> },
];

export default function StaffManagement() {
  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Staff Management</h2>
          <p className="text-muted mb-0">
            Manage your agency's team, assign roles and track activity.
          </p>
        </div>

        <button className="btn btn-primary d-flex align-items-center gap-2">
          <Plus size={18} />
          <span>New Staff</span>
        </button>
      </div>

      <div className="row g-4 mb-4">
        {staffStats.map((item, index) => (
          <div className="col-lg-3 col-md-6" key={index}>
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">{item.title}</p>
                  <h3 className="fw-bold mb-0">{item.value}</h3>
                </div>

                <div className="staff-stat-icon">
                  {item.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="d-flex flex-wrap gap-3 justify-content-between mb-3">
            <div className="input-group search-width">
              <span className="input-group-text bg-white">
                <Search size={18}/>
              </span>
              <input className="form-control" placeholder="Search Staff..." />
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
                All Roles <ChevronDown size={16}/>
              </button>

              <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
                Status <ChevronDown size={16}/>
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Staff Member</th>
                  <th>Role</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No staff found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-outline-secondary" disabled>Previous</button>
            <span className="text-muted">Page 1 of 1</span>
            <button className="btn btn-outline-secondary" disabled>Next</button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h4 className="fw-semibold mb-3">Recent Activity</h4>
              <div className="empty-box">
                No recent activity available.
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body d-flex flex-column">
              <h4 className="fw-semibold">Staff Training</h4>
              <p className="text-muted flex-grow-1">
                Track your team's learning progress and review completion status.
              </p>

              <button className="btn btn-primary">
                Review Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
