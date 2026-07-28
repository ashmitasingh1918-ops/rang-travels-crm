import React from "react";

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

const getTripStatusBadge = (status) => {
  if (!status) return <span className="text-muted">—</span>;
  const s = status.toUpperCase();
  switch (s) {
    case "UPCOMING":
      return (
        <span className="badge rounded-pill bg-primary-subtle text-primary px-2.5 py-1.5 fs-8 fw-semibold d-inline-flex align-items-center gap-1">
          <i className="bi bi-calendar2-event"></i>
          <span>Upcoming</span>
        </span>
      );
    case "ONGOING":
      return (
        <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis px-2.5 py-1.5 fs-8 fw-semibold d-inline-flex align-items-center gap-1">
          <i className="bi bi-airplane"></i>
          <span>Ongoing</span>
        </span>
      );
    case "COMPLETED":
      return (
        <span className="badge rounded-pill bg-success-subtle text-success px-2.5 py-1.5 fs-8 fw-semibold d-inline-flex align-items-center gap-1">
          <i className="bi bi-check2-circle"></i>
          <span>Completed</span>
        </span>
      );
    case "CANCELLED":
      return (
        <span className="badge rounded-pill bg-danger-subtle text-danger px-2.5 py-1.5 fs-8 fw-semibold d-inline-flex align-items-center gap-1">
          <i className="bi bi-x-octagon"></i>
          <span>Cancelled</span>
        </span>
      );
    default:
      return (
        <span className="badge rounded-pill bg-secondary-subtle text-secondary px-2.5 py-1.5 fs-8 fw-semibold">
          {status}
        </span>
      );
  }
};

const getPaymentStatusBadge = (status) => {
  if (!status) return <span className="text-muted">—</span>;
  const s = status.toUpperCase();
  switch (s) {
    case "PAID":
      return (
        <span className="badge rounded-pill bg-success-subtle text-success px-2.5 py-1.5 fs-8 fw-semibold d-inline-flex align-items-center gap-1">
          <i className="bi bi-shield-check"></i>
          <span>Paid</span>
        </span>
      );
    case "PARTIAL":
      return (
        <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis px-2.5 py-1.5 fs-8 fw-semibold d-inline-flex align-items-center gap-1">
          <i className="bi bi-hourglass-split"></i>
          <span>Partial</span>
        </span>
      );
    case "UNPAID":
      return (
        <span className="badge rounded-pill bg-danger-subtle text-danger px-2.5 py-1.5 fs-8 fw-semibold d-inline-flex align-items-center gap-1">
          <i className="bi bi-exclamation-circle"></i>
          <span>Unpaid</span>
        </span>
      );
    default:
      return (
        <span className="badge rounded-pill bg-secondary-subtle text-secondary px-2.5 py-1.5 fs-8 fw-semibold">
          {status}
        </span>
      );
  }
};

// Helper to get initials
const getInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

