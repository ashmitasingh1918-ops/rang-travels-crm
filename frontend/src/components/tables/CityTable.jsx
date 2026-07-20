import React from 'react';

function CityTable({ cities, onEdit, onDelete }) {
  if (cities.length === 0) {
    return (
      <div className="text-center py-5 bg-white border rounded shadow-sm">
        <i className="bi bi-geo-alt text-muted display-4"></i>
        <p className="mt-3 text-secondary mb-0">No cities found matching search terms.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive bg-white shadow-sm border rounded">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th className="px-4 py-3 text-uppercase text-secondary fw-semibold fs-7" style={{ width: '25%' }}>City</th>
            <th className="px-4 py-3 text-uppercase text-secondary fw-semibold fs-7" style={{ width: '25%' }}>State</th>
            <th className="px-4 py-3 text-uppercase text-secondary fw-semibold fs-7" style={{ width: '20%' }}>City Code</th>
            <th className="px-4 py-3 text-uppercase text-secondary fw-semibold fs-7" style={{ width: '15%' }}>Status</th>
            <th className="px-4 py-3 text-uppercase text-secondary fw-semibold fs-7 text-end" style={{ width: '15%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city.id}>
              <td className="px-4 py-3 fw-bold text-dark">{city.name}</td>
              <td className="px-4 py-3 text-secondary">{city.state}</td>
              <td className="px-4 py-3">
                <span className="badge bg-light text-dark border px-2 py-1.5 font-monospace">{city.code}</span>
              </td>
              <td className="px-4 py-3">
                <span className={`badge px-2.5 py-1.5 rounded-pill ${city.status === 'Active' ? 'bg-success bg-opacity-10 text-success border border-success-subtle' : 'bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle'}`}>
                  {city.status}
                </span>
              </td>
              <td className="px-4 py-3 text-end">
                <div className="d-flex justify-content-end gap-1">
                  <button
                    className="btn btn-sm btn-light border p-2 d-inline-flex justify-content-center align-items-center text-dark hover-shadow me-2"
                    onClick={() => onEdit(city)}
                    title="Edit City"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-light border p-2 d-inline-flex justify-content-center align-items-center text-danger hover-shadow"
                    onClick={() => onDelete(city)}
                    title="Delete City"
                  >
                    <i className="bi bi-trash"></i>
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

export default CityTable;
