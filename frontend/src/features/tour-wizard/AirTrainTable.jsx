/**
 * AirTrainTable.jsx
 * Air & Train segments manager for Step 3.
 */
import React from "react";
import { Plane, Plus, Trash2 } from "lucide-react";

export default function AirTrainTable({ segments = [], cities = [], onAdd, onUpdate, onRemove }) {
  return (
    <div className="card border rounded-2xl bg-white shadow-sm overflow-hidden mb-4">
      {/* Header */}
      <div className="px-4 py-3 bg-light border-bottom d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2 text-dark font-display fw-bold fs-6">
          <Plane size={18} className="text-primary" />
          <span>Domestic Air / Train Connections</span>
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm px-3 rounded-lg py-1.5 fs-7 fw-semibold border bg-white text-dark d-flex align-items-center gap-1.5 hover-shadow transition-click"
          onClick={onAdd}
          data-testid="btn-add-segment"
        >
          <Plus size={14} />
          <span>Add segment</span>
        </button>
      </div>

      {/* Table Content */}
      <div className="p-3">
        {segments.length === 0 ? (
          <div className="text-center py-4 bg-light rounded-xl border border-dashed text-slate-500 fs-7" style={{ borderStyle: "dashed" }}>
            No flights/trains added. Optional.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle m-0 fs-7 text-dark" style={{ minWidth: "900px" }}>
              <thead>
                <tr className="text-secondary text-uppercase fs-8 border-bottom">
                  <th style={{ width: "15%" }} className="py-2.5 px-2 font-semibold">Date</th>
                  <th style={{ width: "20%" }} className="py-2.5 px-2 font-semibold">From</th>
                  <th style={{ width: "20%" }} className="py-2.5 px-2 font-semibold">To</th>
                  <th style={{ width: "12%" }} className="py-2.5 px-2 font-semibold">By</th>
                  <th style={{ width: "15%" }} className="py-2.5 px-2 font-semibold">Flight/Train No</th>
                  <th style={{ width: "10%" }} className="py-2.5 px-2 font-semibold">Departure</th>
                  <th style={{ width: "15%" }} className="py-2.5 px-2 font-semibold">Remarks</th>
                  <th style={{ width: "3%" }} className="py-2.5 px-2 text-end"></th>
                </tr>
              </thead>
              <tbody>
                {segments.map((seg, idx) => (
                  <tr key={seg.id || idx} className="border-bottom-0">
                    <td className="py-2 px-1">
                      <input
                        type="date"
                        className="form-control form-control-sm py-1.5 border shadow-none fs-7 rounded-lg"
                        value={seg.date || ""}
                        onChange={(e) => onUpdate(idx, "date", e.target.value)}
                        data-testid={`segment-date-${idx}`}
                      />
                    </td>
                    <td className="py-2 px-1">
                      <select
                        className="form-select form-select-sm py-1.5 border select shadow-none fs-7 rounded-lg"
                        value={seg.fromCity || ""}
                        onChange={(e) => onUpdate(idx, "fromCity", e.target.value)}
                        data-testid={`segment-from-${idx}`}
                      >
                        <option value="">Select Origin</option>
                        {cities.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-1">
                      <select
                        className="form-select form-select-sm py-1.5 border select shadow-none fs-7 rounded-lg"
                        value={seg.toCity || ""}
                        onChange={(e) => onUpdate(idx, "toCity", e.target.value)}
                        data-testid={`segment-to-${idx}`}
                      >
                        <option value="">Select Destination</option>
                        {cities.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-1">
                      <select
                        className="form-select form-select-sm py-1.5 border select shadow-none fs-7 rounded-lg"
                        value={seg.mode || "Flight"}
                        onChange={(e) => onUpdate(idx, "mode", e.target.value)}
                        data-testid={`segment-mode-${idx}`}
                      >
                        <option value="Flight">Flight</option>
                        <option value="Train">Train</option>
                        <option value="Coach">Coach</option>
                      </select>
                    </td>
                    <td className="py-2 px-1">
                      <input
                        type="text"
                        className="form-control form-control-sm py-1.5 border shadow-none fs-7 rounded-lg"
                        placeholder="e.g. AI-987"
                        value={seg.carrierNo || ""}
                        onChange={(e) => onUpdate(idx, "carrierNo", e.target.value)}
                        data-testid={`segment-carrier-${idx}`}
                      />
                    </td>
                    <td className="py-2 px-1">
                      <input
                        type="text"
                        className="form-control form-control-sm py-1.5 border shadow-none fs-7 rounded-lg text-center"
                        placeholder="e.g. 15:00"
                        value={seg.depTime || ""}
                        onChange={(e) => onUpdate(idx, "depTime", e.target.value)}
                        data-testid={`segment-dep-${idx}`}
                      />
                    </td>
                    <td className="py-2 px-1">
                      <input
                        type="text"
                        className="form-control form-control-sm py-1.5 border shadow-none fs-7 rounded-lg"
                        placeholder="Bag limits..."
                        value={seg.remarks || ""}
                        onChange={(e) => onUpdate(idx, "remarks", e.target.value)}
                        data-testid={`segment-remarks-${idx}`}
                      />
                    </td>
                    <td className="py-2 px-1 text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-link border-0 text-danger p-1 shadow-none"
                        onClick={() => onRemove(idx)}
                        data-testid={`btn-delete-segment-${idx}`}
                      >
                        <Trash2 size={16} />
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
