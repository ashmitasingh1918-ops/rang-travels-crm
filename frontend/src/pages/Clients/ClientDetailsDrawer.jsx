import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getClientById } from "../../services/clientService";
import { updateTour } from "../../services/tourService";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return dateString;
  }
};

const getInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const getTripStatusBadge = (status) => {
  if (!status) return null;
  const s = status.toUpperCase();
  switch (s) {
    case "UPCOMING":
      return <span className="badge rounded-pill bg-primary-subtle text-primary px-2 py-1 fs-8 fw-semibold">Upcoming</span>;
    case "ONGOING":
      return <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis px-2 py-1 fs-8 fw-semibold">Ongoing</span>;
    case "COMPLETED":
      return <span className="badge rounded-pill bg-success-subtle text-success px-2 py-1 fs-8 fw-semibold">Completed</span>;
    case "CANCELLED":
      return <span className="badge rounded-pill bg-danger-subtle text-danger px-2 py-1 fs-8 fw-semibold">Cancelled</span>;
    default:
      return <span className="badge rounded-pill bg-secondary-subtle text-secondary px-2 py-1 fs-8 fw-semibold">{status}</span>;
  }
};

const getPaymentStatusBadge = (status) => {
  if (!status) return null;
  const s = status.toUpperCase();
  switch (s) {
    case "PAID":
      return <span className="badge rounded-pill bg-success-subtle text-success px-2 py-1 fs-8 fw-semibold">Paid</span>;
    case "PARTIAL":
      return <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis px-2 py-1 fs-8 fw-semibold">Partial</span>;
    case "UNPAID":
      return <span className="badge rounded-pill bg-danger-subtle text-danger px-2 py-1 fs-8 fw-semibold">Unpaid</span>;
    default:
      return <span className="badge rounded-pill bg-secondary-subtle text-secondary px-2 py-1 fs-8 fw-semibold">{status}</span>;
  }
};

