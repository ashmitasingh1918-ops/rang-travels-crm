import React, { useState } from 'react';
import SearchBar from '../components/ui/SearchBar';
import HotelTable from '../components/tables/HotelTable';
import HotelForm from '../components/forms/HotelForm';
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal';

function Hotels() {
  const citiesList = [
    { id: 1, name: 'Jaipur', code: 'JAI' },
    { id: 2, name: 'Udaipur', code: 'UDR' },
    { id: 3, name: 'Jodhpur', code: 'JDH' },
    { id: 4, name: 'Goa', code: 'GOI' },
    { id: 5, name: 'Manali', code: 'MNL' },
    { id: 6, name: 'Shimla', code: 'SHM' }
  ];

  // Pre-seed mock data as starting state
  const [hotels, setHotels] = useState([
    {
      id: 1,
      name: 'Taj Rambagh Palace',
      city: 'Jaipur',
      category: 'Luxury',
      rating: '4.9',
      address: 'Bhawani Singh Rd, Rambagh, Jaipur, Rajasthan 302005',
      contactPerson: 'Vikram Singh',
      phone: '+91 141 221 1919',
      email: 'reservations@tajrambagh.com',
      gstNumber: '08AAAAA1111A1Z1',
      status: 'Active'
    },
    {
      id: 2,
      name: 'ITC Rajputana',
      city: 'Jaipur',
      category: '5 Star',
      rating: '4.6',
      address: 'Palace Road, Gopalbari, Jaipur, Rajasthan 302006',
      contactPerson: 'Sneha Rao',
      phone: '+91 141 510 0100',
      email: 'sales@itcrajputana.com',
      gstNumber: '08BBBBB2222B2Z2',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Taj Lake Palace',
      city: 'Udaipur',
      category: 'Luxury',
      rating: '5.0',
      address: 'Lake Pichola, Udaipur, Rajasthan 313001',
      contactPerson: 'Manoj Iyer',
      phone: '+91 294 242 8800',
      email: 'res.lakepalace@tajhotels.com',
      gstNumber: '08CCCCC3333C3Z3',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Umaid Bhawan Palace',
      city: 'Jodhpur',
      category: 'Luxury',
      rating: '4.9',
      address: 'Circuit House Rd, Cantt Area, Jodhpur, Rajasthan 342006',
      contactPerson: 'Divya Rathore',
      phone: '+91 291 251 0101',
      email: 'res.umaid@tajhotels.com',
      gstNumber: '08DDDDD4444D4Z4',
      status: 'Active'
    }
  ]);

  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [viewMode, setViewMode] = useState('Cards'); // 'Cards' or 'Table'
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [hotelToEdit, setHotelToEdit] = useState(null);
  const [hotelToDelete, setHotelToDelete] = useState(null);

  // Filter processing
  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch = hotel.name.toLowerCase().includes(search.toLowerCase()) || 
      (hotel.contactPerson && hotel.contactPerson.toLowerCase().includes(search.toLowerCase())) ||
      (hotel.gstNumber && hotel.gstNumber.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCity = selectedCity === '' || hotel.city === selectedCity;
    
    return matchesSearch && matchesCity;
  });

  const handleSaveHotel = (hotelData) => {
    if (hotelToEdit) {
      // update
      setHotels(hotels.map(h => h.id === hotelToEdit.id ? { ...h, ...hotelData } : h));
    } else {
      // create
      setHotels([...hotels, hotelData]);
    }
  };

  const handleEditClick = (hotel) => {
    setHotelToEdit(hotel);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (hotel) => {
    setHotelToDelete(hotel);
  };

  const confirmDelete = () => {
    if (hotelToDelete) {
      setHotels(hotels.filter(h => h.id !== hotelToDelete.id));
      setHotelToDelete(null);
    }
  };

  return (
    <div className="container-fluid p-0">
      {/* Upper header segment and button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1 text-dark fw-bold">Hotels</h1>
          <p className="text-secondary mb-0 fs-7">Partner hotel database.</p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 shadow-sm rounded-lg"
          onClick={() => {
            setHotelToEdit(null);
            setIsFormOpen(true);
          }}
        >
          <i className="bi bi-plus-lg"></i>
          <span className="fw-semibold">Add Hotel</span>
        </button>
      </div>

      {/* Toolbar filters panel */}
      <div className="card border-0 shadow-sm p-3 mb-4 bg-white rounded-xl">
        <div className="row g-3 align-items-center justify-content-between">
          <div className="col-md-8 col-lg-6 d-flex gap-3">
            <div className="flex-grow-1">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search hotels..."
              />
            </div>
            
            <div className="flex-shrink-0" style={{ width: '160px' }}>
              <select
                className="form-select border shadow-sm py-2 px-3"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{ boxShadow: 'none' }}
              >
                <option value="">All cities</option>
                {citiesList.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-auto">
            <div className="btn-group shadow-sm border rounded overflow-hidden" role="group">
              <button
                type="button"
                className={`btn btn-white d-flex align-items-center gap-2 border-0 px-3 py-2 ${viewMode === 'Cards' ? 'bg-primary text-white' : 'text-dark'}`}
                onClick={() => setViewMode('Cards')}
              >
                <i className="bi bi-grid-fill"></i>
                <span className="fs-7 fw-semibold">Cards</span>
              </button>
              <button
                type="button"
                className={`btn btn-white d-flex align-items-center gap-2 border-0 px-3 py-2 ${viewMode === 'Table' ? 'bg-primary text-white' : 'text-dark'}`}
                onClick={() => setViewMode('Table')}
              >
                <i className="bi bi-list-task"></i>
                <span className="fs-7 fw-semibold">Table</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Database Container */}
      {viewMode === 'Cards' ? (
        filteredHotels.length === 0 ? (
          <div className="text-center py-5 bg-white border rounded shadow-sm">
            <i className="bi bi-building text-muted display-4"></i>
            <p className="mt-3 text-secondary mb-0">No hotels found matching selected filters.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredHotels.map((hotel) => (
              <div className="col-12 col-md-6" key={hotel.id}>
                <div className="card h-100 border border-light-subtle shadow-sm hover-shadow transition rounded-xl p-4 bg-white">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="card-title fw-bold mb-1 text-dark">{hotel.name}</h5>
                      <span className="text-secondary fs-8 d-flex align-items-center gap-1.5">
                        <i className="bi bi-geo-alt-fill text-muted"></i> {hotel.city}
                      </span>
                    </div>
                    <span className="badge bg-warning bg-opacity-10 text-warning-emphasis border border-warning-subtle px-2.5 py-1.5 rounded d-flex align-items-center gap-1 fw-bold fs-8">
                      <i className="bi bi-star-fill text-warning"></i> {hotel.rating || '5.0'}
                    </span>
                  </div>

                  <div className="border-top border-bottom py-3 my-3">
                    <div className="row g-2 fs-8 mb-2">
                      <div className="col-5 text-secondary fw-semibold">Category:</div>
                      <div className="col-7 text-dark fw-bold">
                        {hotel.category === 'Luxury' ? 'Luxury 5★' : hotel.category}
                      </div>
                    </div>
                    <div className="row g-2 fs-8 mb-2">
                      <div className="col-5 text-secondary fw-semibold">Contact Person:</div>
                      <div className="col-7 text-dark fw-semibold">{hotel.contactPerson || '-'}</div>
                    </div>
                    <div className="row g-2 fs-8 mb-2">
                      <div className="col-5 text-secondary fw-semibold">Email:</div>
                      <div className="col-7 text-secondary text-truncate" title={hotel.email}>{hotel.email || '-'}</div>
                    </div>
                    <div className="row g-2 fs-8">
                      <div className="col-5 text-secondary fw-semibold">Phone:</div>
                      <div className="col-7 text-secondary">{hotel.phone || '-'}</div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-2">
                    <button
                      className="btn btn-sm btn-light border px-3 py-1.5 text-dark hover-shadow"
                      onClick={() => handleEditClick(hotel)}
                    >
                      <i className="bi bi-pencil me-1.5"></i> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-light border px-3 py-1.5 text-danger hover-shadow"
                      onClick={() => handleDeleteClick(hotel)}
                    >
                      <i className="bi bi-trash me-1.5"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <HotelTable
          hotels={filteredHotels}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Save Hotel Dialog */}
      <HotelForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveHotel}
        hotelToEdit={hotelToEdit}
        cities={citiesList}
      />

      {/* Delete Confirmation Alert Modal */}
      <ConfirmDeleteModal
        isOpen={!!hotelToDelete}
        onClose={() => setHotelToDelete(null)}
        onConfirm={confirmDelete}
        itemName={hotelToDelete ? hotelToDelete.name : ''}
      />
    </div>
  );
}

export default Hotels;
