import React, { useState } from 'react';
import SearchBar from '../components/ui/SearchBar';
import CityTable from '../components/tables/CityTable';
import CityForm from '../components/forms/CityForm';
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal';

function Cities() {
  // Pre-seed mock data as starting state
  const [cities, setCities] = useState([
    { id: 1, name: 'Jaipur', state: 'Rajasthan', code: 'JAI', status: 'Active' },
    { id: 2, name: 'Udaipur', state: 'Rajasthan', code: 'UDR', status: 'Active' },
    { id: 3, name: 'Jodhpur', state: 'Rajasthan', code: 'JDH', status: 'Active' },
    { id: 4, name: 'Goa', state: 'Goa', code: 'GOI', status: 'Active' },
    { id: 5, name: 'Manali', state: 'Himachal', code: 'MNL', status: 'Active' },
    { id: 6, name: 'Shimla', state: 'Himachal', code: 'SHM', status: 'Active' }
  ]);

  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [cityToEdit, setCityToEdit] = useState(null);
  const [cityToDelete, setCityToDelete] = useState(null);

  // Search logic
  const filteredCities = cities.filter((city) => {
    const term = search.toLowerCase();
    return (
      city.name.toLowerCase().includes(term) ||
      city.state.toLowerCase().includes(term) ||
      city.code.toLowerCase().includes(term)
    );
  });

  const handleSaveCity = (cityData) => {
    if (cityToEdit) {
      // update
      setCities(cities.map(c => c.id === cityToEdit.id ? { ...c, ...cityData } : c));
    } else {
      // create
      setCities([...cities, cityData]);
    }
  };

  const handleEditClick = (city) => {
    setCityToEdit(city);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (city) => {
    setCityToDelete(city);
  };

  const confirmDelete = () => {
    if (cityToDelete) {
      setCities(cities.filter(c => c.id !== cityToDelete.id));
      setCityToDelete(null);
    }
  };

  return (
    <div className="container-fluid p-0">
      {/* Upper header segment and button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1 text-dark fw-bold">Cities</h1>
          <p className="text-secondary mb-0 fs-7">Master list of destinations you operate in.</p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 shadow-sm rounded-lg"
          onClick={() => {
            setCityToEdit(null);
            setIsFormOpen(true);
          }}
        >
          <i className="bi bi-plus-lg"></i>
          <span className="fw-semibold">Add City</span>
        </button>
      </div>

      {/* Toolbar filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-lg-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search city, state, code..."
          />
        </div>
      </div>

      {/* Interactive Database grid */}
      <CityTable
        cities={filteredCities}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Open/Close Forms modal */}
      <CityForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveCity}
        cityToEdit={cityToEdit}
      />

      {/* Confirmation alert modal */}
      <ConfirmDeleteModal
        isOpen={!!cityToDelete}
        onClose={() => setCityToDelete(null)}
        onConfirm={confirmDelete}
        itemName={cityToDelete ? `${cityToDelete.name} (${cityToDelete.code})` : ''}
      />
    </div>
  );
}

export default Cities;
