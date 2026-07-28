export const INITIAL_EMAILS = [
  {
    id: "mail-1",
    gmailMessageId: "msg_123456789abc",
    threadId: "thread_taj_rambagh_001",
    hotelId: "h-1",
    hotelName: "Taj Rambagh Palace",
    from: "reservation.rambagh@tajhotels.com",
    to: "admin@rangtravels.com",
    subject: "Re: Jaipur Group Booking Quotation",
    preview: "Dear Team, Thank you for your email. We can offer the following...",
    body: `Dear Team,

Thank you for your email.

We can offer the following for your group:

- 10 x Deluxe Room — INR 14,000 + taxes
- Meal Plan: Breakfast Included
- Availability: 10 Rooms
- Check-in: 15 Aug 2026
- Check-out: 17 Aug 2026

Please let us know if this works for you.

Best regards,
Reservations Team
Taj Rambagh Palace`,
    status: "REPLIED",
    mailbox: "inbox",
    isRead: false,
    isStarred: true,
    receivedAt: "2026-07-28T10:30:00",
    attachments: [
      { name: "Taj_Rambagh_Tariffs_2026.pdf", size: "1.2 MB", type: "pdf" },
      { name: "Group_Booking_T&C.docx", size: "420 KB", type: "doc" }
    ],
    relatedBookingId: "BK-2026-078",
    history: [
      { action: "Email received from Taj Rambagh Palace", timestamp: "2026-07-28 10:30 AM", user: "System" },
      { action: "Booking request created", timestamp: "2026-07-27 02:15 PM", user: "Admin User" }
    ]
  },
  {
    id: "mail-2",
    gmailMessageId: "msg_234567890def",
    threadId: "thread_itc_rajputana_001",
    hotelId: "h-2",
    hotelName: "ITC Rajputana, Jaipur",
    from: "admin@rangtravels.com",
    to: "sales@itcrajputana.com",
    subject: "Jaipur Group Booking Quotation",
    preview: "Dear Team, Please share your best rates for 12 Deluxe Rooms...",
    body: `Dear Team,

Please share your best group tariff rates for 12 Deluxe Rooms for our upcoming group check-in on 10th September 2026. 

Our group size is 24 passengers. Let us know standard policies and cancellation clauses as well.

Regards,
Operations Team
Rang Travels`,
    status: "PENDING",
    mailbox: "sent",
    isRead: true,
    isStarred: false,
    receivedAt: "2026-07-27T14:45:00",
    attachments: [],
    relatedBookingId: "BK-2026-079",
    history: [
      { action: "Booking request email sent by Rang Travels Admin", timestamp: "2026-07-27 02:45 PM", user: "Admin User" }
    ]
  },
  {
    id: "mail-3",
    gmailMessageId: "msg_345678901ghi",
    threadId: "thread_trident_udaipur_001",
    hotelId: "h-3",
    hotelName: "Trident Udaipur",
    from: "reservations.udaipur@tridenthotels.com",
    to: "admin@rangtravels.com",
    subject: "Re: Udaipur Hotel Rates",
    preview: "Dear Team, We are pleased to confirm the availability...",
    body: `Dear Rang Travels Team,

We are pleased to confirm the availability of 8 Premier Garden View Rooms at INR 11,500 + tax per night.

Meal Plan: CP (Breakfast only)
Valid for travel dates: August 18 to August 22, 2026.

Kindly let us know if we should block these rooms for you.

Warm regards,
Reservations Desk
Trident Udaipur`,
    status: "REPLIED",
    mailbox: "inbox",
    isRead: true,
    isStarred: true,
    receivedAt: "2026-07-27T11:20:00",
    attachments: [
      { name: "Udaipur_Trident_Contract_2026.pdf", size: "950 KB", type: "pdf" }
    ],
    relatedBookingId: "BK-2026-080",
    history: [
      { action: "Response received from Trident Udaipur", timestamp: "2026-07-27 11:20 AM", user: "System" },
      { action: "Sent inquiry to Trident Udaipur", timestamp: "2026-07-26 11:00 AM", user: "Admin User" }
    ]
  },
  {
    id: "mail-4",
    gmailMessageId: "msg_456789012jkl",
    threadId: "thread_taj_lake_001",
    hotelId: "h-4",
    hotelName: "Taj Lake Palace, Udaipur",
    from: "admin@rangtravels.com",
    to: "res.lakepalace@tajhotels.com",
    subject: "Udaipur Quotation Request",
    preview: "Dear Reservations Team, Requesting rates for 6 Luxury Rooms...",
    body: `Dear Reservations Team,

Requesting group tariff rates for 6 Luxury Rooms for 3 nights from 12 Oct 2026 to 15 Oct 2026.

Preferred meal plan is half board (MAPAI). We look forward to your quotation.

Thanks,
Rang Travels Ops`,
    status: "PENDING",
    mailbox: "sent",
    isRead: true,
    isStarred: false,
    receivedAt: "2026-07-27T09:15:00",
    attachments: [],
    relatedBookingId: "BK-2026-081",
    history: [
      { action: "Inquiry dispatched to Taj Lake Palace", timestamp: "2026-07-27 09:15 AM", user: "Admin User" }
    ]
  },
  {
    id: "mail-5",
    gmailMessageId: "msg_567890123mno",
    threadId: "thread_oberoi_amarvilas_001",
    hotelId: "h-5",
    hotelName: "The Oberoi Amarvilas, Agra",
    from: "reservations.amarvilas@oberoihotels.com",
    to: "admin@rangtravels.com",
    subject: "Agra Group Booking Quotation",
    preview: "Dear Team, Regarding your request for Agra tours in September...",
    body: `Dear Team,

Regarding your request for Agra group bookings in September, we confirm availability.

Daily package rate for a Deluxe Premier room is INR 28,000 + GST. 
Includes Breakfast, Wi-Fi, and 15% discount on SPA services.

Let us know if you want us to hold these rates until end of this week.

Regards,
Operations Desk
The Oberoi Amarvilas`,
    status: "PENDING",
    mailbox: "inbox",
    isRead: true,
    isStarred: false,
    receivedAt: "2026-07-26T14:10:00",
    attachments: [],
    relatedBookingId: "BK-2026-082",
    history: [
      { action: "Quotation received from Oberoi Amarvilas", timestamp: "2026-07-26 02:10 PM", user: "System" }
    ]
  },
  {
    id: "mail-6",
    gmailMessageId: "msg_678901234pqr",
    threadId: "thread_hyatt_delhi_001",
    hotelId: "h-6",
    hotelName: "Hyatt Regency, Delhi",
    from: "delhi.regency@hyatt.com",
    to: "admin@rangtravels.com",
    subject: "Re: Delhi Stay Confirmation",
    preview: "Dear Rang Travels, Your booking is confirmed. Please find...",
    body: `Dear Rang Travels,

Your booking is officially confirmed. Please find the voucher details and confirmation codes below.

Booking code: HY-DEL-998
Vouchers and booking confirmation vouchers are attached.

Regards,
Hyatt Regency Delhi Front Office`,
    status: "VOUCHER SENT",
    mailbox: "inbox",
    isRead: true,
    isStarred: false,
    receivedAt: "2026-07-25T17:35:00",
    attachments: [
      { name: "Hyatt_Regency_Confirmation.pdf", size: "320 KB", type: "pdf" }
    ],
    relatedBookingId: "BK-2026-083",
    history: [
      { action: "Voucher Confirmed & Shared", timestamp: "2026-07-25 05:35 PM", user: "System" }
    ]
  }
];

export const MOCK_HOTELS_LIST = [
  { id: "h-1", name: "Taj Rambagh Palace" },
  { id: "h-2", name: "ITC Rajputana, Jaipur" },
  { id: "h-3", name: "Trident Udaipur" },
  { id: "h-4", name: "Taj Lake Palace, Udaipur" },
  { id: "h-5", name: "The Oberoi Amarvilas, Agra" },
  { id: "h-6", name: "Hyatt Regency, Delhi" }
];
