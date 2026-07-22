/**
 * Email template for hotel booking requests
 */

export const DEFAULT_EMAIL_TEMPLATE = `Dear Reservations Team at {{hotel.name}},

We would like to request a new tour booking with the following details:

File Number: {{tour.file_no}}
Client Name: {{tour.client_name}} (Nationality: {{tour.nationality}})
Number of Pax: {{tour.pax}}

Booking Specifications:
-------------------------------
City: {{hotel.city}}
Hotel Name: {{hotel.name}}
Check-In Date: {{booking.check_in}}
Check-Out Date: {{booking.check_out}}
Total Nights: {{booking.nights}}
Single Rooms (SGL): {{booking.rooms_single}}
Double Rooms (DBL): {{booking.rooms_double}}
Triple Rooms (TPL): {{booking.rooms_triple}}
Meal Plan: {{booking.meal_plan}}

Remarks/Special Requests:
{{booking.remarks}}

Please verify availability and reply with your rates and confirmation status at your earliest convenience.

Best regards,
{{sender.name}}
Rang Travels Operations Desk`;

export function substituteTemplate(template, data) {
  let content = template || DEFAULT_EMAIL_TEMPLATE;
  const mappings = {
    "{{tour.file_no}}": data.tour?.fileNumber || data.tour?.file_no || "",
    "{{tour.client_name}}": data.tour?.clientName || data.tour?.client_name || "",
    "{{tour.nationality}}": data.tour?.clientNationality || data.tour?.nationality || "",
    "{{tour.pax}}": data.tour?.pax || "",
    "{{hotel.name}}": data.hotel?.name || "",
    "{{hotel.city}}": data.hotel?.city || "",
    "{{booking.check_in}}": data.booking?.check_in || "",
    "{{booking.check_out}}": data.booking?.check_out || "",
    "{{booking.nights}}": data.booking?.nights || "0",
    "{{booking.rooms_single}}": data.booking?.rooms_single || "0",
    "{{booking.rooms_double}}": data.booking?.rooms_double || "0",
    "{{booking.rooms_triple}}": data.booking?.rooms_triple || "0",
    "{{booking.meal_plan}}": data.booking?.meal_plan || "",
    "{{booking.remarks}}": data.booking?.remarks || "No special remarks",
    "{{sender.name}}": data.sender?.name || "Operations Desk"
  };

  Object.entries(mappings).forEach(([key, val]) => {
    content = content.replaceAll(key, String(val) || "");
  });

  return content;
}
