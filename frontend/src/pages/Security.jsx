import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Security = () => {
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
          <h3 className="fw-bold mb-1">Security</h3>
          <p className="text-muted mb-0">
            Change your account password.
          </p>
        </div>

      </div>

      <div className="card border-0 shadow-sm rounded-4">

        <div className="card-body p-4">

          <div className="row g-4">

            <div className="col-12">

              <label className="form-label">
                Current Password
              </label>

              <input
                type="password"
                className="form-control"
              />

            </div>

            <div className="col-md-6">

              <label className="form-label">
                New Password
              </label>

              <input
                type="password"
                className="form-control"
              />

            </div>

            <div className="col-md-6">

              <label className="form-label">
                Confirm Password
              </label>

              <input
                type="password"
                className="form-control"
              />

            </div>

          </div>

          <div className="text-end mt-4">

            <button className="btn btn-primary">
              Update Password
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Security;