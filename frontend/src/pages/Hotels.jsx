import React, { useState, useEffect } from 'react';
import SearchBar from '../components/ui/SearchBar';
import HotelTable from '../components/tables/HotelTable';
import HotelForm from '../components/forms/HotelForm';
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal';
import { getHotels, createHotel, updateHotel, deleteHotel } from '../services/hotelService';
import { getCities } from '../services/cityService';
import { toast } from 'sonner';

function Hotels() {
  const [citiesList, setCitiesList] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [viewMode, setViewMode] = useState('Cards'); // 'Cards' or 'Table'
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [hotelToEdit, setHotelToEdit] = useState(null);
  const [hotelToDelete, setHotelToDelete] = useState(null);

  // Fetch Cities on Mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await getCities();
        if (res?.data) {
          setCitiesList(res.data);
        } else if (Array.isArray(res)) {
          setCitiesList(res);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };
    fetchCities();
  }, []);

  // Fetch Hotels from Backend
  const fetchHotels = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedCityId) params.cityId = selectedCityId;

      const res = await getHotels(params);
      if (res?.data?.hotels) {
        setHotels(res.data.hotels);
      } else if (Array.isArray(res?.data)) {
        setHotels(res.data);
      } else {
        setHotels([]);
      }
    } catch (err) {
      console.error("Error fetching hotels:", err);
      toast.error("Failed to load hotels from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [search, selectedCityId]);

  // Handle Save (Create or Update)
  const handleSaveHotel = async (formData) => {
    try {
      // Find matching city object or cityId
      const targetCity = citiesList.find(
        (c) => c.name.toLowerCase() === (formData.city || '').toLowerCase() || c.id === Number(formData.cityId)
      );

      const payload = {
        name: formData.name,
        category: formData.category || '3 Star',
        rating: formData.rating ? parseFloat(formData.rating) : null,
        contactPerson: formData.contactPerson || 'N/A',
        email: formData.email || null,
        phone: formData.phone || null,
        cityId: targetCity ? targetCity.id : (citiesList[0]?.id || 1),
      };

      if (hotelToEdit) {
        const res = await updateHotel(hotelToEdit.id, payload);
        if (res.success) {
          toast.success("Hotel updated successfully");
          fetchHotels();
        }
      } else {
        const res = await createHotel(payload);
        if (res.success) {
          toast.success("Hotel added successfully");
          fetchHotels();
        }
      }
      setIsFormOpen(false);
      setHotelToEdit(null);
    } catch (err) {
      console.error("Save hotel error:", err);
      toast.error(err.response?.data?.message || "Failed to save hotel");
    }
  };

  const handleEditClick = (hotel) => {
    // Map hotel object for Form
    const formatted = {
      ...hotel,
      city: hotel.city?.name || hotel.city || '',
    };
    setHotelToEdit(formatted);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (hotel) => {
    setHotelToDelete(hotel);
  };

  const confirmDelete = async () => {
    if (!hotelToDelete) return;
    try {
      const res = await deleteHotel(hotelToDelete.id);
      if (res.success) {
        toast.success("Hotel deleted successfully");
        fetchHotels();
      }
    } catch (err) {
      console.error("Delete hotel error:", err);
      toast.error(err.response?.data?.message || "Failed to delete hotel");
    } finally {
      setHotelToDelete(null);
    }
  };

  // Process hotels for card/table view display
  const displayHotels = hotels.map(h => ({
    ...h,
    cityName: h.city?.name || h.city || 'Unknown',
    city: h.city?.name || h.city || 'Unknown',
    status: h.isActive !== false ? 'Active' : 'Inactive'
  }));

  return (
    <div className="container-fluid p-0">
      {/* Header */}
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

      {/* Filters Toolbar */}
      <div className="card border-0 shadow-sm p-3 mb-4 bg-white rounded-xl">
        <div className="row g-3 align-items-center justify-content-between">
          <div className="col-md-8 col-lg-6 d-flex gap-3">
            <div className="flex-grow-1">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search hotels by name..."
              />
            </div>

            <div className="flex-shrink-0" style={{ width: '160px' }}>
              <select
                className="form-select border shadow-sm py-2 px-3"
                value={selectedCityId}
                onChange={(e) => setSelectedCityId(e.target.value)}
                style={{ boxShadow: 'none' }}
              >
                <option value="">All cities</option>
                {citiesList.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
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

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-5 bg-white border rounded shadow-sm">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-secondary mb-0">Loading hotels from server...</p>
        </div>
      ) : viewMode === 'Cards' ? (
        displayHotels.length === 0 ? (
          <div className="text-center py-5 bg-white border rounded shadow-sm">
            <i className="bi bi-building text-muted display-4"></i>
            <p className="mt-3 text-secondary mb-0">No hotels found matching selected filters.</p>
          </div>
        ) : (
          <div className="row g-4">
            {displayHotels.map((hotel) => (
              <div className="col-12 col-md-6" key={hotel.id}>
                <div className="card h-100 border border-light-subtle shadow-sm hover-shadow transition rounded-xl p-4 bg-white">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="card-title fw-bold mb-1 text-dark">{hotel.name}</h5>
                      <span className="text-secondary fs-8 d-flex align-items-center gap-1.5">
                        <i className="bi bi-geo-alt-fill text-muted"></i> {hotel.cityName}
                      </span>
                    </div>
                    <span className="badge bg-warning bg-opacity-10 text-warning-emphasis border border-warning-subtle px-2.5 py-1.5 rounded d-flex align-items-center gap-1 fw-bold fs-8">
                      <i className="bi bi-star-fill text-warning"></i> {hotel.rating || '4.5'}
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
          hotels={displayHotels}
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

      {/* Delete Confirmation Modal */}
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
