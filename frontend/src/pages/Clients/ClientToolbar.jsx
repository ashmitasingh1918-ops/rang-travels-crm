import React from "react";

function ClientToolbar({
  searchTerm,
  onSearchChange,
  selectedCity,
  onCityChange,
  onRefresh,
  onExportCSV,
  cities = [],
  isRefreshing = false,
  isExporting = false,
}) {
  return (
    <div className="card rounded-xl border-0 p-3 bg-white shadow-sm mb-4">
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-icon {
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }
      `}</style>

      <div className="row g-3 align-items-center justify-content-between">
        {/* Left Filters */}
        <div className="col-12 col-lg-8">
          <div className="row g-2">
            {/* Search Input */}
            <div className="col-12 col-md-7 col-lg-6">
              <div className="input-group border rounded-lg overflow-hidden bg-light shadow-none border-light-subtle">
                <span className="input-group-text bg-transparent border-0 text-muted ps-3 pe-2">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-transparent border-0 py-2 fs-7 shadow-none"
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-link bg-transparent border-0 text-muted px-2 py-0"
                    type="button"
                    onClick={() => onSearchChange("")}
                  >
                    <i className="bi bi-x-circle-fill fs-7"></i>
                  </button>
                )}
              </div>
            </div>

            {/* City Dropdown */}
            <div className="col-12 col-md-5 col-lg-4">
              <select
                className="form-select py-2 fs-7 text-dark border-light-subtle shadow-none bg-light"
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="col-12 col-lg-4 d-flex justify-content-lg-end gap-2">
          {/* Refresh Button */}
          <button
            className="btn btn-light border border-light-subtle d-inline-flex align-items-center gap-2 px-3 py-2 rounded-lg fs-7 fw-semibold text-secondary transition-click"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh database"
          >
            <i className={`bi bi-arrow-clockwise ${isRefreshing ? "spin-icon" : ""}`}></i>
            <span>Refresh</span>
          </button>

          {/* Export CSV Button */}
          <button
            className="btn btn-outline-primary border-primary-subtle d-inline-flex align-items-center gap-2 px-3 py-2 rounded-lg fs-7 fw-semibold transition-click"
            onClick={onExportCSV}
            disabled={isExporting}
            title="Export filtered clients to CSV"
          >
            {isExporting ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <i className="bi bi-download"></i>
            )}
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClientToolbar;