function ClientTable({ clients = [], isLoading, onOpenDetails, isFiltered }) {
  if (isLoading) {
    return (
      <div className="card rounded-xl border-0 bg-white shadow-sm overflow-hidden mb-4">
        <div className="table-responsive" style={{ maxHeight: "500px" }}>
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ width: "220px" }}>Client Name</th>
                <th scope="col">Phone</th>
                <th scope="col">Email</th>
                <th scope="col">Latest Destination</th>
                <th scope="col">Latest Package</th>
                <th scope="col">Travel Date</th>
                <th scope="col">Trip Status</th>
                <th scope="col">Payment Status</th>
                <th scope="col" className="text-end" style={{ width: "130px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="placeholder-glow">
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span className="placeholder rounded-circle bg-secondary opacity-25" style={{ width: "32px", height: "32px" }}></span>
                      <span className="placeholder col-8 bg-secondary opacity-25" style={{ height: "18px" }}></span>
                    </div>
                  </td>
                  {Array.from({ length: 7 }).map((_, cIdx) => (
                    <tr-td key={cIdx} style={{ display: "table-cell" }}>
                      <span className="placeholder col-9 bg-secondary opacity-25" style={{ height: "18px", display: "inline-block" }}></span>
                    </tr-td>
                  ))}
                  <td className="text-end">
                    <span className="placeholder rounded bg-primary opacity-25" style={{ width: "85px", height: "30px", display: "inline-block" }}></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Handle Empty State
  if (clients.length === 0) {
    return (
      <div className="card rounded-xl border-0 bg-white shadow-sm p-5 text-center mb-4">
        {isFiltered ? (
          <div>
            <div className="mb-3 text-secondary opacity-50" style={{ fontSize: "3.5rem" }}>
              <i className="bi bi-search-heart"></i>
            </div>
            <h5 className="fw-bold text-dark mb-2">No Matching Clients Found</h5>
            <p className="text-secondary fs-7 mx-auto" style={{ maxWidth: "420px" }}>
              We couldn't find any clients matching your search criteria or city filter. Try clearing filters or revising your query.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-3 text-secondary opacity-50" style={{ fontSize: "3.5rem" }}>
              <i className="bi bi-people-fill"></i>
            </div>
            <h5 className="fw-bold text-dark mb-2">No Clients Registered</h5>
            <p className="text-secondary fs-7 mx-auto" style={{ maxWidth: "420px" }}>
              There are no clients in the database yet. You can create bookings or tours to populate the clients dashboard automatically.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card rounded-xl border-0 bg-white shadow-sm overflow-hidden mb-4">
      <style>{`
        .sticky-header th {
          position: sticky;
          top: 0;
          background-color: #f8fafc !important;
          z-index: 5;
          box-shadow: inset 0 -1px 0 rgba(0,0,0,0.075);
          font-weight: 600;
          color: #475569;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #e2e8f0;
          padding-top: 14px;
          padding-bottom: 14px;
        }
        .client-table-row {
          transition: background-color 0.15s ease;
        }
        .client-table-row:hover {
          background-color: #f8fafc !important;
        }
        .avatar-circle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #e0f2fe;
          color: #0369a1;
          font-weight: 700;
          font-size: 0.8rem;
          border-radius: 50%;
          flex-shrink: 0;
        }
      `}</style>

      <div className="table-responsive" style={{ maxHeight: "580px" }}>
        <table className="table table-hover align-middle mb-0">
          <thead className="sticky-header">
            <tr>
              <th scope="col" style={{ minWidth: "220px" }}>Client Name</th>
              <th scope="col" style={{ minWidth: "130px" }}>Phone</th>
              <th scope="col" style={{ minWidth: "180px" }}>Email</th>
              <th scope="col" style={{ minWidth: "160px" }}>Latest Destination</th>
              <th scope="col" style={{ minWidth: "160px" }}>Latest Package</th>
              <th scope="col" style={{ minWidth: "130px" }}>Travel Date</th>
              <th scope="col" style={{ minWidth: "120px" }}>Trip Status</th>
              <th scope="col" style={{ minWidth: "120px" }}>Payment Status</th>
              <th scope="col" className="text-end" style={{ minWidth: "120px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const latestTour = client.tours && client.tours.length > 0 ? client.tours[0] : null;

              return (
                <tr key={client.id} className="client-table-row">
                  <td>
                    <div className="d-flex align-items-center gap-2.5">
                      <div className="avatar-circle" style={{ width: "32px", height: "32px" }}>
                        {getInitials(client.fullName)}
                      </div>
                      <div>
                        <span className="fw-semibold text-dark fs-7 d-block">{client.fullName}</span>
                        {client.city && (
                          <span className="text-muted fs-8 d-block">
                            <i className="bi bi-geo-alt me-1"></i>
                            {client.city.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="fs-7 text-secondary">{client.phone}</td>
                  <td className="fs-7 text-secondary">
                    {client.email ? (
                      <a href={`mailto:${client.email}`} className="text-decoration-none text-slate-600">
                        {client.email}
                      </a>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="fs-7 text-dark fw-medium truncate">{latestTour?.destination || "—"}</td>
                  <td className="fs-7 text-secondary truncate">{latestTour?.packageName || "—"}</td>
                  <td className="fs-7 text-secondary">{formatDate(latestTour?.travelDate)}</td>
                  <td>{getTripStatusBadge(latestTour?.tripStatus)}</td>
                  <td>{getPaymentStatusBadge(latestTour?.paymentStatus)}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary rounded-lg px-3 py-1.5 fw-semibold fs-8 transition-click"
                      onClick={() => onOpenDetails(client.id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientTable;
