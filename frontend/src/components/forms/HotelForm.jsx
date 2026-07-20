import React, { useState, useEffect } from 'react';

function HotelForm({ isOpen, onClose, onSave, hotelToEdit, cities = [] }) {
  const [hotelName, setHotelName] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('3 Star');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [status, setStatus] = useState('Active');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (hotelToEdit) {
      setHotelName(hotelToEdit.name || '');
      setCity(hotelToEdit.city || '');
      setCategory(hotelToEdit.category || '3 Star');
      setAddress(hotelToEdit.address || '');
      setContactPerson(hotelToEdit.contactPerson || '');
      setPhone(hotelToEdit.phone || '');
      setEmail(hotelToEdit.email || '');
      setGstNumber(hotelToEdit.gstNumber || '');
      setStatus(hotelToEdit.status || 'Active');
    } else {
      setHotelName('');
      setCity(cities.length > 0 ? cities[0].name : '');
      setCategory('3 Star');
      setAddress('');
      setContactPerson('');
      setPhone('');
      setEmail('');
      setGstNumber('');
      setStatus('Active');
    }
    setErrors({});
  }, [hotelToEdit, isOpen, cities]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!hotelName.trim()) newErrors.hotelName = 'Hotel Name is required';
    if (!city) newErrors.city = 'City is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: hotelToEdit ? hotelToEdit.id : Date.now(),
      name: hotelName.trim(),
      city,
      category,
      address: address.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      gstNumber: gstNumber.trim().toUpperCase(),
      status,
      rating: hotelToEdit ? hotelToEdit.rating : (category === 'Luxury' ? '5.0' : category === '5 Star' ? '4.8' : category === '4 Star' ? '4.2' : '3.8')
    });
    onClose();
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-xl">
          <div className="modal-header border-0 bg-primary text-white rounded-top-xl py-3">
            <h5 className="modal-title fw-bold fs-6">
              <i className="bi bi-building me-2"></i>
              {hotelToEdit ? 'Edit Hotel' : 'Add New Hotel'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body py-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark fs-7">Hotel Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${errors.hotelName ? 'is-invalid' : ''}`}
                    placeholder="e.g. Taj Rambagh Palace"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                  />
                  {errors.hotelName && <div className="invalid-feedback">{errors.hotelName}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark fs-7">City <span className="text-danger">*</span></label>
                  <select
                    className={`form-select ${errors.city ? 'is-invalid' : ''}`}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="">Select a city...</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.name}>{c.name} ({c.code})</option>
                    ))}
                  </select>
                  {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark fs-7">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="3 Star">3 Star</option>
                    <option value="4 Star">4 Star</option>
                    <option value="5 Star">5 Star</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark fs-7">GST Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 08AAAAA1111A1Z1"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold text-dark fs-7">Address</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Physical address of the hotel"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></textarea>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-bold text-dark fs-7">Contact Person</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Vikram Singh"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-bold text-dark fs-7">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. +91 141 221 1919"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-bold text-dark fs-7">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="e.g. user@hotel.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold d-block text-dark fs-7">Status</label>
                  <div className="form-check form-check-inline me-4">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="hotelStatus"
                      id="hotelActive"
                      value="Active"
                      checked={status === 'Active'}
                      onChange={() => setStatus('Active')}
                    />
                    <label className="form-check-label text-dark fs-7" htmlFor="hotelActive">Active</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="hotelStatus"
                      id="hotelInactive"
                      value="Inactive"
                      checked={status === 'Inactive'}
                      onChange={() => setStatus('Inactive')}
                    />
                    <label className="form-check-label text-dark fs-7" htmlFor="hotelInactive">Inactive</label>
                  </div>
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

export default HotelForm;
