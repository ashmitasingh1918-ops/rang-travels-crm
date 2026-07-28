import React from "react";

function ClientStats({ stats, isLoading }) {
  const statItems = [
    {
      title: "Total Clients",
      value: stats?.totalClients ?? 0,
      icon: "bi-people",
      colorClass: "text-primary bg-primary-subtle",
      borderColor: "border-primary-subtle",
    },
    {
      title: "Upcoming Trips",
      value: stats?.upcomingTrips ?? 0,
      icon: "bi-calendar2-event",
      colorClass: "text-info bg-info-subtle",
      borderColor: "border-info-subtle",
    },
    {
      title: "Ongoing Trips",
      value: stats?.ongoingTrips ?? 0,
      icon: "bi-airplane",
      colorClass: "text-warning bg-warning-subtle",
      borderColor: "border-warning-subtle",
    },
    {
      title: "Completed Trips",
      value: stats?.completedTrips ?? 0,
      icon: "bi-check2-circle",
      colorClass: "text-success bg-success-subtle",
      borderColor: "border-success-subtle",
    },
    {
      title: "Cancelled Trips",
      value: stats?.cancelledTrips ?? 0,
      icon: "bi-x-octagon",
      colorClass: "text-danger bg-danger-subtle",
      borderColor: "border-danger-subtle",
    },
  ];

  if (isLoading) {
    return (
      <div className="row g-3 mb-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div className="col-12 col-md-6 col-lg" key={idx}>
            <div className="card border-0 shadow-sm rounded-xl p-3 bg-white placeholder-glow h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="placeholder col-6 bg-secondary opacity-25" style={{ height: "14px" }}></span>
                <span className="placeholder rounded-circle" style={{ width: "36px", height: "36px" }}></span>
              </div>
              <h3 className="placeholder col-4 bg-secondary opacity-50 my-1" style={{ height: "28px" }}></h3>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="row g-3 mb-4">
      {statItems.map((item, idx) => (
        <div className="col-12 col-md-6 col-lg" key={idx}>
          <div className={`card border-0 shadow-sm rounded-xl p-3 bg-white hover-shadow h-100 border-start border-4 ${item.borderColor}`}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary fs-7 fw-medium d-block text-uppercase tracking-wider">
                  {item.title}
                </span>
                <h3 className="mb-0 fw-bold mt-1 text-dark">
                  {item.value}
                </h3>
              </div>
              <div
                className={`d-flex align-items-center justify-content-center rounded-circle ${item.colorClass}`}
                style={{ width: "42px", height: "42px", fontSize: "1.2rem" }}
              >
                <i className={`bi ${item.icon}`}></i>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ClientStats;
