const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database...");
  
  // Clear relational tables in dependency order
  await prisma.voucher.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.tour.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.hotel.deleteMany({});
  await prisma.city.deleteMany({});
  await prisma.gmailConnection.deleteMany({});

  // Ensure Admin User exists
  const adminEmail = process.env.ADMIN_EMAIL || "admin@rangtravels.com";
  const adminName = process.env.ADMIN_NAME || "System Admin";
  
  let admin = await prisma.user.findFirst({
    where: { email: adminEmail }
  });

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123", 10);
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        fullName: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN"
      }
    });
    console.log("Admin created successfully!");
  } else {
    console.log("Admin already exists. Updating credentials...");
    await prisma.user.update({
      where: { email: adminEmail },
      data: { password: hashedPassword }
    });
  }

  // Seed Cities
  console.log("Seeding cities...");
  const citiesMap = {};
  const citiesData = [
    { name: "Jaipur", state: "Rajasthan", code: "JAI" },
    { name: "Goa", state: "Goa", code: "GOI" },
    { name: "Manali", state: "Himachal Pradesh", code: "MNL" },
    { name: "Udaipur", state: "Rajasthan", code: "UDR" },
    { name: "Munnar", state: "Kerala", code: "COK" },
    { name: "New Delhi", state: "Delhi", code: "DEL" }
  ];

  for (const c of citiesData) {
    const city = await prisma.city.create({
      data: c
    });
    citiesMap[c.code] = city;
  }
  console.log(`Seeded ${Object.keys(citiesMap).length} cities.`);

  // Seed Clients
  console.log("Seeding clients...");
  const clientsData = [
    { fullName: "Rahul Sharma", phone: "9876543210", email: "rahul@gmail.com", address: "102 Blue Apartments, Mumbai", cityCode: "JAI" },
    { fullName: "Priya Sharma", phone: "9123456789", email: "priya@yahoo.com", address: "54 Green Valley, Pune", cityCode: "GOI" },
    { fullName: "Anil Kumble", phone: "9845012345", email: "anil.kumble@hotmail.com", address: "12/A Cricket Colony, Bangalore", cityCode: "MNL" },
    { fullName: "Siddharth Anand", phone: "9988776655", email: "sid.anand@gmail.com", address: "Director Villa, Film City, Mumbai", cityCode: "UDR" },
    { fullName: "Vikram Malhotra", phone: "9812345670", email: "vikram@malhotra.org", address: "Sector 15, Noida", cityCode: "COK" },
    { fullName: "Karan Johar", phone: "9822334455", email: "karan@dharmaprod.in", address: "Dharma Heights, Bandra, Mumbai", cityCode: "JAI" },
    { fullName: "Aditi Rao", phone: "9876123456", email: "aditi.rao@outlook.com", address: "Road No 4, Banjara Hills, Hyderabad", cityCode: "GOI" },
    { fullName: "Rohan Gupta", phone: "9560123456", email: "rohan.gupta@gmail.com", address: "MG Road, Gurgaon", cityCode: "MNL" },
    { fullName: "Sneha Reddy", phone: "9900112233", email: "sneha.reddy@gmail.com", address: "Whitefield, Bangalore", cityCode: "UDR" },
    { fullName: "Manish Malhotra", phone: "9899112233", email: "manish@couture.com", address: "Juhu, Mumbai", cityCode: "COK" },
    {
      fullName: "MICHELA UCCELLI AND PIERPAOLO PULLINI",
      phone: "+39 333 123456",
      email: "michela.uccelli@gmail.com",
      address: "Milan, Italy",
      cityCode: "DEL"
    }
  ];

  const clientsMap = {};
  for (const c of clientsData) {
    const city = citiesMap[c.cityCode];
    const client = await prisma.client.create({
      data: {
        fullName: c.fullName,
        phone: c.phone,
        email: c.email,
        address: c.address,
        cityId: city.id
      }
    });
    clientsMap[c.phone] = client;
  }
  console.log(`Seeded ${Object.keys(clientsMap).length} clients.`);

  // Seed Tours
  console.log("Seeding tours...");
  const toursData = [
    {
      clientId: clientsMap["9876543210"].id,
      destination: "Goa",
      packageName: "Goa Honeymoon Special",
      travelDate: new Date("2026-05-10"),
      bookingDate: new Date("2026-04-15"),
      numberOfTravelers: 2,
      paymentStatus: "PAID",
      tripStatus: "COMPLETED",
      remarks: "Beautiful beach resort"
    },
    {
      clientId: clientsMap["9876543210"].id,
      destination: "Dubai",
      packageName: "Dubai Luxury Getaway",
      travelDate: new Date("2026-10-12"),
      bookingDate: new Date("2026-07-20"),
      numberOfTravelers: 4,
      paymentStatus: "PARTIAL",
      tripStatus: "UPCOMING",
      remarks: "Wants Burj Khalifa tickets"
    },
    {
      clientId: clientsMap["9123456789"].id,
      destination: "Manali",
      packageName: "Himachal Explorer",
      travelDate: new Date("2026-01-15"),
      bookingDate: new Date("2025-11-20"),
      numberOfTravelers: 3,
      paymentStatus: "UNPAID",
      tripStatus: "CANCELLED",
      remarks: "Cancelled due to snow storms"
    },
    {
      clientId: clientsMap["9123456789"].id,
      destination: "Kerala",
      packageName: "Kerala Backwaters Delight",
      travelDate: new Date("2026-06-05"),
      bookingDate: new Date("2026-04-10"),
      numberOfTravelers: 2,
      paymentStatus: "PAID",
      tripStatus: "COMPLETED",
      remarks: "Loved the houseboat stay"
    },
    {
      clientId: clientsMap["9845012345"].id,
      destination: "Munnar",
      packageName: "Munnar Tea Gardens Tour",
      travelDate: new Date("2026-07-15"),
      bookingDate: new Date("2026-06-01"),
      numberOfTravelers: 5,
      paymentStatus: "PAID",
      tripStatus: "ONGOING",
      remarks: "Currently in Munnar"
    },
    {
      clientId: clientsMap["9988776655"].id,
      destination: "Udaipur",
      packageName: "Royal Udaipur Weekend",
      travelDate: new Date("2026-09-01"),
      bookingDate: new Date("2026-07-10"),
      numberOfTravelers: 6,
      paymentStatus: "PARTIAL",
      tripStatus: "UPCOMING",
      remarks: "Corporate retreat"
    },
    {
      clientId: clientsMap["9812345670"].id,
      destination: "Munnar",
      packageName: "Munnar & Alleppey Combo",
      travelDate: new Date("2026-05-10"),
      bookingDate: new Date("2026-03-20"),
      numberOfTravelers: 2,
      paymentStatus: "PAID",
      tripStatus: "COMPLETED",
      remarks: "Honeymoon couple"
    },
    {
      clientId: clientsMap["9822334455"].id,
      destination: "Jaipur",
      packageName: "Jaipur Heritage Weekend",
      travelDate: new Date("2026-08-15"),
      bookingDate: new Date("2026-07-05"),
      numberOfTravelers: 3,
      paymentStatus: "UNPAID",
      tripStatus: "CANCELLED",
      remarks: "Schedule conflict"
    },
    {
      clientId: clientsMap["9822334455"].id,
      destination: "Goa",
      packageName: "Goa Beach Party Package",
      travelDate: new Date("2026-12-25"),
      bookingDate: new Date("2026-07-22"),
      numberOfTravelers: 8,
      paymentStatus: "PAID",
      tripStatus: "UPCOMING",
      remarks: "Year-end party"
    },
    {
      clientId: clientsMap["9822334455"].id,
      destination: "Dubai",
      packageName: "Dubai Shopping Festival",
      travelDate: new Date("2026-02-10"),
      bookingDate: new Date("2025-12-15"),
      numberOfTravelers: 2,
      paymentStatus: "PAID",
      tripStatus: "COMPLETED",
      remarks: "Excellent shopping tour"
    },
    {
      clientId: clientsMap["9876123456"].id,
      destination: "Jaipur",
      packageName: "Pink City Heritage Tour",
      travelDate: new Date("2026-11-20"),
      bookingDate: new Date("2026-07-27"),
      numberOfTravelers: 2,
      paymentStatus: "PARTIAL",
      tripStatus: "UPCOMING",
      remarks: "Wants local tour guide"
    },
    {
      clientId: clientsMap["9560123456"].id,
      destination: "Manali",
      packageName: "Manali Adventure Sports",
      travelDate: new Date("2026-10-05"),
      bookingDate: new Date("2026-07-18"),
      numberOfTravelers: 4,
      paymentStatus: "UNPAID",
      tripStatus: "UPCOMING",
      remarks: "Requires paragliding bookings"
    },
    {
      clientId: clientsMap["9900112233"].id,
      destination: "Goa",
      packageName: "Goa Premium Resort Stay",
      travelDate: new Date("2026-07-26"),
      bookingDate: new Date("2026-07-01"),
      numberOfTravelers: 2,
      paymentStatus: "PAID",
      tripStatus: "ONGOING",
      remarks: "Requested late check-out"
    },
    {
      clientId: clientsMap["9900112233"].id,
      destination: "Munnar",
      packageName: "Munnar Honeymoon Express",
      travelDate: new Date("2026-04-12"),
      bookingDate: new Date("2026-02-15"),
      numberOfTravelers: 2,
      paymentStatus: "PAID",
      tripStatus: "COMPLETED",
      remarks: "Had a great time"
    },
    {
      clientId: clientsMap["9899112233"].id,
      destination: "Jaipur",
      packageName: "Royal Rajasthan Palace Tour",
      travelDate: new Date("2026-07-28"),
      bookingDate: new Date("2026-07-10"),
      numberOfTravelers: 5,
      paymentStatus: "PAID",
      tripStatus: "ONGOING",
      remarks: "Wants airport luxury transfers"
    },
    {
      clientId: clientsMap["9899112233"].id,
      destination: "Udaipur",
      packageName: "Lake Palace Stay",
      travelDate: new Date("2026-12-30"),
      bookingDate: new Date("2026-07-25"),
      numberOfTravelers: 2,
      paymentStatus: "PARTIAL",
      tripStatus: "UPCOMING",
      remarks: "New Year celebration"
    }
  ];

  for (const t of toursData) {
    await prisma.tour.create({
      data: t
    });
  }
  console.log(`Seeded ${toursData.length} tours.`);

  // Seed Bookings
  console.log("Seeding Bookings...");
  const bookingsData = [
    {
      fileNo: "RT|MS|206|26-27",
      status: "hotel_confirmed",
      clientId: clientsMap["+39 333 123456"].id,
      startDate: new Date("2026-07-30T00:00:00Z"),
      endDate: new Date("2026-07-31T00:00:00Z"),
      travelers: 2,
      hotelName: "DELHI-JAYPEE VASANT CONTINENTAL",
      hotelAddress: "VASANT VIHAR, NEW DELHI - 110057, INDIA",
      hotelPhone: "+91-11-2614 8800, +91-11-4600 8800",
      hotelEmail: "reservations@jaypeevasantcontinental.com",
      roomType: "DELUXE ROOM",
      numberOfRooms: "1 ROOM",
      mealPlan: "ROOM WITH BREAKFAST AND DINNER",
      nationality: "ITALIAN"
    },
    {
      fileNo: "RT-2401",
      status: "planning",
      clientId: clientsMap["9876543210"].id,
      startDate: new Date("2026-10-12T00:00:00Z"),
      endDate: new Date("2026-10-18T00:00:00Z"),
      travelers: 4,
      hotelName: "Taj Rambagh Palace",
      hotelAddress: "Bhawani Singh Rd, Rambagh, Jaipur, Rajasthan 302005",
      hotelPhone: "+91 141 221 1919",
      hotelEmail: "reservations@tajrambagh.com",
      roomType: "Royal Suite",
      numberOfRooms: "2 Rooms",
      mealPlan: "Room Only",
      nationality: "INDIAN"
    },
    {
      fileNo: "RT-2402",
      status: "emails_sent",
      clientId: clientsMap["9123456789"].id,
      startDate: new Date("2026-11-05T00:00:00Z"),
      endDate: new Date("2026-11-12T00:00:00Z"),
      travelers: 2,
      hotelName: "Taj Goa Resort",
      hotelAddress: "Sinquerim, Candolim, Goa 403515",
      hotelPhone: "+91 832 669 4444",
      hotelEmail: "goa.resort@tajhotels.com",
      roomType: "Luxury Bed Room",
      numberOfRooms: "1 Room",
      mealPlan: "ROOM WITH BREAKFAST",
      nationality: "INDIAN"
    },
    {
      fileNo: "RT-2403",
      status: "quotation_received",
      clientId: clientsMap["9845012345"].id,
      startDate: new Date("2026-12-20T00:00:00Z"),
      endDate: new Date("2026-12-27T00:00:00Z"),
      travelers: 5,
      hotelName: "Solang Valley Resort",
      hotelAddress: "Solang Valley, Manali, Himachal Pradesh 175131",
      hotelPhone: "+91 1902 256 123",
      hotelEmail: "info@solangvalleyresort.com",
      roomType: "Deluxe Valley View",
      numberOfRooms: "2 Rooms",
      mealPlan: "ROOM WITH BREAKFAST AND DINNER",
      nationality: "INDIAN"
    },
    {
      fileNo: "RT-2404",
      status: "hotel_confirmed",
      clientId: clientsMap["9988776655"].id,
      startDate: new Date("2026-09-01T00:00:00Z"),
      endDate: new Date("2026-09-05T00:00:00Z"),
      travelers: 6,
      hotelName: "Taj Lake Palace",
      hotelAddress: "Lake Pichola, Udaipur, Rajasthan 313001",
      hotelPhone: "+91 294 242 8800",
      hotelEmail: "res.lakepalace@tajhotels.com",
      roomType: "Luxury Suite",
      numberOfRooms: "3 Rooms",
      mealPlan: "ROOM WITH BREAKFAST",
      nationality: "INDIAN"
    },
    {
      fileNo: "RT-2405",
      status: "completed",
      clientId: clientsMap["9812345670"].id,
      startDate: new Date("2026-05-10T00:00:00Z"),
      endDate: new Date("2026-05-16T00:00:00Z"),
      travelers: 2,
      hotelName: "Fragrant Nature Resort",
      hotelAddress: "Munnar, Kerala 685612",
      hotelPhone: "+91 4865 304 000",
      hotelEmail: "res.munnar@fragrantnature.com",
      roomType: "Tropic Green Room",
      numberOfRooms: "1 Room",
      mealPlan: "ROOM WITH BREAKFAST",
      nationality: "INDIAN"
    },
    {
      fileNo: "RT-2406",
      status: "cancelled",
      clientId: clientsMap["9822334455"].id,
      startDate: new Date("2026-08-15T00:00:00Z"),
      endDate: new Date("2026-08-20T00:00:00Z"),
      travelers: 3,
      hotelName: "ITC Rajputana",
      hotelAddress: "Palace Road, Jaipur, Rajasthan 302006",
      hotelPhone: "+91 141 510 0100",
      hotelEmail: "sales@itcrajputana.com",
      roomType: "Executive Room",
      numberOfRooms: "1 Room",
      mealPlan: "ROOM WITH BREAKFAST",
      nationality: "INDIAN"
    }
  ];

  for (const b of bookingsData) {
    await prisma.booking.create({
      data: b
    });
  }
  console.log(`Seeded ${bookingsData.length} bookings.`);

  console.log("Database seeded successfully with cities, clients, tours, and bookings!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
