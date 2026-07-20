import React, { useState, useEffect } from 'react';

function CityForm({ isOpen, onClose, onSave, cityToEdit }) {
  const [cityName, setCityName] = useState('');
  const [state, setState] = useState('');
  const [cityCode, setCityCode] = useState('');
  const [status, setStatus] = useState('Active');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (cityToEdit) {
      setCityName(cityToEdit.name || '');
      setState(cityToEdit.state || '');
      setCityCode(cityToEdit.code || '');
      setStatus(cityToEdit.status || 'Active');
    } else {
      setCityName('');
      setState('');
      setCityCode('');
      setStatus('Active');
    }
    setErrors({});
  }, [cityToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!cityName.trim()) newErrors.cityName = 'City Name is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!cityCode.trim()) newErrors.cityCode = 'City Code is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: cityToEdit ? cityToEdit.id : Date.now(),
      name: cityName.trim(),
      state: state.trim(),
      code: cityCode.trim().toUpperCase(),
      status
    });
    onClose();
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-xl">
          <div className="modal-header border-0 bg-primary text-white rounded-top-xl py-3">
            <h5 className="modal-title fw-bold fs-6">
              <i className="bi bi-geo-alt me-2"></i>
              {cityToEdit ? 'Edit City' : 'Add New City'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body py-4">
              <div className="mb-3">
                <label className="form-label fw-bold text-dark fs-7">City Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className={`form-control ${errors.cityName ? 'is-invalid' : ''}`}
                  placeholder="e.g. Jaipur"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                />
                {errors.cityName && <div className="invalid-feedback">{errors.cityName}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold text-dark fs-7">State <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                  placeholder="e.g. Rajasthan"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
                {errors.state && <div className="invalid-feedback">{errors.state}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold text-dark fs-7">City Code <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className={`form-control ${errors.cityCode ? 'is-invalid' : ''}`}
                  placeholder="e.g. JAI"
                  value={cityCode}
                  onChange={(e) => setCityCode(e.target.value)}
                />
                {errors.cityCode && <div className="invalid-feedback">{errors.cityCode}</div>}
              </div>
              <div className="mb-2">
                <label className="form-label fw-bold d-block text-dark fs-7">Status</label>
                <div className="form-check form-check-inline me-4">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="status"
                    id="statusActive"
                    value="Active"
                    checked={status === 'Active'}
                    onChange={() => setStatus('Active')}
                  />
                  <label className="form-check-label text-dark fs-7" htmlFor="statusActive">Active</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="status"
                    id="statusInactive"
                    value="Inactive"
                    checked={status === 'Inactive'}
                    onChange={() => setStatus('Inactive')}
                  />
                  <label className="form-check-label text-dark fs-7" htmlFor="statusInactive">Inactive</label>
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 bg-light rounded-bottom-xl">
              <button type="button" className="btn btn-secondary px-4 py-2 text-dark border-0 bg-white" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary px-4 py-2">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CityForm;
