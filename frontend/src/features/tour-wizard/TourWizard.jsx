/**
 * TourWizard.jsx
 * Comprehensive 4-step Tour creation and edit wizard.
 */
import React, { useState, useEffect } from "react";
import { User, Car, Route, ClipboardCheck, ArrowLeft, ArrowRight, X, Sparkles, Bell, Info } from "lucide-react";
import { toast } from "sonner";

import Stepper from "./Stepper";
import AddAgentPopover from "./AddAgentPopover";
import AirTrainTable from "./AirTrainTable";
import TripPlanTable from "./TripPlanTable";
import HotelRequestsTable from "./HotelRequestsTable";
import EmailComposeModal from "./EmailComposeModal";
import { syncHotelRequests } from "./syncHotelRequests";

// Steps constant configuration
const STEPS = [
  { label: "Step 1 · Client & File", icon: User },
  { label: "Step 2 · Vehicle & Guide", icon: Car },
  { label: "Step 3 · Trip Plan", icon: Route },
  { label: "Step 4 · Preview & Request", icon: ClipboardCheck }
];

export default function TourWizard({
  open,
  onOpenChange,
  initialTour = null,
  tours = [],
  agents = [],
  hotels = [],
  cities = [],
  onSubmit,
  onSendEmail
}) {
  const [step, setStep] = useState(1);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [activeRequestRow, setActiveRequestRow] = useState(null);
  
  // Local list of agents (supports instant additions)
  const [agentsList, setAgentsList] = useState(agents);

  // Default clean itinerary row template 
  const createItineraryRow = (index = 1) => ({
    id: `row-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
    arrivalDate: new Date().toISOString().split("T")[0],
    departureDate: "",
    cityId: "",
    nights: 0,
    sglCount: 0,
    dblCount: 0,
    tplCount: 0,
    mealPlan: "",
    transport: "Car",
    carrierNo: "",
    hotelId: "",
    roomType: "",
    status: "OK",
    remarks: ""
  });

  // State structure
  const [formData, setFormData] = useState({
    fileNumber: "",
    tourName: "",
    bookingDate: new Date().toISOString().split("T")[0],
    receivedOn: new Date().toISOString().split("T")[0],
    agentId: "",
    clientName: "",
    clientNationality: "Indian",
    clientEmail: "",
    clientPhone: "",
    pax: 1,
    vehicleType: "Sedan",
    guideRequired: false,
    guideLanguage: "English",
    sglCount: 0,
    dblCount: 0,
    tplCount: 0,
    mealPlan: "CP - Breakfast",
    monumentFeesIncluded: false,
    monumentFees: "",
    specialInstructions: "",
    itinerary: [],
    transitSegments: [],
    // Step 4
    bookingStatus: "Requested", // Requested, Waitlisted, Confirmed
    followupDate: "",
    workflowStatus: "New Enquiry", // New Enquiry, In Progress, Awaiting Reply, Emails Sent, Confirmed
  });

  const [hotelOverrides, setHotelOverrides] = useState({});
  const [errors, setErrors] = useState({});

  // Fetch initialTour details or reset on opens
  useEffect(() => {
    if (open) {
      if (initialTour) {
        setFormData({
          fileNumber: initialTour.id || initialTour.fileNumber || "",
          tourName: initialTour.tourName || "",
          bookingDate: initialTour.startDate || new Date().toISOString().split("T")[0],
          receivedOn: initialTour.receivedOn || new Date().toISOString().split("T")[0],
          agentId: initialTour.agentId || "",
          clientName: initialTour.clientName || "",
          clientNationality: initialTour.clientNationality || "Indian",
          clientEmail: initialTour.email || "",
          clientPhone: initialTour.phone || "",
          pax: initialTour.travelers || 1,
          vehicleType: initialTour.vehicleType || "Sedan",
          guideRequired: initialTour.guideRequired || false,
          guideLanguage: initialTour.guideLanguage || "English",
          sglCount: initialTour.sglCount || 0,
          dblCount: initialTour.dblCount || 0,
          tplCount: initialTour.tplCount || 0,
          mealPlan: initialTour.mealPlan || "CP - Breakfast",
          monumentFeesIncluded: initialTour.monumentFeesIncluded || false,
          monumentFees: initialTour.monumentFees || "",
          specialInstructions: initialTour.specialInstructions || "",
          itinerary: initialTour.itinerary || [createItineraryRow(1)],
          transitSegments: initialTour.transitSegments || [],
          bookingStatus: initialTour.status === "hotel_confirmed" ? "Confirmed" : initialTour.bookingStatus || "Requested",
          followupDate: initialTour.followupDate || "",
          workflowStatus: initialTour.status === "planning" ? "New Enquiry" : initialTour.workflowStatus || "New Enquiry"
        });
        setHotelOverrides(initialTour.hotelOverrides || {});
      } else {
        // Generate new sequential number
        const nextId = computeNextFileNo(tours);
        setFormData({
          fileNumber: nextId,
          tourName: "",
          bookingDate: new Date().toISOString().split("T")[0],
          receivedOn: new Date().toISOString().split("T")[0],
          agentId: "",
          clientName: "",
          clientNationality: "Indian",
          clientEmail: "",
          clientPhone: "",
          pax: 1,
          vehicleType: "Sedan",
          guideRequired: false,
          guideLanguage: "English",
          sglCount: 0,
          dblCount: 0,
          tplCount: 0,
          mealPlan: "CP - Breakfast",
          monumentFeesIncluded: false,
          monumentFees: "",
          specialInstructions: "",
          itinerary: [createItineraryRow(1)],
          transitSegments: [],
          bookingStatus: "Requested",
          followupDate: "",
          workflowStatus: "New Enquiry"
        });
        setHotelOverrides({});
      }
      setErrors({});
      setStep(1);
    }
  }, [open, initialTour, tours]);


  // Next sequential generator
  const computeNextFileNo = (list) => {
    if (!list || list.length === 0) return "RT-2026-007";
    const ids = list.map(t => t.id || t.fileNumber).filter(Boolean);
    
    let max = 0;
    for (const id of ids) {
      const match = id.match(/RT-2026-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > max) max = num;
      }
    }
    if (max > 0) {
      return `RT-2026-${String(max + 1).padStart(3, '0')}`;
    }
    
    // Check standard numbers like RT-2401
    max = 0;
    for (const id of ids) {
      const match = id.match(/RT-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > max) max = num;
      }
    }
    if (max > 0) {
      return `RT-${max + 1}`;
    }
    
    return "RT-2026-007";
  };

  const handleUpdateField = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Agent handlers
  const handleAddNewAgent = (newAgent) => {
    setAgentsList(prev => [...prev, newAgent]);
    handleUpdateField("agentId", newAgent.id);
  };

  // Itinerary Plan Table Row modifications
  const handleUpdateItineraryRow = (index, field, value) => {
    const updatedItinerary = [...formData.itinerary];
    updatedItinerary[index][field] = value;

    if (field === "arrivalDate" || field === "departureDate") {
      const arr = new Date(updatedItinerary[index].arrivalDate);
      const dep = new Date(updatedItinerary[index].departureDate);
      if (!isNaN(arr) && !isNaN(dep) && dep >= arr) {
        const diffTime = Math.abs(dep - arr);
        updatedItinerary[index].nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      } else {
        updatedItinerary[index].nights = 0;
      }
    }
    
    setFormData(prev => ({ ...prev, itinerary: updatedItinerary }));
  };

  const handleAddItineraryRow = () => {
    const lastRow = formData.itinerary[formData.itinerary.length - 1];
    const newArrival = lastRow ? (lastRow.departureDate || lastRow.arrivalDate) : new Date().toISOString().split("T")[0];
    
    setFormData(prev => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          id: `row-${Date.now()}-${prev.itinerary.length + 1}-${Math.floor(Math.random() * 1000)}`,
          arrivalDate: newArrival,
          departureDate: "",
          cityId: "",
          nights: 0,
          sglCount: 0,
          dblCount: 0,
          tplCount: 0,
          mealPlan: "",
          transport: "Car",
          carrierNo: "",
          hotelId: "",
          roomType: "",
          status: "OK",
          remarks: ""
        }
      ]
    }));
  };

  const handleRemoveItineraryRow = (index) => {
    if (formData.itinerary.length > 1) {
      setFormData(prev => ({
        ...prev,
        itinerary: prev.itinerary.filter((_, i) => i !== index)
      }));
    }
  };

  const handleDuplicateItineraryRow = (index) => {
    const rowToClone = formData.itinerary[index];
    const clonedRow = {
      ...rowToClone,
      id: `row-${Date.now()}-${index}-clone-${Math.floor(Math.random() * 1000)}`,
      arrivalDate: rowToClone.departureDate,
      departureDate: new Date(new Date(rowToClone.departureDate).getTime() + (Number(rowToClone.nights) || 1) * 86400000).toISOString().split("T")[0]
    };
    setFormData(prev => {
      const updated = [...prev.itinerary];
      updated.splice(index + 1, 0, clonedRow);
      return { ...prev, itinerary: updated };
    });
  };

  // Domestic Transit segment updates
  const handleAddTransitSegment = () => {
    setFormData(prev => ({
      ...prev,
      transitSegments: [
        ...prev.transitSegments,
        {
          id: `seg-${Date.now()}-${prev.transitSegments.length + 1}`,
          date: new Date().toISOString().split("T")[0],
          fromCity: "",
          toCity: "",
          mode: "Flight",
          carrierNo: "",
          depTime: "",
          remarks: ""
        }
      ]
    }));
  };

  const handleUpdateTransitSegment = (index, field, value) => {
    const updated = [...formData.transitSegments];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, transitSegments: updated }));
  };

  const handleRemoveTransitSegment = (index) => {
    setFormData(prev => ({
      ...prev,
      transitSegments: prev.transitSegments.filter((_, i) => i !== index)
    }));
  };

  // hotel overrides updates
  const handleUpdateOverride = (key, field, value) => {
    setHotelOverrides(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  // Derive request list
  const derivedRequests = syncHotelRequests(formData.itinerary, [], hotelOverrides);

  // Validate step navigation
  const validateStep = (current) => {
    const validationErrors = {};
    if (current === 1) {
      if (!formData.clientName.trim()) {
        validationErrors.clientName = "Client Name is required";
      }
      if (!formData.fileNumber.trim()) {
        validationErrors.fileNumber = "File number is required";
      }
    }
    if (current === 3) {
      const hasCity = formData.itinerary.some(r => r.cityId);
      if (!hasCity) {
        toast.error("At least one trip plan row must have a city selected!");
        return false;
      }
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    } else {
      toast.error("Please fill in all required fields!");
    }
  };

  const handleBackStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSaveAndRequest = () => {
    if (!validateStep(1) || !validateStep(3)) {
      toast.error("Please complete required entries before saving.");
      return;
    }
    
    // Save with status override
    handleFinish("Awaiting Reply");
  };

  const handleFinish = (workflowOverride = null) => {
    if (!validateStep(1) || !validateStep(3)) {
      toast.error("Please inspect first steps for missing values.");
      return;
    }

    const uniqueCityIds = Array.from(new Set(formData.itinerary.map(r => r.cityId).filter(Boolean)));
    const statusVal = formData.bookingStatus === "Confirmed" ? "hotel_confirmed" : "planning";

    const payload = {
      ...formData,
      id: formData.fileNumber,
      clientName: formData.clientName,
      phone: formData.clientPhone,
      email: formData.clientEmail,
      travelers: Number(formData.pax),
      startDate: formData.itinerary[0]?.arrivalDate || formData.bookingDate,
      endDate: formData.itinerary[formData.itinerary.length - 1]?.departureDate || formData.bookingDate,
      type: formData.vehicleType + " Tour",
      status: statusVal,
      workflowStatus: workflowOverride || formData.workflowStatus,
      destinations: formData.itinerary.map(item => ({ cityId: item.cityId, nights: item.nights })),
      hotels: formData.itinerary.map(item => item.hotelId).filter(Boolean),
      derivedDestinations: uniqueCityIds,
      hotelOverrides: hotelOverrides
    };

    onSubmit(payload);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.4)", zIndex: 1050 }}
      data-testid="tour-wizard"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered" style={{ maxWidth: "1140px" }}>
        <div className="modal-content border-0 shadow-lg rounded-2xl overflow-hidden bg-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
          
          {/* Header */}
          <div className="px-5 py-4 border-bottom bg-gradient-to-br from-slate-50 to-white position-relative">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h2 className="font-display fw-bold text-dark m-0 fs-4">
                  {initialTour ? "Edit Tour" : "Create Tour"}
                </h2>
                <span className="text-secondary fs-7 mt-1 d-block">
                  File No <span className="text-primary font-monospace fw-bold" data-testid="input-file-no">{formData.fileNumber}</span>
                </span>
              </div>
              <button
                type="button"
                className="border-0 bg-transparent text-slate-400 hover:text-slate-600 p-1 transition-colors d-flex align-items-center justify-content-center"
                onClick={() => onOpenChange(false)}
                aria-label="Close"
                data-testid="tour-cancel-x"
              >
                <X size={20} />
              </button>
            </div>

            {/* Stepper Progress Badges */}
            <div className="mt-3">
              <Stepper
                current={step}
                steps={STEPS}
                onStepClick={(s) => {
                  if (validateStep(step) || s < step) {
                    setStep(s);
                  }
                }}
              />
            </div>
          </div>

          {/* Form scroll body block */}
          <div className="modal-body px-5 py-4 bg-light bg-opacity-50 overflow-y-auto" style={{ maxHeight: "60vh" }}>
            
            {/* STEP 1: Client & Booking Info */}
            {step === 1 && (
              <div className="space-y-6" data-testid="step-1">
                <div className="row g-4">
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label fw-bold text-dark fs-7 mb-1">File No <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className={`form-control bg-light fs-7 px-3 py-2.5 border rounded-xl shadow-none font-monospace fw-semibold ${
                        errors.fileNumber ? "is-invalid" : ""
                      }`}
                      value={formData.fileNumber}
                      onChange={(e) => handleUpdateField("fileNumber", e.target.value)}
                      data-testid="input-file-no-edit"
                    />
                  </div>
                  <div className="col-md-6 col-lg-6">
                    <label className="form-label fw-bold text-dark fs-7 mb-1 font-display">Tour Name</label>
                    <input
                      type="text"
                      className="form-control fs-7 px-3 py-2.5 border rounded-xl shadow-none"
                      placeholder="Explore the Colours of India"
                      value={formData.tourName}
                      onChange={(e) => handleUpdateField("tourName", e.target.value)}
                      data-testid="input-tour-name"
                    />
                  </div>
                </div>

                <div className="row g-4 mt-2">
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label fw-bold text-dark fs-7 mb-1">Booking Date</label>
                    <input
                      type="date"
                      className="form-control fs-7 px-3 py-2.5 border rounded-xl shadow-none"
                      value={formData.bookingDate}
                      onChange={(e) => handleUpdateField("bookingDate", e.target.value)}
                      data-testid="input-booking-date"
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label fw-bold text-dark fs-7 mb-1">Received On</label>
                    <input
                      type="date"
                      className="form-control fs-7 px-3 py-2.5 border rounded-xl shadow-none"
                      value={formData.receivedOn}
                      onChange={(e) => handleUpdateField("receivedOn", e.target.value)}
                      data-testid="input-received-date"
                    />
                  </div>

                  {/* Agent network list */}
                  <div className="col-md-12 col-lg-6 position-relative">
                    <label className="form-label fw-bold text-dark fs-7 mb-1">Agent / Agency</label>
                    <div className="d-flex align-items-center gap-2">
                      <select
                        className="form-select fs-7 px-3 py-2.5 border select rounded-xl shadow-none text-dark"
                        value={formData.agentId}
                        onChange={(e) => handleUpdateField("agentId", e.target.value)}
                        data-testid="select-agent"
                      >
                        <option value="">Direct Client (No Partner Agent)</option>
                        {agentsList.map(a => (
                          <option key={a.id} value={a.id}>{a.name} ({a.country || "IN"})</option>
                        ))}
                      </select>
                      
                      <button
                        type="button"
                        className="btn btn-outline-secondary px-3 py-2.5 rounded-xl border flex-shrink-0 d-flex align-items-center gap-1 hover-shadow transition-click shadow-none bg-white font-semibold fs-7"
                        onClick={() => setShowAddAgent(!showAddAgent)}
                        data-testid="btn-add-agent-inline"
                      >
                        <span>+ Add</span>
                      </button>
                    </div>

                    {/* Popover */}
                    <AddAgentPopover
                      isOpen={showAddAgent}
                      onClose={() => setShowAddAgent(false)}
                      onSave={handleAddNewAgent}
                    />
                  </div>
                </div>

                <div className="border-top pt-4 mt-4">
                  <span className="overline-title mb-3 d-block">CLIENT DETAILS</span>
                  <div className="row g-4">
                    <div className="col-md-6 col-lg-4">
                      <label className="form-label fw-bold text-dark fs-7 mb-1">Client Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control fs-7 px-3 py-2.5 border rounded-xl shadow-none ${errors.clientName ? "is-invalid" : ""}`}
                        placeholder="Lead traveler name"
                        value={formData.clientName}
                        onChange={(e) => handleUpdateField("clientName", e.target.value)}
                        data-testid="input-client-name"
                      />
                      {errors.clientName && <div className="invalid-feedback">{errors.clientName}</div>}
                    </div>

                    <div className="col-md-6 col-lg-2">
                      <label className="form-label fw-bold text-dark fs-7 mb-1">Nationality</label>
                      <select
                        className="form-select fs-7 px-3 py-2.5 border select rounded-xl shadow-none text-dark"
                        value={formData.clientNationality}
                        onChange={(e) => handleUpdateField("clientNationality", e.target.value)}
                      >
                        <option value="Indian">Indian</option>
                        <option value="American">American</option>
                        <option value="British">British</option>
                        <option value="German">German</option>
                        <option value="French">French</option>
                        <option value="Spanish">Spanish</option>
                      </select>
                    </div>

                    <div className="col-md-6 col-lg-3">
                      <label className="form-label fw-bold text-dark fs-7 mb-1">Email</label>
                      <input
                        type="email"
                        className="form-control fs-7 px-3 py-2.5 border rounded-xl shadow-none"
                        placeholder="client@mail.com"
                        value={formData.clientEmail}
                        onChange={(e) => handleUpdateField("clientEmail", e.target.value)}
                      />
                    </div>

                    <div className="col-md-6 col-lg-2">
                      <label className="form-label fw-bold text-dark fs-7 mb-1">Phone</label>
                      <input
                        type="text"
                        className="form-control fs-7 px-3 py-2.5 border rounded-xl shadow-none"
                        placeholder="+91..."
                        value={formData.clientPhone}
                        onChange={(e) => handleUpdateField("clientPhone", e.target.value)}
                      />
                    </div>

                    <div className="col-md-3 col-lg-1">
                      <label className="form-label fw-bold text-dark fs-7 mb-1">Pax</label>
                      <input
                        type="number"
                        min="1"
                        className="form-control fs-7 px-2 py-2.5 border rounded-xl shadow-none text-center"
                        value={formData.pax}
                        onChange={(e) => handleUpdateField("pax", Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* STEP 2: Trip Configuration */}
            {step === 2 && (
              <div className="space-y-6" data-testid="step-2">
                <div className="row g-4">
                  <div className="col-md-6 col-lg-4">
                    <label className="form-label fw-bold text-dark fs-7 mb-1">Vehicle Type</label>
                    <select
                      className="form-select fs-7 px-3 py-2.5 border select rounded-xl shadow-none text-dark"
                      value={formData.vehicleType}
                      onChange={(e) => handleUpdateField("vehicleType", e.target.value)}
                    >
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Coach">Coach</option>
                      <option value="Luxury Sedan">Luxury Sedan</option>
                      <option value="Mini Bus">Mini Bus</option>
                      <option value="Traveller">Traveller</option>
                    </select>
                  </div>

                  <div className="col-md-6 col-lg-8">
                    <div className="card border rounded-xl p-3 bg-white shadow-none">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <label className="form-label fw-bold text-dark fs-7 m-0">Guide Required</label>
                          <span className="text-secondary fs-8 d-block">Local tour guide support during sightseeing</span>
                        </div>
                        <div className="form-check form-switch p-0 m-0">
                          <input
                            className="form-check-input shadow-none cursor-pointer"
                            type="checkbox"
                            role="switch"
                            style={{ width: "2.5em", height: "1.25em" }}
                            checked={formData.guideRequired}
                            onChange={(e) => handleUpdateField("guideRequired", e.target.checked)}
                            data-testid="toggle-guide"
                          />
                        </div>
                      </div>

                      {formData.guideRequired && (
                        <div className="mt-2.5 pt-2.5 border-top">
                          <label className="form-label fw-semibold text-secondary fs-8 mb-1">Guide Language</label>
                          <select
                            className="form-select form-select-sm py-1.5 border select shadow-none fs-7 rounded-lg"
                            value={formData.guideLanguage}
                            onChange={(e) => handleUpdateField("guideLanguage", e.target.value)}
                          >
                            <option value="English">English</option>
                            <option value="French">French</option>
                            <option value="Spanish">Spanish</option>
                            <option value="Italian">Italian</option>
                            <option value="German">German</option>
                            <option value="Japanese">Japanese</option>
                            <option value="Hindi">Hindi</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="card border rounded-xl p-3 bg-white shadow-none mt-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold text-dark m-0 fs-7">Monument Entrance Fees included</h6>
                      <span className="text-secondary fs-8 d-block">Check if fees are pre-paid or included in the package</span>
                    </div>
                    <div className="form-check form-switch p-0 m-0">
                      <input
                        className="form-check-input shadow-none cursor-pointer"
                        type="checkbox"
                        checked={formData.monumentFeesIncluded}
                        onChange={(e) => handleUpdateField("monumentFeesIncluded", e.target.checked)}
                      />
                    </div>
                  </div>

                  {formData.monumentFeesIncluded && (
                    <div className="mt-3">
                      <textarea
                        className="form-control fs-7 px-3 py-2 border rounded-xl shadow-none bg-light font-monospace"
                        rows="3"
                        placeholder="List covered sights, e.g. Amber Fort, Taj Mahal, Hawa Mahal Entrance Tickets..."
                        value={formData.monumentFees || ""}
                        onChange={(e) => handleUpdateField("monumentFees", e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="form-label fw-bold text-dark fs-7 mb-1">Special Operator Instructions</label>
                  <textarea
                    className="form-control fs-7 px-3 py-2.5 border rounded-xl shadow-none text-dark"
                    rows="3"
                    placeholder="E.g. Senior travelers, wheelchair requested, anniversary setup in rooms..."
                    value={formData.specialInstructions || ""}
                    onChange={(e) => handleUpdateField("specialInstructions", e.target.value)}
                  />
                </div>

              </div>
            )}

            {/* STEP 3: Itinerary & Hotels */}
            {step === 3 && (
              <div className="space-y-6" data-testid="step-3">
                {/* Connections list */}
                <AirTrainTable
                  segments={formData.transitSegments}
                  cities={cities}
                  onAdd={handleAddTransitSegment}
                  onUpdate={handleUpdateTransitSegment}
                  onRemove={handleRemoveTransitSegment}
                />

                {/* Plan rows list */}
                <TripPlanTable
                  itinerary={formData.itinerary}
                  cities={cities}
                  hotels={hotels}
                  onUpdateRow={handleUpdateItineraryRow}
                  onAddRow={handleAddItineraryRow}
                  onRemoveRow={handleRemoveItineraryRow}
                  onDuplicateRow={handleDuplicateItineraryRow}
                />
              </div>
            )}

            {/* STEP 4: Status, Hotel Requests & Preview */}
            {step === 4 && (
              <div className="space-y-6" data-testid="step-4">
                
                {/* Static booking status selector cards */}
                <div className="card border rounded-2xl bg-white shadow-sm p-4">
                  <h6 className="overline-title mb-3">Booking Status</h6>
                  <div className="row g-3">
                    {[
                      { key: "Requested", text: "Requested", desc: "Sent rooms reservation queries to properties", tid: "radio-requested" },
                      { key: "Waitlisted", text: "Waitlisted", desc: "Hotel rooms are full, placed on queue", tid: "radio-waitlisted" },
                      { key: "Confirmed", text: "Confirmed", desc: "Rooms vouchers blocked and confirmation received", tid: "radio-confirmed" }
                    ].map(statusItem => {
                      const isSel = formData.bookingStatus === statusItem.key;
                      return (
                        <div
                          key={statusItem.key}
                          className={`col-md-4 card border p-3 rounded-xl cursor-pointer transition-hover-card ${
                            isSel ? "border-primary bg-primary bg-opacity-5" : "border-slate-200"
                          }`}
                          onClick={() => handleUpdateField("bookingStatus", statusItem.key)}
                          data-testid={statusItem.tid}
                        >
                          <h6 className="m-0 fs-7 fw-bold text-dark">{statusItem.text}</h6>
                          <span className="text-secondary fs-8 d-block mt-1">{statusItem.desc}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="row g-4 mt-3 pt-3 border-top">
                    {/* Follow-up Alerts */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark fs-7 mb-1 d-flex align-items-center gap-1.5">
                        <Bell size={14} className="text-secondary" />
                        <span>Follow-up Alert Date</span>
                      </label>
                      <input
                        type="date"
                        className="form-control fs-7 px-3 py-2.5 border rounded-xl shadow-none"
                        value={formData.followupDate || ""}
                        onChange={(e) => handleUpdateField("followupDate", e.target.value)}
                        data-testid="input-followup"
                      />
                    </div>

                    {/* Internal Pipeline Workflow */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark fs-7 mb-1">Internal Workflow pipeline status Selector</label>
                      <select
                        className="form-select fs-7 px-3 py-2.5 border select rounded-xl shadow-none text-dark"
                        value={formData.workflowStatus}
                        onChange={(e) => handleUpdateField("workflowStatus", e.target.value)}
                        data-testid="select-workflow"
                      >
                        <option value="New Enquiry">New Enquiry</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Awaiting Reply">Awaiting Reply</option>
                        <option value="Emails Sent">Emails Sent</option>
                        <option value="Confirmed">Confirmed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Hotel Request generation rows */}
                <HotelRequestsTable
                  requests={derivedRequests}
                  onUpdateOverride={handleUpdateOverride}
                  onSendMailClick={(row) => {
                    setActiveRequestRow(row);
                    setShowEmailModal(true);
                  }}
                />

                {/* Detailed Preview block */}
                <div className="card rounded-2xl border-primary bg-gradient-to-br from-blue-50 to-white shadow-sm p-4 overflow-hidden border-2 bg-white">
                  <span className="overline-title mb-2.5 d-block text-primary">PREVIEW DOCUMENTATION</span>
                  
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h4 className="m-0 fs-5 font-display fw-bold text-slate-800">
                        {formData.fileNumber} — {formData.clientName || "Rahul Sharma"}
                      </h4>
                      {formData.tourName && <p className="m-0 text-secondary fs-7 fst-italic mt-0.5">"{formData.tourName}"</p>}
                    </div>

                    <span className={`badge rounded-full px-2.5 py-1.5 fs-8 text-xs font-semibold ${
                      formData.bookingStatus === "Confirmed" ? "bg-success bg-opacity-10 text-success" : "bg-amber-50 text-amber-700"
                    }`}>
                      {formData.bookingStatus} Status
                    </span>
                  </div>

                  {/* Summary parameters */}
                  <div className="bg-light bg-opacity-25 rounded-xl border p-3 mb-4 fs-8 text-slate-600">
                    <div className="row g-3">
                      <div className="col-6 col-md-3"><strong>Booking Date:</strong> {formData.bookingDate}</div>
                      <div className="col-6 col-md-3"><strong>Travelers Pax:</strong> {formData.pax} pax</div>
                      <div className="col-6 col-md-3"><strong>Nationality:</strong> {formData.clientNationality}</div>
                      <div className="col-6 col-md-3"><strong>Vehicle type:</strong> {formData.vehicleType}</div>
                    </div>
                    <div className="row g-3 mt-1.5 border-top pt-2">
                      <div className="col-6 col-md-3"><strong>Guide:</strong> {formData.guideRequired ? `Yes (${formData.guideLanguage})` : "No Guide"}</div>
                      <div className="col-6 col-md-3"><strong>Preferred Plan:</strong> {formData.mealPlan}</div>
                      <div className="col-6 col-md-6"><strong>Rooms configuration:</strong> SGL: {formData.sglCount} | DBL: {formData.dblCount} | TPL: {formData.tplCount}</div>
                    </div>
                  </div>

                  {/* Itinerary circle timeline list */}
                  <div className="card border rounded-xl p-3 bg-white shadow-none">
                    <span className="overline-title mb-3 d-block">ITINERARY MAP</span>
                    
                    <div className="space-y-4">
                      {formData.itinerary.map((row, idx) => {
                        const cityName = cities.find(c => c.id === row.cityId)?.name || "Unspecified City";
                        return (
                          <div key={row.id} className="d-flex align-items-start gap-3">
                            <span className="bg-primary text-white d-flex align-items-center justify-content-center rounded-circle fw-bold fs-7" style={{ width: "26px", height: "26px" }}>
                              {idx + 1}
                            </span>
                            <div className="fs-7 text-dark">
                              <strong>{cityName}</strong> stay at <strong>{row.hotelId || "TBD Hotels"}</strong>
                              <span className="text-secondary fs-8 d-block mt-0.5">
                                {row.arrivalDate} to {row.departureDate} ({row.nights} Nights) · Rooms: SGL {row.sglCount} / DBL {row.dblCount} / TPL {row.tplCount} ({row.mealPlan || "EP"})
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {formData.specialInstructions.trim() && (
                    <div className="card border-warning border-opacity-25 bg-amber-50 bg-opacity-10 rounded-xl p-3 mt-3.5 shadow-none border">
                      <p className="overline-title m-0 text-amber-700">Operator Special Instructions</p>
                      <span className="text-dark fs-7 d-block mt-1">{formData.specialInstructions}</span>
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>

          {/* Dialog Action Footer */}
          <div className="modal-footer px-5 py-3.5 bg-light border-top d-flex justify-content-between align-items-center">
            
            {/* Cancel ghost button */}
            <button
              type="button"
              className="btn btn-link text-secondary text-decoration-none shadow-none fw-semibold fs-7 p-2 transition-click"
              onClick={() => onOpenChange(false)}
              data-testid="tour-cancel"
            >
              Cancel
            </button>

            {/* Navigation buttons */}
            <div className="d-flex align-items-center gap-2">
              {step > 1 && (
                <button
                  type="button"
                  className="btn btn-outline-secondary d-flex align-items-center gap-1.5 px-3.5 py-2.5 rounded-xl border bg-white text-dark fs-7 fw-semibold hover-shadow transition-click shadow-none"
                  onClick={handleBackStep}
                  data-testid="tour-back"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center gap-1.5 px-4 py-2.5 rounded-xl border-0 fs-7 fw-semibold shadow-sm transition-click"
                  onClick={handleNextStep}
                  data-testid="tour-next"
                >
                  <span>Next</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-outline-primary px-3.5 py-2.5 rounded-xl border fs-7 fw-bold hover-shadow transition-click shadow-none bg-white"
                    onClick={handleSaveAndRequest}
                    data-testid="tour-save-request"
                  >
                    Save & Request
                  </button>

                  <button
                    type="button"
                    className={`btn btn-primary px-4 py-2.5 rounded-xl border-0 fs-7 fw-semibold shadow-sm transition-click`}
                    onClick={() => handleFinish()}
                    data-testid={initialTour ? "tour-save-edit" : "tour-create"}
                  >
                    {initialTour ? "Save changes" : "Create tour"}
                  </button>
                </>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Embedded Email compose overlay wrapper */}
      <EmailComposeModal
        open={showEmailModal}
        onOpenChange={setShowEmailModal}
        tour={formData}
        hotelRequest={activeRequestRow}
        hotels={hotels}
        onSend={(payload) => {
          if (onSendEmail) {
            onSendEmail(payload);
          }
          // Set workflow state to emails sent
          handleUpdateField("workflowStatus", "Emails Sent");
        }}
      />
    </div>
  );
}
