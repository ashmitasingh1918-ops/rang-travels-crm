/**
 * TripPlanTable.jsx
 * Trip Plan grid with live hotel lists and room counts.
 */
import React from "react";
import { Plus, Trash2, Copy, MapPin, Building, Key } from "lucide-react";

export default function TripPlanTable({
  itinerary = [],
  cities = [],
  hotels = [],
  onUpdateRow,
  onAddRow,
  onRemoveRow,
  onDuplicateRow
}) {

  // Sum total row calculators
  const totalNights = itinerary.reduce((acc, row) => acc + (Number(row.nights) || 0), 0);
  const totalSgl = itinerary.reduce((acc, row) => acc + (Number(row.sglCount) || 0), 0);
  const totalDbl = itinerary.reduce((acc, row) => acc + (Number(row.dblCount) || 0), 0);
  const totalTpl = itinerary.reduce((acc, row) => acc + (Number(row.tplCount) || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header Panel */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div>
          <h3 className="font-display fw-bold text-dark m-0 fs-5">Trip Plan</h3>
          <span className="text-secondary fs-8 d-block mt-0.5">
            Add rows for each city / stay. Hotels are filtered by the selected city.
          </span>
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm px-3 rounded-lg py-1.5 fs-7 fw-semibold border bg-white text-dark d-flex align-items-center gap-1.5 hover-shadow transition-click"
          onClick={onAddRow}
          id="btn-add-trip-row"
          data-testid="btn-add-trip-row"
        >
          <Plus size={14} />
          <span>Add row</span>
        </button>
      </div>

      {/* Responsive Itinerary Table */}
      <div className="table-responsive bg-white rounded-2xl border p-2 mb-3 shadow-none overflow-auto" style={{ maxWidth: "100%" }}>
        <table className="table table-hover align-middle m-0 fs-7 text-dark" style={{ minWidth: "1650px" }}>
          <thead>
            <tr className="text-secondary text-uppercase fs-8 border-bottom">
              <th style={{ width: "3.5%" }} className="py-2.5 px-2 text-center text-secondary">S.No</th>
              <th style={{ width: "10.5%" }} className="py-2.5 px-2">Arrival</th>
              <th style={{ width: "10.5%" }} className="py-2.5 px-2">Departure</th>
              <th style={{ width: "11%" }} className="py-2.5 px-2">City</th>
              <th style={{ width: "5%" }} className="py-2.5 px-2 text-center">Nights</th>
              <th style={{ width: "5%" }} className="py-2.5 px-2 text-center">SGL</th>
              <th style={{ width: "5%" }} className="py-2.5 px-2 text-center">DBL</th>
              <th style={{ width: "5%" }} className="py-2.5 px-2 text-center">TPL</th>
              <th style={{ width: "8.5%" }} className="py-2.5 px-2">Meal Plan</th>
              <th style={{ width: "7.5%" }} className="py-2.5 px-2">Transport</th>
              <th style={{ width: "7.5%" }} className="py-2.5 px-2">Flight/Train</th>
              <th style={{ width: "14%" }} className="py-2.5 px-2">Hotel</th>
              <th style={{ width: "8.5%" }} className="py-2.5 px-2">Room</th>
              <th style={{ width: "7%" }} className="py-2.5 px-2">Status</th>
              <th style={{ width: "9%" }} className="py-2.5 px-2">Remarks</th>
              <th style={{ width: "6%" }} className="py-2.5 px-2 text-end"></th>
            </tr>
          </thead>
          <tbody>
            {itinerary.map((row, index) => {
              // Find matching city info
              const selectedCityObj = cities.find(c => c.id === row.cityId);
              const cityName = selectedCityObj ? selectedCityObj.name : "";

              // Filter Hotels list based on selected City
              const cityHotels = cityName
                ? hotels.filter(h => h.city?.toLowerCase() === cityName.toLowerCase())
                : [];

              return (
                <tr key={row.id}>
                  {/* S.No */}
                  <td className="px-2 fw-semibold text-secondary text-center">{index + 1}</td>
                  
                  {/* Arrival */}
                  <td className="px-1">
                    <input
                      type="date"
                      className="form-control form-control-sm py-1.5 border shadow-none fs-7 rounded-lg"
                      value={row.arrivalDate || ""}
                      onChange={(e) => onUpdateRow(index, "arrivalDate", e.target.value)}
                    />
                  </td>
                  
                  {/* Departure */}
                  <td className="px-1">
                    <input
                      type="date"
                      className="form-control form-control-sm py-1.5 border shadow-none fs-7 rounded-lg"
                      value={row.departureDate || ""}
                      onChange={(e) => onUpdateRow(index, "departureDate", e.target.value)}
                    />
                  </td>
                  
                  {/* City Select */}
                  <td className="px-1">
                    <div className="position-relative">
                      <select
                        className="form-select form-select-sm py-1.5 border select shadow-none fs-7 rounded-lg"
                        value={row.cityId || ""}
                        onChange={(e) => {
                          onUpdateRow(index, "cityId", e.target.value);
                          // Clear hotel since city changed
                          onUpdateRow(index, "hotelId", "");
                        }}
                        data-testid={`trip-city-${index}`}
                      >
                        <option value="">Select City</option>
                        {cities.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  
                  {/* Nights */}
                  <td className="px-1 text-center font-monospace text-dark">
                    <input
                      type="number"
                      className="form-control form-control-sm text-center py-1.5 border shadow-none fs-7 rounded-lg no-spin"
                      style={{ width: "65px", display: "inline-block" }}
                      value={row.nights || 0}
                      onChange={(e) => onUpdateRow(index, "nights", Number(e.target.value))}
                    />
                  </td>
                  
                  {/* SGL inputs - 80px no-spin */}
                  <td className="px-1 text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm text-center py-1.5 border shadow-none fs-7 rounded-lg no-spin"
                      style={{ width: "65px", display: "inline-block" }}
                      value={row.sglCount || 0}
                      onChange={(e) => onUpdateRow(index, "sglCount", Number(e.target.value))}
                      data-testid={`trip-sgl-${index}`}
                    />
                  </td>
                  
                  {/* DBL inputs - 80px no-spin */}
                  <td className="px-1 text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm text-center py-1.5 border shadow-none fs-7 rounded-lg no-spin"
                      style={{ width: "65px", display: "inline-block" }}
                      value={row.dblCount || 0}
                      onChange={(e) => onUpdateRow(index, "dblCount", Number(e.target.value))}
                      data-testid={`trip-dbl-${index}`}
                    />
                  </td>
                  
                  {/* TPL inputs - 80px no-spin */}
                  <td className="px-1 text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm text-center py-1.5 border shadow-none fs-7 rounded-lg no-spin"
                      style={{ width: "65px", display: "inline-block" }}
                      value={row.tplCount || 0}
                      onChange={(e) => onUpdateRow(index, "tplCount", Number(e.target.value))}
                      data-testid={`trip-tpl-${index}`}
                    />
                  </td>
                  
                  {/* Meal Plan Select */}
                  <td className="px-1">
                    <select
                      className="form-select form-select-sm py-1.5 border select shadow-none fs-7 rounded-lg"
                      value={row.mealPlan || ""}
                      onChange={(e) => onUpdateRow(index, "mealPlan", e.target.value)}
                      data-testid={`trip-meal-${index}`}
                    >
                      <option value="">EP</option>
                      <option value="EP - Room Only">EP - Room Only</option>
                      <option value="CP - Breakfast">CP - Breakfast</option>
                      <option value="MAP - Breakfast/Dinner">MAP - Breakfast/Dinner</option>
                      <option value="AP - All Meals">AP - All Meals</option>
                    </select>
                  </td>
                  
                  {/* Transport */}
                  <td className="px-1">
                    <select
                      className="form-select form-select-sm py-1.5 border select shadow-none fs-7 rounded-lg"
                      value={row.transport || "Car"}
                      onChange={(e) => onUpdateRow(index, "transport", e.target.value)}
                    >
                      <option value="Car">Car</option>
                      <option value="Flight">Flight</option>
                      <option value="Train">Train</option>
                    </select>
                  </td>
                  
                  {/* Flight/Train No */}
                  <td className="px-1">
                    <input
                      type="text"
                      className="form-control form-control-sm py-1.5 border shadow-none fs-7 rounded-lg"
                      placeholder="e.g. AI-987"
                      value={row.carrierNo || ""}
                      onChange={(e) => onUpdateRow(index, "carrierNo", e.target.value)}
                    />
                  </td>
                  
                  {/* Hotel Select filter */}
                  <td className="px-1 col-hotel-cell">
                    <select
                      className="form-select form-select-sm py-1.5 border select shadow-none fs-7 rounded-lg"
                      value={row.hotelId || ""}
                      disabled={!row.cityId}
                      onChange={(e) => onUpdateRow(index, "hotelId", e.target.value)}
                      data-testid={`trip-hotel-${index}`}
                    >
                      {!row.cityId ? (
                        <option value="">Select city first</option>
                      ) : (
                        <>
                          <option value="">Select Hotel</option>
                          {cityHotels.map(h => (
                            <option key={h.id} value={h.name}>
                              {h.name} ({h.category || "Standard"})
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    {row.cityId && cityHotels.length === 0 && (
                      <span className="text-danger fs-8 d-block mt-1">
                        No hotels in {cityName} yet.
                      </span>
                    )}
                  </td>
                  
                  {/* Room */}
                  <td className="px-1">
                    <input
                      type="text"
                      className="form-control form-control-sm py-1.5 border shadow-none fs-7 rounded-lg"
                      placeholder="e.g. Deluxe Garden Room"
                      value={row.roomType || ""}
                      onChange={(e) => onUpdateRow(index, "roomType", e.target.value)}
                    />
                  </td>
                  
                  {/* Status */}
                  <td className="px-1">
                    <select
                      className="form-select form-select-sm py-1.5 border select shadow-none fs-7 rounded-lg"
                      value={row.status || "OK"}
                      onChange={(e) => onUpdateRow(index, "status", e.target.value)}
                    >
                      <option value="OK">OK</option>
                      <option value="Pending">Pending</option>
                      <option value="Waitlisted">Waitlisted</option>
                    </select>
                  </td>
                  
                  {/* Remarks */}
                  <td className="px-1">
                    <input
                      type="text"
                      className="form-control form-control-sm py-1.5 border shadow-none fs-7 rounded-lg"
                      value={row.remarks || ""}
                      onChange={(e) => onUpdateRow(index, "remarks", e.target.value)}
                    />
                  </td>
                  
                  {/* Actions (Duplicate, Remove) */}
                  <td className="px-2 text-end">
                    <div className="d-flex align-items-center justify-content-end gap-1.5">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm p-1.5 rounded-lg border-soft hover-shadow transition-click shadow-none"
                        onClick={() => onDuplicateRow(index)}
                        title="Duplicate row"
                        data-testid={`btn-duplicate-row-${index}`}
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-link border-0 text-danger p-1 text-decoration-none shadow-none"
                        disabled={itinerary.length === 1}
                        onClick={() => onRemoveRow(index)}
                        data-testid={`btn-delete-row-${index}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Nice to Have Sum Totals Row */}
            <tr className="bg-light fw-bold text-dark border-top">
              <td colSpan="4" className="text-end py-2 px-3 fw-bold border-0 fs-7">Totals:</td>
              <td className="text-center py-2 px-1 border-0 font-monospace fs-7 bg-slate-50">{totalNights}</td>
              <td className="text-center py-2 px-1 border-0 font-monospace fs-7 bg-slate-50">{totalSgl}</td>
              <td className="text-center py-2 px-1 border-0 font-monospace fs-7 bg-slate-50">{totalDbl}</td>
              <td className="text-center py-2 px-1 border-0 font-monospace fs-7 bg-slate-50">{totalTpl}</td>
              <td colSpan="8" className="border-0"></td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
