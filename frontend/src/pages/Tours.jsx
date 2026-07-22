import React, { useState, useMemo } from "react";
import { Plus, Search, Calendar, Users, MapPin, Mail, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import TourWizard from "../features/tour-wizard/TourWizard";

// Reusable micro-component for card details
function InfoRow({ icon: Icon, text }) {
  return (
    <div className="d-flex align-items-center gap-2 text-slate-600 truncate fs-8">
      <Icon size={14} className="flex-shrink-0" />
      <span className="text-truncate">{text || "—"}</span>
    </div>
  );
}

const getStatusConfig = (status) => {
  switch (status) {
    case "planning":
      return { label: "Planning", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" };
    case "emails_sent":
      return { label: "Emails Sent", bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" };
    case "quotation_received":
      return { label: "Quotation Received", bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500" };
    case "hotel_confirmed":
      return { label: "Hotel Confirmed", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" };
    case "completed":
      return { label: "Completed", bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" };
    case "cancelled":
      return { label: "Cancelled", bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" };
    default:
      return { label: "Planning", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" };
  }
};

function Tours({
  tours: initialTours = DEMO_TOURS,
  cities = DEMO_CITIES,
  cityImageMap = DEMO_IMAGE_MAP,
  onNewTour = null,
  onEdit = () => {},
  onDelete = () => {},
  onSendEmail = () => {},
  onStatusChange = () => {}
}) {
  const [toursList, setToursList] = useState(initialTours);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);

  const filteredTours = useMemo(() => {
    return toursList.filter((tour) => {
      const matchesSearch =
        tour.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tour.phone && tour.phone.includes(searchTerm)) ||
        (tour.email && tour.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === "all" || tour.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [toursList, searchTerm, statusFilter]);

  const handleStatusChange = (tourId, newStatus) => {
    setToursList(prev => prev.map(t => t.id === tourId ? { ...t, status: newStatus } : t));
    onStatusChange(tourId, newStatus);
    toast.success("Tour status updated");
  };

  const handleDelete = (tour) => {
    if (window.confirm(`Delete tour ${tour.id}?`)) {
      setToursList(prev => prev.filter(t => t.id !== tour.id));
      onDelete(tour.id);
      toast.success("Tour deleted successfully");
    }
  };

  const handleCreateTour = (newTourData) => {
    if (editingTour) {
      setToursList(prev => prev.map(t => t.id === editingTour.id ? newTourData : t));
      toast.success("Tour package updated successfully");
    } else {
      setToursList(prev => [newTourData, ...prev]);
      toast.success("New tour package created successfully");
    }
    setEditingTour(null);
  };

  const handleEditClick = (tour) => {
    setEditingTour(tour);
    setIsWizardOpen(true);
  };

  const handleOpenWizard = () => {
    if (onNewTour) {
      onNewTour();
    } else {
      setEditingTour(null);
      setIsWizardOpen(true);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-tours-light min-vh-100">
      {/* Top Row Header */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1 text-dark">Tours</h1>
          <p className="text-secondary mb-0 fs-7">Manage every itinerary from planning to completion.</p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 rounded-xl shadow-sm border-0 fs-7 fw-semibold"
          onClick={handleOpenWizard}
          data-testid="new-tour-btn"
        >
          <Plus size={16} />
          <span>New Tour</span>
        </button>
      </div>

      {/* Toolbar card */}
      <div className="card rounded-xl border-soft p-3 bg-white shadow-sm border-0">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-8 position-relative">
            <div className="input-group border rounded-lg overflow-hidden bg-light shadow-none">
              <span className="input-group-text bg-transparent border-0 text-muted ps-3 pe-2">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control bg-transparent border-0 py-2 fs-7 shadow-none"
                placeholder="Search by client, ID, phone…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="tours-search"
              />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <select
              className="form-select py-2 fs-7 text-dark border shadow-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              data-testid="tours-status-filter"
            >
              <option value="all">All statuses</option>
              <option value="planning">Planning</option>
              <option value="emails_sent">Emails Sent</option>
              <option value="quotation_received">Quotation Received</option>
              <option value="hotel_confirmed">Hotel Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tour card grid / Empty state */}
      {filteredTours.length === 0 ? (
        <div className="text-center py-5 border-dashed border-2 bg-white rounded-2xl d-flex flex-column align-items-center justify-content-center border-soft" style={{ borderStyle: "dashed" }}>
          <p className="text-secondary my-4 font-display fs-6">No tours match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTours.map((tour) => {
            const statusConfig = getStatusConfig(tour.status);
            const imageSrc = cityImageMap[tour.destinations[0]?.cityId] || Object.values(cityImageMap)[0];
            const destIdsText = tour.destinations
              .map((dest) => cities.find((c) => c.id === dest.cityId)?.name || "")
              .filter(Boolean)
              .join(", ") || "—";

            return (
              <div
                className="card border-soft bg-white rounded-2xl overflow-hidden shadow-sm tour-card-hover border-0"
                key={tour.id}
                data-testid={`tour-card-${tour.id}`}
              >
                {/* Destination hero image */}
                <div className="position-relative" style={{ height: "128px" }}>
                  <img
                    src={imageSrc}
                    className="w-100 h-100 object-cover"
                    alt={tour.clientName}
                    style={{ objectFit: "cover" }}
                  />
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 80%)" }}
                  ></div>
                  <div className="position-absolute bottom-0 start-0 p-3 text-white">
                    <span className="text-uppercase tracking-widest font-monospace fs-8 opacity-75 d-block">
                      {tour.id || "—"}
                    </span>
                    <h5 className="font-display font-bold text-lg mb-0 text-truncate text-white" style={{ maxWidth: "200px" }}>
                      {tour.clientName || "—"}
                    </h5>
                  </div>

                  {/* Status Badge */}
                  <div className="position-absolute top-0 end-0 p-2.5">
                    <span
                      className={`badge rounded-full px-2.5 py-1.5 fs-8 text-xs font-semibold d-flex align-items-center gap-1.5 ${statusConfig.bg} ${statusConfig.text}`}
                    >
                      <span className={`d-inline-block rounded-circle ${statusConfig.dot}`} style={{ width: "6px", height: "6px" }}></span>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                {/* Card body content */}
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <InfoRow icon={Calendar} text={`${tour.startDate || "—"} to ${tour.endDate || "—"}`} />
                    <InfoRow icon={Users} text={`${tour.travelers || 0} travelers`} />
                    <InfoRow icon={MapPin} text={destIdsText} />
                    <InfoRow icon={Mail} text={tour.email} />
                  </div>

                  {/* Actions row */}
                  <div className="d-flex flex-wrap align-items-center gap-2 pt-2 border-top">
                    <select
                      className="form-select form-select-sm w-auto fs-8 shadow-none py-1 px-2 border"
                      value={tour.status}
                      onChange={(e) => handleStatusChange(tour.id, e.target.value)}
                      data-testid={`tour-status-select-${tour.id}`}
                    >
                      <option value="planning">Planning</option>
                      <option value="emails_sent">Emails Sent</option>
                      <option value="quotation_received">Quotation Received</option>
                      <option value="hotel_confirmed">Hotel Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      className="btn btn-sm btn-white border d-inline-flex align-items-center gap-1 py-1 px-2 fs-8 hover-shadow text-dark"
                      onClick={() => onSendEmail(tour)}
                      data-testid={`tour-email-btn-${tour.id}`}
                    >
                      <Mail size={12} />
                      <span>Email</span>
                    </button>

                    <button
                      className="btn btn-sm btn-white border d-inline-flex align-items-center gap-1 py-1 px-2 fs-8 hover-shadow text-dark"
                      onClick={() => handleEditClick(tour)}
                      data-testid={`tour-edit-btn-${tour.id}`}
                    >
                      <Pencil size={12} />
                      <span>Edit</span>
                    </button>

                    <button
                      className="btn btn-sm btn-link border-0 text-rose-600 ms-auto p-1 d-inline-flex justify-content-center align-items-center hover-shadow"
                      onClick={() => handleDelete(tour)}
                      data-testid={`tour-delete-btn-${tour.id}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Tour Modal Wizard */}
      <TourWizard
        open={isWizardOpen}
        onOpenChange={setIsWizardOpen}
        initialTour={editingTour}
        onSubmit={handleCreateTour}
        cities={cities}
        hotels={DEMO_HOTELS}
        agents={DEMO_AGENTS}
        tours={toursList}
      />
    </div>
  );
}

// ----------------- DEMO DATA -----------------
const DEMO_CITIES = [
  { id: "c-jaipur", name: "Jaipur", code: "JAI" },
  { id: "c-goa", name: "Goa", code: "GOI" },
  { id: "c-manali", name: "Manali", code: "MNL" },
  { id: "c-udaipur", name: "Udaipur", code: "UDR" },
  { id: "c-munnar", name: "Munnar", code: "COK" }
];

const DEMO_IMAGE_MAP = {
  "c-jaipur": "https://images.unsplash.com/photo-1477584305590-38cf57beaa83?q=80&w=400&auto=format&fit=crop",
  "c-goa": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop",
  "c-manali": "https://images.unsplash.com/photo-1626783011243-d8312914d53c?q=80&w=400&auto=format&fit=crop",
  "c-udaipur": "https://images.unsplash.com/photo-1562141971-f921503c5d6c?q=80&w=400&auto=format&fit=crop",
  "c-munnar": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=400&auto=format&fit=crop"
};

const DEMO_HOTELS = [
  { id: 1, name: "Taj Rambagh Palace", city: "Jaipur", category: "Luxury", email: "reservations@tajrambagh.com" },
  { id: 2, name: "ITC Rajputana", city: "Jaipur", category: "5 Star", email: "sales@itcrajputana.com" },
  { id: 3, name: "Taj Lake Palace", city: "Udaipur", category: "Luxury", email: "res.lakepalace@tajhotels.com" },
  { id: 4, name: "Umaid Bhawan Palace", city: "Jodhpur", category: "Luxury", email: "res.umaid@tajhotels.com" }
];

const DEMO_AGENTS = [
  { id: "a-1", name: "Thomas Cook London", country: "United Kingdom", email: "london@thomascook.com", phone: "+44 20 7946 0958" },
  { id: "a-2", name: "MakeMyTrip Delhi", country: "India", email: "delhi@makemytrip.com", phone: "+91 11 4056 2200" },
  { id: "a-3", name: "TUI Germany", country: "Germany", email: "info@tui.de", phone: "+49 511 567 0" }
];

const DEMO_TOURS = [
  {
    id: "RT-2401",
    clientName: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul@gmail.com",
    travelers: 4,
    startDate: "2026-10-12",
    endDate: "2026-10-18",
    type: "Family",
    status: "planning",
    destinations: [{ cityId: "c-jaipur", nights: 3 }, { cityId: "c-udaipur", nights: 3 }],
    hotels: ["Taj Rambagh Palace"]
  },
  {
    id: "RT-2402",
    clientName: "Priyanka Patel",
    phone: "9123456789",
    email: "priyanka.patel@yahoo.com",
    travelers: 2,
    startDate: "2026-11-05",
    endDate: "2026-11-12",
    type: "Honeymoon",
    status: "emails_sent",
    destinations: [{ cityId: "c-goa", nights: 7 }],
    hotels: ["Taj Goa Resort"]
  },
  {
    id: "RT-2403",
    clientName: "Anil Kumble",
    phone: "9845012345",
    email: "anil.kumble@hotmail.com",
    travelers: 5,
    startDate: "2026-12-20",
    endDate: "2026-12-27",
    type: "Family",
    status: "quotation_received",
    destinations: [{ cityId: "c-manali", nights: 4 }, { cityId: "c-munnar", nights: 3 }],
    hotels: ["Solang Valley Resort"]
  },
  {
    id: "RT-2404",
    clientName: "Siddharth Anand",
    phone: "9988776655",
    email: "sid.anand@gmail.com",
    travelers: 6,
    startDate: "2026-09-01",
    endDate: "2026-09-05",
    type: "Corporate",
    status: "hotel_confirmed",
    destinations: [{ cityId: "c-udaipur", nights: 4 }],
    hotels: ["Taj Lake Palace"]
  },
  {
    id: "RT-2405",
    clientName: "Vikram Malhotra",
    phone: "9812345670",
    email: "vikram@malhotra.org",
    travelers: 2,
    startDate: "2026-05-10",
    endDate: "2026-05-16",
    type: "Adventure",
    status: "completed",
    destinations: [{ cityId: "c-munnar", nights: 6 }],
    hotels: ["Fragrant Nature Resort"]
  },
  {
    id: "RT-2406",
    clientName: "Karan Johar",
    phone: "9822334455",
    email: "karan@dharmaprod.in",
    travelers: 3,
    startDate: "2026-08-15",
    endDate: "2026-08-20",
    type: "Family",
    status: "cancelled",
    destinations: [{ cityId: "c-jaipur", nights: 5 }],
    hotels: ["ITC Rajputana"]
  }
];

export default Tours;
export { DEMO_TOURS, DEMO_CITIES, DEMO_IMAGE_MAP };
