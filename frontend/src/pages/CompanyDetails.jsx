import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CompanyDetails = () => {
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
          <h3 className="fw-bold mb-1">
            Company Details
          </h3>

          <p className="text-muted mb-0">
            Update your company information.
          </p>

        </div>

      </div>

      <div className="card border-0 shadow-sm rounded-4">

        <div className="card-body p-4">

          <div className="row g-4">

            <div className="col-md-6">
              <label className="form-label">
                Company Name
              </label>

              <input
                className="form-control"
                type="text"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">
                GST Number
              </label>

              <input
                className="form-control"
                type="text"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">
                Email
              </label>

              <input
                className="form-control"
                type="email"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">
                Phone
              </label>

              <input
                className="form-control"
                type="text"
              />
            </div>

            <div className="col-12">

              <label className="form-label">
                Address
              </label>

              <textarea
                rows="4"
                className="form-control"
              ></textarea>

            </div>

          </div>

          <div className="text-end mt-4">

            <button className="btn btn-primary">
              Save Company Details
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CompanyDetails;