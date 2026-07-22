/**
 * Sync hotel requests from trip itinerary plan rows
 */

export function syncHotelRequests(tripPlanRows, existingRequests = [], overrides = {}) {
  // Filter trip plan rows that have both hotelId and cityId selected
  const validRows = (tripPlanRows || []).filter(r => r.cityId && r.hotelId && r.hotelId !== "Select Hotel");
  
  // Group by unique (hotelId, cityId)
  const groups = {};
  validRows.forEach((row) => {
    const key = `${row.hotelId}::${row.cityId}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(row);
  });
  
  return Object.entries(groups).map(([key, rows], idx) => {
    const [hotelId, cityId] = key.split("::");
    
    // Sort grouped items based on arrival date to calculate duration boundaries
    const sorted = [...rows].sort((a, b) => new Date(a.arrivalDate || "") - new Date(b.arrivalDate || ""));
    const firstRow = sorted[0];
    const lastRow = sorted[sorted.length - 1];
    
    const totalNights = sorted.reduce((sum, r) => sum + (Number(r.nights) || 0), 0);
    const rooms_single = firstRow.sglCount !== undefined ? firstRow.sglCount : 0;
    const rooms_double = firstRow.dblCount !== undefined ? firstRow.dblCount : 0;
    const rooms_triple = firstRow.tplCount !== undefined ? firstRow.tplCount : 0;
    const meal_plan = firstRow.mealPlan || "";
    
    const requestKey = `${hotelId}_${cityId}`;
    
    // Look up overrides by the unique key
    const userOverride = overrides[requestKey] || {};
    
    return {
      key: requestKey,
      id: `hreq-row-${idx}-${hotelId.replace(/\s+/g, '-').toLowerCase()}`,
      hotel: hotelId,
      city: cityId,
      check_in: userOverride.check_in !== undefined ? userOverride.check_in : (firstRow.arrivalDate || ""),
      check_out: userOverride.check_out !== undefined ? userOverride.check_out : (lastRow.departureDate || ""),
      nights: userOverride.nights !== undefined ? userOverride.nights : totalNights,
      rooms_single: userOverride.rooms_single !== undefined ? userOverride.rooms_single : rooms_single,
      rooms_double: userOverride.rooms_double !== undefined ? userOverride.rooms_double : rooms_double,
      rooms_triple: userOverride.rooms_triple !== undefined ? userOverride.rooms_triple : rooms_triple,
      meal_plan: userOverride.meal_plan !== undefined ? userOverride.meal_plan : meal_plan,
      remarks: userOverride.remarks !== undefined ? userOverride.remarks : (firstRow.remarks || "")
    };
  });
}