function ClientDetailsDrawer({ clientId, isOpen, onClose, onUpdateSuccess }) {
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Latest Tour editable fields
  const [tripStatus, setTripStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Load client details
  const fetchClientDetails = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await getClientById(clientId);
      if (response.success && response.data) {
        setClient(response.data);
      } else {
        setError("Failed to retrieve client details");
      }
    } catch (err) {
      console.error("Error fetching client details:", err);
      setError("Failed to fetch client. Please check server connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && clientId) {
      fetchClientDetails();
    } else {
      setClient(null);
    }
  }, [isOpen, clientId]);

  // Sync latest tour state when client changes
  const latestTour = client && client.tours && client.tours.length > 0 ? client.tours[0] : null;
  const previousTours = client && client.tours && client.tours.length > 1 ? client.tours.slice(1) : [];

  useEffect(() => {
    if (latestTour) {
      setTripStatus(latestTour.tripStatus || "UPCOMING");
      setPaymentStatus(latestTour.paymentStatus || "UNPAID");
      setRemarks(latestTour.remarks || "");
    } else {
      setTripStatus("");
      setPaymentStatus("");
      setRemarks("");
    }
  }, [client]);

  // Save tour updates handler
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!latestTour) return;

    setIsSaving(true);
    try {
      const response = await updateTour(latestTour.id, {
        tripStatus,
        paymentStatus,
        remarks,
      });

      if (response.success) {
        toast.success("Tour details updated successfully!");
        
        // 1. Refetch client details locally to sync UI
        await fetchClientDetails();
        
        // 2. Notify parent component to reload table data
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      } else {
        toast.error(response.message || "Failed to update tour details.");
      }
    } catch (err) {
      console.error("Error updating tour details:", err);
      toast.error("An error occurred while saving updates.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <style>{`
        .drawer-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.4);
          z-index: 1040;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease-in-out;
        }
        .drawer-backdrop.show {
          opacity: 1;
          pointer-events: auto;
        }
        .client-offcanvas {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 520px;
          max-width: 100vw;
          background-color: #ffffff;
          box-shadow: -10px 0 30px -5px rgba(15, 23, 42, 0.15);
          z-index: 1050;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }
        .client-offcanvas.show {
          transform: translateX(0);
        }
        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }
        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid #f1f5f9;
        }
        .drawer-avatar-lg {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: #dbeafe;
          color: #1d4ed8;
          font-size: 1.35rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          border: 4px solid #eff6ff;
        }
        .section-divider {
          border-bottom: 1px solid #f1f5f9;
          margin-top: 24px;
          margin-bottom: 16px;
        }
        .timeline-history {
          position: relative;
          padding-left: 20px;
          border-left: 2px solid #eff6ff;
          margin-left: 8px;
        }
        .timeline-dot {
          position: absolute;
          left: -27px;
          top: 5px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #ffffff;
          border: 2.5px solid #94a3b8;
          z-index: 2;
        }
      `}</style>

      {/* Backdrop */}
      <div className={`drawer-backdrop ${isOpen ? "show" : ""}`} onClick={onClose}></div>

      {/* Slide-over Drawer Panel */}
      <div className={`client-offcanvas ${isOpen ? "show" : ""}`}>
        {/* Header */}
        <div className="drawer-header">
          <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
            <i className="bi bi-person-badge text-primary"></i>
            <span>Client Details</span>
          </h5>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
        </div>

        {/* Content Body */}
        <div className="drawer-body">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-secondary mt-3 fs-7">Loading client information...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          ) : client ? (
            <div>
              {/* Profile Card Summary */}
              <div className="card border-0 bg-light p-3 rounded-xl text-center mb-4">
                <div className="d-flex flex-column align-items-center">
                  <div className="drawer-avatar-lg">{getInitials(client.fullName)}</div>
                  <h5 className="fw-bold mb-1 text-dark">{client.fullName}</h5>
                  <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill fs-8 fw-semibold">
                    Active Client
                  </span>
                </div>
              </div>

              {/* SECTION: Client Information */}
              <h6 className="fw-bold text-dark text-uppercase tracking-wider fs-8 text-secondary mb-3">
                Client Information
              </h6>
              <div className="card rounded-xl border border-light-subtle p-3 mb-4 bg-white">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <span className="text-secondary fs-8 d-block mb-0.5">Name</span>
                    <span className="text-dark fw-semibold fs-7">{client.fullName}</span>
                  </div>
                  <div className="col-12 col-md-6">
                    <span className="text-secondary fs-8 d-block mb-0.5">Phone</span>
                    <span className="text-dark fw-semibold fs-7">{client.phone}</span>
                  </div>
                  <div className="col-12 col-md-6">
                    <span className="text-secondary fs-8 d-block mb-0.5">Email</span>
                    <span className="text-dark fw-semibold fs-7 text-truncate d-block">
                      {client.email ? (
                        <a href={`mailto:${client.email}`} className="text-decoration-none text-dark">
                          {client.email}
                        </a>
                      ) : (
                        <span className="text-muted fw-normal">—</span>
                      )}
                    </span>
                  </div>
                  <div className="col-12 col-md-6">
                    <span className="text-secondary fs-8 d-block mb-0.5">City</span>
                    <span className="text-dark fw-semibold fs-7">
                      {client.city ? `${client.city.name}, ${client.city.state}` : "—"}
                    </span>
                  </div>
                  <div className="col-12">
                    <span className="text-secondary fs-8 d-block mb-0.5">Address</span>
                    <span className="text-dark fw-semibold fs-7">
                      {client.address || <span className="text-muted fw-normal">—</span>}
                    </span>
                  </div>
                </div>
              </div>

              <div className="section-divider"></div>

              {/* SECTION: Latest Tour */}
              <h6 className="fw-bold text-dark text-uppercase tracking-wider fs-8 text-secondary mb-3">
                Latest Tour
              </h6>

              {!latestTour ? (
                <div className="alert alert-light border border-light-subtle rounded-xl text-center p-4 mb-4">
                  <i className="bi bi-airplane-engines text-muted fs-3 mb-2 d-block"></i>
                  <span className="text-muted fs-7">No tour package registered for this client.</span>
                </div>
              ) : (
                <form onSubmit={handleSaveChanges} className="card rounded-xl border border-light-subtle p-3 mb-4 bg-white">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <span className="text-secondary fs-8 d-block mb-0.5">Destination</span>
                      <span className="text-dark fw-semibold fs-7">{latestTour.destination}</span>
                    </div>
                    <div className="col-12 col-md-6">
                      <span className="text-secondary fs-8 d-block mb-0.5">Package</span>
                      <span className="text-dark fw-semibold fs-7">{latestTour.packageName}</span>
                    </div>
                    <div className="col-12 col-md-6">
                      <span className="text-secondary fs-8 d-block mb-0.5">Travel Date</span>
                      <span className="text-dark fw-semibold fs-7">{formatDate(latestTour.travelDate)}</span>
                    </div>
                    <div className="col-12 col-md-6">
                      <span className="text-secondary fs-8 d-block mb-0.5">Number of Travelers</span>
                      <span className="text-dark fw-semibold fs-7">
                        <i className="bi bi-people me-1"></i>
                        {latestTour.numberOfTravelers ?? 1}
                      </span>
                    </div>

                    {/* Edit fields: Trip Status, Payment Status, Remarks */}
                    <div className="col-12 col-md-6">
                      <label htmlFor="tripStatusInput" className="form-label text-secondary fs-8 fw-medium mb-1">
                        Trip Status
                      </label>
                      <select
                        id="tripStatusInput"
                        className="form-select form-select-sm fs-7 py-1.5 shadow-none border"
                        value={tripStatus}
                        onChange={(e) => setTripStatus(e.target.value)}
                      >
                        <option value="UPCOMING">Upcoming</option>
                        <option value="ONGOING">Ongoing</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="paymentStatusInput" className="form-label text-secondary fs-8 fw-medium mb-1">
                        Payment Status
                      </label>
                      <select
                        id="paymentStatusInput"
                        className="form-select form-select-sm fs-7 py-1.5 shadow-none border"
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                      >
                        <option value="UNPAID">Unpaid</option>
                        <option value="PARTIAL">Partial</option>
                        <option value="PAID">Paid</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label htmlFor="remarksInput" className="form-label text-secondary fs-8 fw-medium mb-1">
                        Remarks
                      </label>
                      <textarea
                        id="remarksInput"
                        className="form-control form-control-sm fs-7 py-1.5 shadow-none border"
                        rows="3"
                        placeholder="Add remarks or trip notes..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                      ></textarea>
                    </div>

                    {/* Action Button */}
                    <div className="col-12 pt-2 border-top d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn btn-sm btn-primary rounded-lg px-4 py-2 fw-semibold fs-7 transition-click d-inline-flex align-items-center gap-2"
                        disabled={isSaving}
                      >
                        {isSaving && (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        )}
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <div className="section-divider"></div>

              {/* SECTION: Previous Tours */}
              <h6 className="fw-bold text-dark text-uppercase tracking-wider fs-8 text-secondary mb-3">
                Previous Tours
              </h6>

              {previousTours.length === 0 ? (
                <div className="alert alert-light border border-light-subtle rounded-xl text-center p-3 fs-8 text-muted mb-4">
                  No previous booking history recorded.
                </div>
              ) : (
                <div className="timeline-history pb-3">
                  {previousTours.map((tour) => (
                    <div className="position-relative mb-3 pb-1" key={tour.id}>
                      {/* Timeline marker dot */}
                      <div className="timeline-dot"></div>

                      <div className="card rounded-xl border border-light-subtle p-3 shadow-none bg-white">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="fw-bold mb-0.5 text-dark fs-7">{tour.packageName}</h6>
                            <span className="text-secondary fs-8">
                              <i className="bi bi-geo-alt me-1"></i>
                              {tour.destination}
                            </span>
                          </div>
                          <span className="fs-8 text-muted font-monospace bg-light px-1.5 py-0.5 rounded border">
                            #{tour.id}
                          </span>
                        </div>

                        <div className="row g-2 mb-2 pt-1 border-top border-light">
                          <div className="col-6">
                            <span className="text-secondary fs-8 d-block">Travel Date</span>
                            <span className="text-dark fw-medium fs-8">
                              {formatDate(tour.travelDate)}
                            </span>
                          </div>
                          <div className="col-6">
                            <span className="text-secondary fs-8 d-block">Passengers</span>
                            <span className="text-dark fw-medium fs-8">
                              {tour.numberOfTravelers ?? 1}
                            </span>
                          </div>
                        </div>

                        <div className="d-flex gap-1.5 mt-1.5">
                          {getTripStatusBadge(tour.tripStatus)}
                          {getPaymentStatusBadge(tour.paymentStatus)}
                        </div>

                        {tour.remarks && (
                          <div className="bg-light p-2 rounded fs-8 text-secondary mt-2 border-start border-3 border-secondary-subtle">
                            <span className="fw-semibold text-dark d-block mb-0.5">Remarks:</span>
                            {tour.remarks}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-5">
              <span className="text-muted fs-7">No client selected.</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ClientDetailsDrawer;
