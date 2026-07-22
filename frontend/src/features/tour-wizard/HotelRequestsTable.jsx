/**
 * HotelRequestsTable.jsx
 * Hotel booking request management list for Step 4.
 */
import React from "react";
import { Mail, Send } from "lucide-react";

export default function HotelRequestsTable({
  requests = [],
  onUpdateOverride,
  onSendMailClick
}) {
  return (
    <div className="card border rounded-2xl bg-white shadow-sm overflow-hidden mt-4">
      {/* Header */}
      <div className="px-5 py-4 bg-white border-bottom d-flex align-items-center justify-content-between">
        <div>
          <h3 className="font-display fw-bold text-dark m-0 fs-5">Hotel Booking Requests</h3>
          <span className="text-secondary fs-8 d-block mt-0.5">
            Auto-generated from the Trip Plan. Set rooms, dates, meal plan and send a request email to each hotel.
          </span>
        </div>
        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle rounded-full px-3 py-1.5 fs-8 fw-bold">
          {requests.length} hotel{requests.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Body Content */}
      <div className="p-4 bg-light bg-opacity-50">
        {requests.length === 0 ? (
          <div
            className="text-center py-5 border-dashed border-2 rounded-2xl bg-white text-slate-500 fs-7"
            style={{ borderStyle: "dashed", borderColor: "hsl(214 20% 90%)" }}
          >
            Add hotels in the Trip Plan above to generate booking request rows here.
          </div>
        ) : (
          <div className="table-responsive bg-white rounded-xl border p-2 shadow-sm">
            <table className="table align-middle m-0 fs-7 text-dark" style={{ minWidth: "1200px" }}>
              <thead>
                <tr className="text-secondary text-uppercase fs-8 border-bottom">
                  <th style={{ width: "3%" }} className="py-2.5 px-2">#</th>
                  <th style={{ width: "22%" }} className="py-2.5 px-2">City / Hotel</th>
                  <th style={{ width: "11%" }} className="py-2.5 px-2">Check-in</th>
                  <th style={{ width: "11%" }} className="py-2.5 px-2">Check-out</th>
                  <th style={{ width: "6%" }} className="py-2.5 px-2 text-center">Nights</th>
                  <th style={{ width: "6%" }} className="py-2.5 px-2 text-center">SGL</th>
                  <th style={{ width: "6%" }} className="py-2.5 px-2 text-center">DBL</th>
                  <th style={{ width: "6%" }} className="py-2.5 px-2 text-center">TPL</th>
                  <th style={{ width: "10%" }} className="py-2.5 px-2">Meal Plan</th>
                  <th style={{ width: "12%" }} className="py-2.5 px-2">Remarks</th>
                  <th style={{ width: "7%" }} className="py-2.5 px-2 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((row, idx) => (
                  <tr key={row.id}>
                    <td className="px-2 fw-semibold text-secondary">{idx + 1}</td>
                    
                    {/* City / Hotel Title */}
                    <td className="px-2">
                      <div className="fw-semibold text-dark fs-7">{row.hotel}</div>
                      <div className="text-secondary fs-8 opacity-75">{row.city}</div>
                    </td>

                    {/* Check In Date */}
                    <td className="px-1">
                      <input
                        type="date"
                        className="form-control form-control-sm py-1 border shadow-none fs-7 rounded-lg"
                        value={row.check_in || ""}
                        onChange={(e) => onUpdateOverride(row.key, "check_in", e.target.value)}
                      />
                    </td>

                    {/* Check Out Date */}
                    <td className="px-1">
                      <input
                        type="date"
                        className="form-control form-control-sm py-1 border shadow-none fs-7 rounded-lg"
                        value={row.check_out || ""}
                        onChange={(e) => onUpdateOverride(row.key, "check_out", e.target.value)}
                      />
                    </td>

                    {/* Nights counter input */}
                    <td className="px-1 text-center font-monospace">
                      <input
                        type="number"
                        className="form-control form-control-sm text-center py-1 border shadow-none fs-7 rounded-lg no-spin"
                        style={{ width: "60px", display: "inline-block" }}
                        value={row.nights || 0}
                        onChange={(e) => onUpdateOverride(row.key, "nights", Number(e.target.value))}
                      />
                    </td>

                    {/* SGL override input */}
                    <td className="px-1 text-center">
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm text-center py-1 border shadow-none fs-7 rounded-lg no-spin"
                        style={{ width: "60px", display: "inline-block" }}
                        value={row.rooms_single || 0}
                        onChange={(e) => onUpdateOverride(row.key, "rooms_single", Number(e.target.value))}
                        data-testid={`hreq-sgl-${idx}`}
                      />
                    </td>

                    {/* DBL override input */}
                    <td className="px-1 text-center">
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm text-center py-1 border shadow-none fs-7 rounded-lg no-spin"
                        style={{ width: "60px", display: "inline-block" }}
                        value={row.rooms_double || 0}
                        onChange={(e) => onUpdateOverride(row.key, "rooms_double", Number(e.target.value))}
                        data-testid={`hreq-dbl-${idx}`}
                      />
                    </td>

                    {/* TPL override input */}
                    <td className="px-1 text-center">
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm text-center py-1 border shadow-none fs-7 rounded-lg no-spin"
                        style={{ width: "60px", display: "inline-block" }}
                        value={row.rooms_triple || 0}
                        onChange={(e) => onUpdateOverride(row.key, "rooms_triple", Number(e.target.value))}
                        data-testid={`hreq-tpl-${idx}`}
                      />
                    </td>

                    {/* Meal plan override selection */}
                    <td className="px-1">
                      <select
                        className="form-select form-select-sm py-1 border select shadow-none fs-7 rounded-lg"
                        value={row.meal_plan || ""}
                        onChange={(e) => onUpdateOverride(row.key, "meal_plan", e.target.value)}
                      >
                        <option value="">EP</option>
                        <option value="EP - Room Only">EP - Room Only</option>
                        <option value="CP - Breakfast">CP - Breakfast</option>
                        <option value="MAP - Breakfast/Dinner">MAP - Breakfast/Dinner</option>
                        <option value="AP - All Meals">AP - All Meals</option>
                      </select>
                    </td>

                    {/* Remarks input */}
                    <td className="px-1">
                      <input
                        type="text"
                        className="form-control form-control-sm py-1 border shadow-none fs-7 rounded-lg"
                        placeholder="Requests..."
                        value={row.remarks || ""}
                        onChange={(e) => onUpdateOverride(row.key, "remarks", e.target.value)}
                      />
                    </td>

                    {/* Send mail Action */}
                    <td className="px-2 text-end">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm d-flex align-items-center justify-content-center gap-1.5 px-3 py-1.5 rounded-lg border-0 fs-8 fw-semibold shadow-sm transition-click"
                        style={{ whiteSpace: "nowrap" }}
                        onClick={() => onSendMailClick(row, idx)}
                        data-testid={`send-mail-${idx}`}
                      >
                        <Send size={12} />
                        <span>Send Mail →</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
