import React, { useState, useEffect } from "react";
import { X, Calendar, User, Truck, MapPin, Mail, ArrowLeft, ArrowRight, Check, Info, Plane, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Helper to generate next sequential file number
function generateNextFileNumber(existingTours) {
  if (!existingTours || existingTours.length === 0) {
    return "RT-01";
  }

  const ids = existingTours.map(t => t.id).filter(Boolean);
  
  // Try to find if there is a match with RT-YYYY-XXX (e.g. RT-2026-007)
  let maxNum = -1;
  let matchesThreePartsSymbol = false;
  let yearStr = "2026";
  
  for (const id of ids) {
    const matchThree = id.match(/^RT-(\d{4})-(\d+)$/);
    if (matchThree) {
      matchesThreePartsSymbol = true;
      yearStr = matchThree[1];
      const val = parseInt(matchThree[2], 10);
      if (val > maxNum) maxNum = val;
    }
  }

  if (matchesThreePartsSymbol && maxNum !== -1) {
    return `RT-${yearStr}-${String(maxNum + 1).padStart(3, '0')}`;
  }

  // Check double parts (e.g. RT-2406 or RT-01)
  maxNum = -1;
  let matchesTwoPartsSymbol = false;
  let prefix = "RT-";
  
  for (const id of ids) {
    const matchTwo = id.match(/^RT-(\d+)$/i) || id.match(/^RT(\d+)$/i);
    if (matchTwo) {
      matchesTwoPartsSymbol = true;
      const separator = id.includes("-") ? "-" : "";
      prefix = `RT${separator}`;
      const val = parseInt(matchTwo[1], 10);
      if (val > maxNum) maxNum = val;
    }
  }

  if (matchesTwoPartsSymbol && maxNum !== -1) {
    const matchingId = ids.find(id => id.startsWith(prefix));
    const len = matchingId ? matchingId.slice(prefix.length).length : 2;
    return `${prefix}${String(maxNum + 1).padStart(len, '0')}`;
  }

  // Fallback to matching any ending digits
  maxNum = -1;
  for (const id of ids) {
    const matchGeneric = id.match(/\d+$/);
    if (matchGeneric) {
      const val = parseInt(matchGeneric[0], 10);
      if (val > maxNum) maxNum = val;
    }
  }
  
  if (maxNum !== -1) {
    return `RT-${maxNum + 1}`;
  }

  return "RT-01";
}

function AddTourWizard({ isOpen, onClose, onSave, cities = [], tours = [] }) {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Custom list of cities if empty
  const citiesList = cities.length > 0 ? cities : [
    { id: "c-jaipur", name: "Jaipur", code: "JAI" },
    { id: "c-goa", name: "Goa", code: "GOI" },
    { id: "c-manali", name: "Manali", code: "MNL" },
    { id: "c-udaipur", name: "Udaipur", code: "UDR" },
    { id: "c-munnar", name: "Munnar", code: "COK" }
  ];

  // Default itinerary row template
  const createItineraryRow = (index = 1) => ({
    id: Date.now() + index + Math.random(),
    arrivalDate: new Date().toISOString().split("T")[0],
    departureDate: new Date(Date.now() + 86450000).toISOString().split("T")[0], // default 1 day
    cityId: "",
    nights: 1,
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

  // State for all form fields
  const [formData, setFormData] = useState({
    // Step 1: Client & File
    fileNumber: "RT-01",
    tourName: "",
    bookingDate: new Date().toISOString().split("T")[0],
    receivedOn: new Date().toISOString().split("T")[0],
    clientName: "",
    clientNationality: "Indian",
    clientEmail: "",
    clientPhone: "",
    agentName: "Direct Client",

    // Step 2: Vehicle & Guide
    vehicleType: "Sedan",
    guideRequired: false,
    guideLanguage: "English",
    sglCount: 0,
    dblCount: 0,
    tplCount: 0,
    mealPlan: "CP — Breakfast",
    monumentFeesIncluded: false,
    monumentFees: "",

    // Step 3: Trip Plan
    itinerary: [],
    transitSegments: []
  });

  const [errors, setErrors] = useState({});
  const [sentMails, setSentMails] = useState({});

  // Initialize first row when component opens
  useEffect(() => {
    if (isOpen) {
      const nextFileNo = generateNextFileNumber(tours);
      setFormData({
        fileNumber: nextFileNo,
        tourName: "",
        bookingDate: new Date().toISOString().split("T")[0],
        receivedOn: new Date().toISOString().split("T")[0],
        clientName: "",
        clientNationality: "Indian",
        clientEmail: "",
        clientPhone: "",
        agentName: "Direct Client",
        vehicleType: "Sedan",
        guideRequired: false,
        guideLanguage: "English",
        sglCount: 0,
        dblCount: 0,
        tplCount: 0,
        mealPlan: "CP — Breakfast",
        monumentFeesIncluded: false,
        monumentFees: "",
        itinerary: [createItineraryRow(1)],
        transitSegments: []
      });
      setSentMails({});
      setErrors({});
      setCurrentStep(1);
    }
  }, [isOpen]);

  // Auto-calculate nights when dates change in itinerary rows
  const updateItineraryRow = (index, field, value) => {
    const updatedItinerary = [...formData.itinerary];
    updatedItinerary[index][field] = value;

    if (field === "arrivalDate" || field === "departureDate") {
      const arr = new Date(updatedItinerary[index].arrivalDate);
      const dep = new Date(updatedItinerary[index].departureDate);
      if (!isNaN(arr) && !isNaN(dep) && dep > arr) {
        const diffTime = Math.abs(dep - arr);
        updatedItinerary[index].nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      } else {
        updatedItinerary[index].nights = 0;
      }
    }
    
    setFormData({ ...formData, itinerary: updatedItinerary });
  };

  const addItineraryRow = () => {
    const lastRow = formData.itinerary[formData.itinerary.length - 1];
    const newArrival = lastRow ? lastRow.departureDate : new Date().toISOString().split("T")[0];
    const newDeparture = new Date(new Date(newArrival).getTime() + 86400000 * 3).toISOString().split("T")[0];
    
    setFormData({
      ...formData,
      itinerary: [
        ...formData.itinerary,
        {
          id: Date.now() + Math.random(),
          arrivalDate: newArrival,
          departureDate: newDeparture,
          cityId: citiesList[0]?.id || "",
          nights: 3,
          sglCount: 0,
          dblCount: 1,
          tplCount: 0,
          mealPlan: "CP - Breakfast",
          transport: "Car",
          carrierNo: "AI-987",
          hotelId: "Taj Rambagh Palace",
          roomType: "deluxe",
          status: "OK",
          remarks: "Notes"
        }
      ]
    });
  };

  const removeItineraryRow = (index) => {
    if (formData.itinerary.length > 1) {
      const updated = formData.itinerary.filter((_, i) => i !== index);
      setFormData({ ...formData, itinerary: updated });
    }
  };

  // Transit segments handlers
  const addTransitSegment = () => {
    setFormData({
      ...formData,
      transitSegments: [
        ...formData.transitSegments,
        {
          id: Date.now() + Math.random(),
          date: new Date().toISOString().split("T")[0],
          fromCity: "",
          toCity: "",
          mode: "Flight",
          carrierNo: "AI-987 / 12559",
          depTime: "15:00"
        }
      ]
    });
  };

  const updateTransitSegment = (index, field, value) => {
    const updated = [...formData.transitSegments];
    updated[index][field] = value;
    setFormData({ ...formData, transitSegments: updated });
  };

  const removeTransitSegment = (index) => {
    const updated = formData.transitSegments.filter((_, i) => i !== index);
    setFormData({ ...formData, transitSegments: updated });
  };

  const validateStep = (step) => {
    const stepErrors = {};
    if (step === 1) {
      if (!formData.tourName.trim()) stepErrors.tourName = "Tour Name is required";
      if (!formData.clientName.trim()) stepErrors.clientName = "Client Name is required";
      if (!formData.clientEmail.trim()) {
        stepErrors.clientEmail = "Client Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
        stepErrors.clientEmail = "Valid email address is required";
      }
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSendMail = (hotelName, index) => {
    setSentMails(prev => ({ ...prev, [index]: true }));
    toast.success(`Request mail successfully sent to ${hotelName} reservations!`);
  };

  const handleFinish = (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    const firstItin = formData.itinerary[0];
    const lastItin = formData.itinerary[formData.itinerary.length - 1];

    const packageData = {
      id: formData.fileNumber,
      clientName: formData.clientName || "Rahul Sharma",
      phone: formData.clientPhone || "9876543210",
      email: formData.clientEmail || "rahul@gmail.com",
      travelers: (formData.sglCount || 0) + (formData.dblCount * 2) + (formData.tplCount * 3) || 4,
      startDate: firstItin ? firstItin.arrivalDate : formData.bookingDate,
      endDate: lastItin ? lastItin.departureDate : formData.bookingDate,
      type: formData.vehicleType + " Tour",
      status: "planning",
      destinations: formData.itinerary.map(item => ({ cityId: item.cityId, nights: item.nights })),
      hotels: formData.itinerary.map(item => item.hotelId).filter(Boolean)
    };

    onSave(packageData);
    toast.success(`Tour Package ${packageData.id} created successfully!`);
    onClose();
    setCurrentStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(15, 23, 42, 0.4)", zIndex: 1050 }}>
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-2xl overflow-hidden bg-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
          
          {/* Header */}
          <div className="px-5 py-4 border-bottom bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h3 className="modal-title font-display fw-bold text-dark m-0 fs-4">
                  Create Tour
                </h3>
                <span className="text-secondary fs-7 mt-1 d-block">
                  Build a complete itinerary in 6 quick steps. File No <span className="text-primary font-monospace fw-bold">{formData.fileNumber}</span>
                </span>
              </div>
              <button type="button" className="btn-close shadow-none border-0 bg-transparent text-secondary p-1" onClick={onClose} aria-label="Close">
                <X size={22} />
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="d-flex align-items-center gap-3 mt-4 overflow-auto py-1">
              {[
                { num: 1, label: "Step 1 · Client & File" },
                { num: 2, label: "Step 2 · Vehicle & Guide" },
                { num: 3, label: "Step 3 · Trip Plan" },
                { num: 4, label: "Step 4 · Hotel Requests" }
              ].map((step) => {
                const isCompleted = currentStep > step.num;
                const isActive = currentStep === step.num;
                
                return (
                  <div key={step.num} className="d-flex align-items-center gap-2 flex-shrink-0">
                    <span
                      className={`badge rounded-full px-3 py-2 fs-7 d-flex align-items-center gap-1.5 fw-semibold ${
                        isCompleted
                          ? "bg-success bg-opacity-10 text-success border border-success-subtle"
                          : isActive
                          ? "bg-primary text-white"
                          : "bg-light text-secondary border border-light-subtle"
                      }`}
                    >
                      {isCompleted && <Check size={14} />}
                      {step.label}
                    </span>
                    {step.num < 4 && <div className="border-top" style={{ width: "24px", borderColor: "hsl(214 20% 90%)" }}></div>}
                  </div>
                );
              })}
            </div>
            
            {/* Progress line */}
            <div className="w-100 bg-light rounded-pill mt-3" style={{ height: "6px" }}>
              <div className="bg-primary bg-opacity-25 rounded-pill transition-all duration-300" style={{ height: "6px", width: `${(currentStep / 4) * 100}%`, backgroundColor: "#2563EB" }}></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="modal-body p-5 bg-tours-light overflow-auto" style={{ maxHeight: "65vh" }}>
            
            {/* Step 1: Client & File */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="row g-4">
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label fw-bold text-dark fs-7">File Number</label>
                    <input type="text" className="form-control bg-light fs-7 px-3 py-2.5 border shadow-none" value={formData.fileNumber} readOnly />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label fw-bold text-dark fs-7">Tour Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className={`form-control fs-7 px-3 py-2.5 border shadow-none ${errors.tourName ? "is-invalid" : ""}`}
                      placeholder="e.g. Rajasthan Heritage Expedition"
                      value={formData.tourName}
                      onChange={(e) => setFormData({ ...formData, tourName: e.target.value })}
                    />
                    {errors.tourName && <div className="invalid-feedback">{errors.tourName}</div>}
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label fw-bold text-dark fs-7">Booking Date</label>
                    <input
                      type="date"
                      className="form-control fs-7 px-3 py-2.5 border shadow-none"
                      value={formData.bookingDate}
                      onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label fw-bold text-dark fs-7">Received On</label>
                    <input
                      type="date"
                      className="form-control fs-7 px-3 py-2.5 border shadow-none"
                      value={formData.receivedOn}
                      onChange={(e) => setFormData({ ...formData, receivedOn: e.target.value })}
                    />
                  </div>
                </div>

                <div className="card border-soft p-4 rounded-xl bg-white shadow-none mt-4 border-0">
                  <h6 className="font-display fw-bold text-primary mb-3">Client Details</h6>
                  <div className="row g-4">
                    <div className="col-md-6 col-lg-3">
                      <label className="form-label fw-bold text-dark fs-7">Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control fs-7 px-3 py-2.5 border shadow-none ${errors.clientName ? "is-invalid" : ""}`}
                        placeholder="Lead traveler name"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      />
                      {errors.clientName && <div className="invalid-feedback">{errors.clientName}</div>}
                    </div>
                    <div className="col-md-6 col-lg-3">
                      <label className="form-label fw-bold text-dark fs-7">Nationality</label>
                      <select
                        className="form-select fs-7 px-3 py-2.5 border select shadow-none"
                        value={formData.clientNationality}
                        onChange={(e) => setFormData({ ...formData, clientNationality: e.target.value })}
                      >
                        <option value="Indian">Indian</option>
                        <option value="American">American</option>
                        <option value="British">British</option>
                        <option value="German">German</option>
                        <option value="Russian">Russian</option>
                      </select>
                    </div>
                    <div className="col-md-6 col-lg-3">
                      <label className="form-label fw-bold text-dark fs-7">Email <span className="text-danger">*</span></label>
                      <input
                        type="email"
                        className={`form-control fs-7 px-3 py-2.5 border shadow-none ${errors.clientEmail ? "is-invalid" : ""}`}
                        placeholder="client@email.com"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      />
                      {errors.clientEmail && <div className="invalid-feedback">{errors.clientEmail}</div>}
                    </div>
                    <div className="col-md-6 col-lg-3">
                      <label className="form-label fw-bold text-dark fs-7">Phone</label>
                      <input
                        type="text"
                        className="form-control fs-7 px-3 py-2.5 border shadow-none"
                        placeholder="e.g. +91 99887 76655"
                        value={formData.clientPhone}
                        onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-dark fs-7">Agent/Agency Selection</label>
                    <select
                      className="form-select fs-7 px-3 py-2.5 border select shadow-none"
                      value={formData.agentName}
                      onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                    >
                      <option value="Direct Client">Direct Client (No Agent)</option>
                      <option value="MakeMyTrip">MakeMyTrip Agents</option>
                      <option value="Thomas Cook">Thomas Cook India</option>
                      <option value="SOTC Travels">SOTC Travels</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Vehicle & Guide */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-dark fs-7">Vehicle type</label>
                    <select
                      className="form-select fs-7 px-3 py-2.5 border select shadow-none"
                      value={formData.vehicleType}
                      onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    >
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Coach">Coach</option>
                      <option value="Luxury Sedan">Luxury Sedan</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <div className="card border-soft p-4 rounded-xl bg-white shadow-none h-100 border-0">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <label className="form-label fw-bold text-dark fs-7 m-0">Guide required</label>
                          <span className="text-secondary fs-8 d-block">Local tour guide with the group</span>
                        </div>
                        <div className="form-check form-switch p-0 m-0">
                          <input
                            className="form-check-input shadow-none"
                            type="checkbox"
                            role="switch"
                            style={{ width: "2.4em", height: "1.2em", cursor: "pointer" }}
                            checked={formData.guideRequired}
                            onChange={(e) => setFormData({ ...formData, guideRequired: e.target.checked })}
                          />
                        </div>
                      </div>

                      {formData.guideRequired && (
                        <div>
                          <label className="form-label fw-bold text-secondary fs-8 mb-1">Guide language</label>
                          <select
                            className="form-select fs-7 px-3 py-2 border select shadow-none"
                            value={formData.guideLanguage}
                            onChange={(e) => setFormData({ ...formData, guideLanguage: e.target.value })}
                          >
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-uppercase tracking-widest fw-bold text-secondary fs-8 mb-2 d-block">ROOM REQUIREMENT</span>
                  <div className="row g-3">
                    <div className="col-6 col-md-3">
                      <label className="form-label fw-semibold text-dark fs-7">SGL (Single)</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control fs-7 px-3 py-2 border shadow-none"
                        value={formData.sglCount}
                        onChange={(e) => setFormData({ ...formData, sglCount: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-6 col-md-3">
                      <label className="form-label fw-semibold text-dark fs-7">DBL (Double)</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control fs-7 px-3 py-2 border shadow-none"
                        value={formData.dblCount}
                        onChange={(e) => setFormData({ ...formData, dblCount: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-6 col-md-3">
                      <label className="form-label fw-semibold text-dark fs-7">TPL (Triple)</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control fs-7 px-3 py-2 border shadow-none"
                        value={formData.tplCount}
                        onChange={(e) => setFormData({ ...formData, tplCount: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-6 col-md-3">
                      <label className="form-label fw-semibold text-dark fs-7">Meal Plan</label>
                      <select
                        className="form-select fs-7 px-3 py-2 border select shadow-none"
                        value={formData.mealPlan}
                        onChange={(e) => setFormData({ ...formData, mealPlan: e.target.value })}
                      >
                        <option value="CP — Breakfast">CP — Breakfast</option>
                        <option value="MAP — Breakfast & Dinner">MAP — Breakfast & Dinner</option>
                        <option value="AP — All Meals">AP — All Meals</option>
                        <option value="EP — Room Only">EP — Room Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="card border-soft p-4 rounded-xl bg-white shadow-none mt-4 border-0">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h6 className="font-display fw-bold text-dark m-0 fs-7">Monument fees included</h6>
                      <span className="text-secondary fs-8 d-block">List monuments where fees are covered</span>
                    </div>
                    <div className="form-check form-switch p-0 m-0">
                      <input
                        className="form-check-input shadow-none"
                        type="checkbox"
                        role="switch"
                        style={{ width: "2.4em", height: "1.2em", cursor: "pointer" }}
                        checked={formData.monumentFeesIncluded}
                        onChange={(e) => setFormData({ ...formData, monumentFeesIncluded: e.target.checked })}
                      />
                    </div>
                  </div>

                  {formData.monumentFeesIncluded && (
                    <textarea
                      className="form-control fs-7 px-3 py-2.5 border shadow-none font-monospace bg-light"
                      rows="3"
                      value={formData.monumentFees}
                      placeholder="e.g. Amber Fort, Taj Mahal, Qutub Minar..."
                      onChange={(e) => setFormData({ ...formData, monumentFees: e.target.value })}
                    ></textarea>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Trip Plan */}
            {currentStep === 3 && (
              <div className="space-y-6">
                
                {/* Domestic Air / Train Section */}
                <div className="card border-soft p-4 rounded-xl bg-white shadow-none border-0 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="font-display fw-bold text-dark fs-6 d-flex align-items-center gap-2">
                      <Plane size={18} className="text-primary" /> Domestic Air / Train
                    </span>
                    <button type="button" className="btn btn-outline-secondary btn-sm px-3 rounded-lg py-1.5 fs-7 fw-semibold border bg-white text-dark d-flex align-items-center gap-1 hover-shadow" onClick={addTransitSegment}>
                      <Plus size={14} /> Add segment
                    </button>
                  </div>
                  
                  <div className="table-responsive">
                    <table className="table align-middle m-0 fs-7">
                      <thead>
                        <tr className="text-secondary text-uppercase fs-8 border-bottom">
                          <th style={{ width: "20%" }} className="py-2 px-1 fw-bold">Date</th>
                          <th style={{ width: "20%" }} className="py-2 px-1 fw-bold">From</th>
                          <th style={{ width: "20%" }} className="py-2 px-1 fw-bold">To</th>
                          <th style={{ width: "15%" }} className="py-2 px-1 fw-bold">By</th>
                          <th style={{ width: "15%" }} className="py-2 px-1 fw-bold">Flight/Train No</th>
                          <th style={{ width: "15%" }} className="py-2 px-1 fw-bold">Departure</th>
                          <th style={{ width: "5%" }} className="py-2 px-1 text-end"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.transitSegments.map((seg, idx) => (
                          <tr key={seg.id} className="border-bottom-0">
                            <td className="py-2 px-1">
                              <input
                                type="date"
                                className="form-control form-control-sm py-1.5 border shadow-none fs-7"
                                value={seg.date}
                                onChange={(e) => updateTransitSegment(idx, "date", e.target.value)}
                              />
                            </td>
                            <td className="py-2 px-1">
                              <input
                                type="text"
                                className="form-control form-control-sm py-1.5 border shadow-none fs-7"
                                placeholder="From"
                                value={seg.fromCity}
                                onChange={(e) => updateTransitSegment(idx, "fromCity", e.target.value)}
                              />
                            </td>
                            <td className="py-2 px-1">
                              <input
                                type="text"
                                className="form-control form-control-sm py-1.5 border shadow-none fs-7"
                                placeholder="To"
                                value={seg.toCity}
                                onChange={(e) => updateTransitSegment(idx, "toCity", e.target.value)}
                              />
                            </td>
                            <td className="py-2 px-1">
                              <select
                                className="form-select form-select-sm py-1.5 border select shadow-none fs-7"
                                value={seg.mode}
                                onChange={(e) => updateTransitSegment(idx, "mode", e.target.value)}
                              >
                                <option value="Flight">Flight</option>
                                <option value="Train">Train</option>
                                <option value="Bus">Bus</option>
                              </select>
                            </td>
                            <td className="py-2 px-1">
                              <input
                                type="text"
                                className="form-control form-control-sm py-1.5 border shadow-none fs-7"
                                placeholder="Carrier No"
                                value={seg.carrierNo}
                                onChange={(e) => updateTransitSegment(idx, "carrierNo", e.target.value)}
                              />
                            </td>
                            <td className="py-2 px-1">
                              <input
                                type="text"
                                className="form-control form-control-sm py-1.5 border shadow-none fs-7 text-center"
                                placeholder="15:00"
                                value={seg.depTime}
                                onChange={(e) => updateTransitSegment(idx, "depTime", e.target.value)}
                              />
                            </td>
                            <td className="py-2 px-1 text-end">
                              <button
                                type="button"
                                className="btn btn-sm btn-link border-0 text-danger p-1"
                                onClick={() => removeTransitSegment(idx)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Itinerary Section */}
                <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
                  <div>
                    <h5 className="font-display fw-bold text-dark m-0 fs-5">Trip Plan</h5>
                    <span className="text-secondary fs-8 d-block mt-0.5">Add rows for each city / stay. Hotels are filtered by the selected city.</span>
                  </div>
                  <button type="button" className="btn btn-outline-secondary btn-sm px-3 rounded-lg py-1.5 fs-7 fw-semibold border bg-white text-dark d-flex align-items-center gap-1 hover-shadow" onClick={addItineraryRow}>
                    <Plus size={14} /> Add row
                  </button>
                </div>
                
                <div className="table-responsive bg-white rounded-xl border-soft p-2 mb-3 shadow-sm border-0 overflow-auto" style={{ maxWidth: "100%" }}>
                  <table className="table table-hover align-middle m-0 fs-7" style={{ minWidth: "1400px" }}>
                    <thead>
                      <tr className="text-secondary text-uppercase fs-8 border-bottom">
                        <th style={{ width: "3%" }} className="py-2.5 px-2">S.No</th>
                        <th style={{ width: "12%" }} className="py-2.5 px-2">Arrival</th>
                        <th style={{ width: "12%" }} className="py-2.5 px-2">Departure</th>
                        <th style={{ width: "11%" }} className="py-2.5 px-2">City</th>
                        <th style={{ width: "5%" }} className="py-2.5 px-2 text-center">Nights</th>
                        <th style={{ width: "5%" }} className="py-2.5 px-2 text-center">SGL</th>
                        <th style={{ width: "5%" }} className="py-2.5 px-2 text-center">DBL</th>
                        <th style={{ width: "5%" }} className="py-2.5 px-2 text-center">TPL</th>
                        <th style={{ width: "10%" }} className="py-2.5 px-2">Meal Plan</th>
                        <th style={{ width: "8%" }} className="py-2.5 px-2">Transport</th>
                        <th style={{ width: "8%" }} className="py-2.5 px-2">Flight/Train</th>
                        <th style={{ width: "16%" }} className="py-2.5 px-2">Hotel</th>
                        <th style={{ width: "8%" }} className="py-2.5 px-2">Room</th>
                        <th style={{ width: "8%" }} className="py-2.5 px-2">Status</th>
                        <th style={{ width: "10%" }} className="py-2.5 px-2">Remarks</th>
                        <th style={{ width: "4%" }} className="py-2.5 px-2 text-end"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.itinerary.map((row, index) => (
                        <tr key={row.id}>
                          <td className="px-2 fw-semibold text-secondary text-center">{index + 1}</td>
                          <td className="px-1">
                            <input
                              type="date"
                              className="form-control form-control-sm py-1.5 border shadow-none fs-7"
                              value={row.arrivalDate}
                              onChange={(e) => updateItineraryRow(index, "arrivalDate", e.target.value)}
                            />
                          </td>
                          <td className="px-1">
                            <input
                              type="date"
                              className="form-control form-control-sm py-1.5 border shadow-none fs-7"
                              value={row.departureDate}
                              onChange={(e) => updateItineraryRow(index, "departureDate", e.target.value)}
                            />
                          </td>
                          <td className="px-1">
                            <select
                              className="form-select form-select-sm py-1.5 border select shadow-none fs-7"
                              value={row.cityId}
                              onChange={(e) => updateItineraryRow(index, "cityId", e.target.value)}
                            >
                              <option value="">Select City</option>
                              {citiesList.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-1 text-center font-monospace text-dark fw-bold">
                            <span className="badge bg-light text-dark border px-2.5 py-1.5 fs-7">{row.nights}</span>
                          </td>
                          <td className="px-1">
                            <input
                              type="number"
                              min="0"
                              className="form-control form-control-sm text-center py-1.5 border shadow-none fs-7"
                              value={row.sglCount}
                              onChange={(e) => updateItineraryRow(index, "sglCount", Number(e.target.value))}
                            />
                          </td>
                          <td className="px-1">
                            <input
                              type="number"
                              min="0"
                              className="form-control form-control-sm text-center py-1.5 border shadow-none fs-7"
                              value={row.dblCount}
                              onChange={(e) => updateItineraryRow(index, "dblCount", Number(e.target.value))}
                            />
                          </td>
                          <td className="px-1">
                            <input
                              type="number"
                              min="0"
                              className="form-control form-control-sm text-center py-1.5 border shadow-none fs-7"
                              value={row.tplCount}
                              onChange={(e) => updateItineraryRow(index, "tplCount", Number(e.target.value))}
                            />
                          </td>
                          <td className="px-1">
                            <select
                              className="form-select form-select-sm py-1.5 border select shadow-none fs-7"
                              value={row.mealPlan}
                              onChange={(e) => updateItineraryRow(index, "mealPlan", e.target.value)}
                            >
                              <option value="">Select Plan</option>
                              <option value="CP - Breakfast">CP - Breakfast</option>
                              <option value="MAP - Breakfast/Dinner">MAP - Breakfast/Dinner</option>
                              <option value="AP - All Meals">AP - All Meals</option>
                              <option value="EP - Room Only">EP - Room Only</option>
                            </select>
                          </td>
                          <td className="px-1">
                            <select
                              className="form-select form-select-sm py-1.5 border select shadow-none fs-7"
                              value={row.transport}
                              onChange={(e) => updateItineraryRow(index, "transport", e.target.value)}
                            >
                              <option value="Car">Car</option>
                              <option value="Flight">Flight</option>
                              <option value="Train">Train</option>
                            </select>
                          </td>
                          <td className="px-1">
                            <input
                              type="text"
                              className="form-control form-control-sm py-1.5 border shadow-none fs-7"
                              value={row.carrierNo}
                              onChange={(e) => updateItineraryRow(index, "carrierNo", e.target.value)}
                            />
                          </td>
                          <td className="px-1">
                            <select
                              className="form-select form-select-sm py-1.5 border select shadow-none fs-7"
                              value={row.hotelId}
                              onChange={(e) => updateItineraryRow(index, "hotelId", e.target.value)}
                            >
                              <option value="">Select Hotel</option>
                              <option value="Taj Rambagh Palace">Taj Rambagh Palace 5★ Luxury</option>
                              <option value="ITC Rajputana">ITC Rajputana 5★</option>
                              <option value="Taj Lake Palace">Taj Lake Palace 5★ Luxury</option>
                              <option value="The Oberoi Udaivilas">The Oberoi Udaivilas 5★ Luxury</option>
                              <option value="Fragrant Nature Resort">Fragrant Nature Resort 4★</option>
                              <option value="Solang Valley Resort">Solang Valley Resort 4★</option>
                            </select>
                          </td>
                          <td className="px-1">
                            <input
                              type="text"
                              className="form-control form-control-sm py-1.5 border shadow-none fs-7"
                              value={row.roomType}
                              onChange={(e) => updateItineraryRow(index, "roomType", e.target.value)}
                            />
                          </td>
                          <td className="px-1">
                            <select
                              className="form-select form-select-sm py-1.5 border select shadow-none fs-7"
                              value={row.status}
                              onChange={(e) => updateItineraryRow(index, "status", e.target.value)}
                            >
                              <option value="OK">OK</option>
                              <option value="WL">WL</option>
                              <option value="RQ">RQ</option>
                            </select>
                          </td>
                          <td className="px-1">
                            <input
                              type="text"
                              className="form-control form-control-sm py-1.5 border shadow-none fs-7"
                              value={row.remarks}
                              onChange={(e) => updateItineraryRow(index, "remarks", e.target.value)}
                            />
                          </td>
                          <td className="px-2 text-end">
                            <button
                              type="button"
                              className="btn btn-sm btn-link border-0 text-danger p-1"
                              onClick={() => removeItineraryRow(index)}
                              disabled={formData.itinerary.length === 1}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* Step 4: Hotel Requests */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div>
                    <h5 className="font-display fw-bold text-dark m-0 fs-5">Hotel Booking Requests</h5>
                    <span className="text-secondary fs-8 d-block mt-0.5">Auto-generated from the Trip Plan. Set rooms, dates, meal plan and send a request email to each hotel.</span>
                  </div>
                  <span className="text-secondary text-uppercase tracking-wider fw-bold fs-7 pe-2">
                    {formData.itinerary.length} HOTELS
                  </span>
                </div>
                
                <div className="table-responsive bg-white rounded-xl border-soft p-2 mb-3 shadow-sm border-0">
                  <table className="table align-middle m-0 fs-7">
                    <thead>
                      <tr className="text-secondary text-uppercase fs-8 border-bottom">
                        <th className="py-2.5 px-3" style={{ width: "5%" }}>#</th>
                        <th className="py-2.5 px-3" style={{ width: "25%" }}>City / Hotel</th>
                        <th className="py-2.5 px-3" style={{ width: "16%" }}>Check-In</th>
                        <th className="py-2.5 px-3" style={{ width: "16%" }}>Check-Out</th>
                        <th className="py-2.5 px-3 text-center" style={{ width: "8%" }}>Nights</th>
                        <th className="py-2.5 px-3 text-center" style={{ width: "7%" }}>SGL</th>
                        <th className="py-2.5 px-3 text-center" style={{ width: "7%" }}>DBL</th>
                        <th className="py-2.5 px-3 text-center" style={{ width: "7%" }}>TPL</th>
                        <th className="py-2.5 px-3 text-end" style={{ width: "15%" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.itinerary.map((row, index) => {
                        const cityName = citiesList.find(c => c.id === row.cityId)?.name || "Jaipur";
                        return (
                          <tr key={row.id}>
                            <td className="px-3 text-secondary">{index + 1}</td>
                            <td className="px-3">
                              <span className="fw-semibold text-dark d-block">🏢 {row.hotelId}</span>
                              <span className="text-secondary fs-8 mt-0.5 d-block">{cityName}</span>
                            </td>
                            <td className="px-2">
                              <input
                                type="date"
                                className="form-control form-control-sm py-1.5 border shadow-none fs-7 bg-light"
                                value={row.arrivalDate}
                                readOnly
                              />
                            </td>
                            <td className="px-2">
                              <input
                                type="date"
                                className="form-control form-control-sm py-1.5 border shadow-none fs-7 bg-light"
                                value={row.departureDate}
                                readOnly
                              />
                            </td>
                            <td className="px-3 text-center font-monospace">
                              <span className="badge bg-light text-dark border px-2.5 py-1.5 fs-7">{row.nights}</span>
                            </td>
                            <td className="px-3 text-center fw-bold">{row.sglCount}</td>
                            <td className="px-3 text-center fw-bold">{row.dblCount}</td>
                            <td className="px-3 text-center fw-bold">{row.tplCount}</td>
                            <td className="px-3 text-end">
                              <button
                                type="button"
                                className={`btn btn-sm px-3 py-1.5 fw-semibold ${sentMails[index] ? "btn-success border-0 text-white" : "btn-outline-primary"}`}
                                onClick={() => handleSendMail(row.hotelId, index)}
                                disabled={sentMails[index]}
                              >
                                {sentMails[index] ? (
                                  <span className="d-flex align-items-center gap-1"><Check size={12} /> Sent</span>
                                ) : (
                                  "Send Request Mail"
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pro Tip Box */}
                <div className="alert bg-primary bg-opacity-10 text-primary border-0 rounded-2xl d-flex gap-3 align-items-start p-3 mt-4">
                  <Info size={20} className="flex-shrink-0 mt-0.5 text-primary animate-pulse" />
                  <div>
                    <h6 className="alert-heading font-display fw-bold mb-1 fs-7">Pro Tip</h6>
                    <p className="mb-0 fs-8 opacity-90 text-dark">
                      Requests are sent directly to property reservations email pools. Double-check your room configuration counts (SGL, DBL, TPL) in the Trip Plan before finalizing package generation.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer controls layout */}
          <div className="px-5 py-4 bg-light border-top d-flex justify-content-between align-items-center">
            <div>
              <button type="button" className="btn btn-link link-secondary px-0 text-decoration-none shadow-none fw-bold fs-7" onClick={onClose}>
                Cancel
              </button>
            </div>
            
            <div className="d-flex gap-3">
              {currentStep > 1 && (
                <button type="button" className="btn btn-outline-secondary d-flex align-items-center gap-1.5 px-4 py-2 border fs-7 bg-white text-dark shadow-sm" onClick={handleBack}>
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
              )}
              
              {currentStep < 4 ? (
                <button type="button" className="btn btn-primary d-flex align-items-center gap-1.5 px-4 py-2 fs-7 shadow-sm" onClick={handleNext}>
                  <span>Next</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button type="button" className="btn btn-primary px-4 py-2 fs-7 fw-bold shadow-sm" onClick={handleFinish}>
                  Finish & Create Package
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddTourWizard;
