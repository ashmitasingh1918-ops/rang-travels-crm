import React from 'react';

function HotelTable({ hotels, onEdit, onDelete }) {
  if (hotels.length === 0) {
    return (
      <div className="text-center py-5 bg-white border rounded shadow-sm">
        <i className="bi bi-building text-muted display-4"></i>
        <p className="mt-3 text-secondary mb-0">No hotels found matching selected filters.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive bg-white shadow-sm border rounded">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th className="px-4 py-3 text-uppercase text-secondary fw-semibold fs-7" style={{ width: '22%' }}>Hotel Name</th>
            <th className="px-4 py-3 text-uppercase text-secondary fw-semibold fs-7" style={{ width: '13%' }}>City</th>
            <th className="px-4 py-3 text-uppercase text-secondary fw-semibold fs-7" style={{ width: '15%' }}>Category</th>
            <th className="px-4 py-3 text-uppercase text-secondary fw-semibold fs-7" style={{ width: '15%' }}>Contact</th>
            <th className="px-4 py-3 text-uppercase text-secondary fw-semibold fs-7" style={{ width: '15%' }}>Phone</th>
            <th className="px-4 py-3 text-uppercase text-secondary fw-semibold fs-7" style={{ width: '10%' }}>Status</th>
            <th className="px-4 py-3 text-uppercase text-secondary fw-semibold fs-7 text-end" style={{ width: '10%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel.id}>
              <td className="px-4 py-3">
                <div className="fw-bold text-dark">{hotel.name}</div>
                {hotel.gstNumber && <div className="text-muted fs-8 font-monospace">GST: {hotel.gstNumber}</div>}
              </td>
              <td className="px-4 py-3 text-secondary">{hotel.city}</td>
              <td className="px-4 py-3">
                <span className={`badge ${hotel.category === 'Luxury' ? 'bg-purple-subtle text-purple border border-purple-subtle' : 'bg-primary-subtle text-primary border border-primary-subtle'}`}>
                  {hotel.category}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="text-dark fw-semibold">{hotel.contactPerson || '-'}</div>
                {hotel.email && <div className="text-muted fs-8">{hotel.email}</div>}
              </td>
              <td className="px-4 py-3 text-secondary fs-8">{hotel.phone || '-'}</td>
              <td className="px-4 py-3">
                <span className={`badge px-2.5 py-1.5 rounded-pill ${hotel.status === 'Active' ? 'bg-success bg-opacity-10 text-success border border-success-subtle' : 'bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle'}`}>
                  {hotel.status}
                </span>
              </td>
              <td className="px-4 py-3 text-end">
                <div className="d-flex justify-content-end gap-1">
                  <button
                    className="btn btn-sm btn-light border p-2 d-inline-flex justify-content-center align-items-center text-dark hover-shadow me-2"
                    onClick={() => onEdit(hotel)}
                    title="Edit Hotel"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-light border p-2 d-inline-flex justify-content-center align-items-center text-danger hover-shadow"
                    onClick={() => onDelete(hotel)}
                    title="Delete Hotel"
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

export default HotelTable;
