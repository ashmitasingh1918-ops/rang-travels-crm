import React from "react";
import { ArrowLeft, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid py-4">

      <div className="d-flex align-items-center mb-4">
        <button
          className="btn btn-light me-3"
          onClick={() => navigate("/settings")}
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h3 className="fw-bold mb-1">My Profile</h3>
          <p className="text-muted mb-0">
            View and update your personal information.
          </p>
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4">

        <div className="card-body p-4">

          <div className="row g-4">

            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter Full Name"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                placeholder="Enter Email"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <input
                className="form-control"
                type="text"
                placeholder="Phone Number"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Role</label>
              <input
                className="form-control"
                type="text"
                value="Admin"
                readOnly
              />
            </div>

          </div>

          <div className="mt-4 d-flex justify-content-end">

            <button className="btn btn-primary">
              Save Changes
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;