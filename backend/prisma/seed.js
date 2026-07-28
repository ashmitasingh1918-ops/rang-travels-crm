const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
<<<<<<< HEAD
  console.log("Cleaning database...");
  
  // Clear relational tables in dependency order
  await prisma.tour.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.city.deleteMany({});

  // Ensure Admin User exists
  const adminEmail = process.env.ADMIN_EMAIL || "admin@rangtravels.com";
  const adminName = process.env.ADMIN_NAME || "System Admin";
  
  let admin = await prisma.user.findFirst({
    where: { email: adminEmail }
  });

  if (!admin) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD , 10);
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
    console.log("Admin already exists.");
  }

  // Seed Cities
  console.log("Seeding cities...");
  const cities = [];
  const citiesData = [
    { name: "Jaipur", state: "Rajasthan", code: "JAI" },
    { name: "Goa", state: "Goa", code: "GOI" },
    { name: "Manali", state: "Himachal Pradesh", code: "MNL" },
    { name: "Udaipur", state: "Rajasthan", code: "UDR" },
    { name: "Munnar", state: "Kerala", code: "COK" }
  ];

  for (const c of citiesData) {
    const city = await prisma.city.create({
      data: c
    });
    cities.push(city);
  }
  console.log(`Seeded ${cities.length} cities.`);

  // Seed Clients
  console.log("Seeding clients...");
  const clientsData = [
    { fullName: "Rahul Sharma", phone: "9876543210", email: "rahul@gmail.com", address: "102 Blue Apartments, Mumbai", cityIndex: 0 },
    { fullName: "Priya Sharma", phone: "9123456789", email: "priya@yahoo.com", address: "54 Green Valley, Pune", cityIndex: 1 },
    { fullName: "Anil Kumble", phone: "9845012345", email: "anil.kumble@hotmail.com", address: "12/A Cricket Colony, Bangalore", cityIndex: 2 },
    { fullName: "Siddharth Anand", phone: "9988776655", email: "sid.anand@gmail.com", address: "Director Villa, Film City, Mumbai", cityIndex: 3 },
    { fullName: "Vikram Malhotra", phone: "9812345670", email: "vikram@malhotra.org", address: "Sector 15, Noida", cityIndex: 4 },
    { fullName: "Karan Johar", phone: "9822334455", email: "karan@dharmaprod.in", address: "Dharma Heights, Bandra, Mumbai", cityIndex: 0 },
    { fullName: "Aditi Rao", phone: "9876123456", email: "aditi.rao@outlook.com", address: "Road No 4, Banjara Hills, Hyderabad", cityIndex: 1 },
    { fullName: "Rohan Gupta", phone: "9560123456", email: "rohan.gupta@gmail.com", address: "MG Road, Gurgaon", cityIndex: 2 },
    { fullName: "Sneha Reddy", phone: "9900112233", email: "sneha.reddy@gmail.com", address: "Whitefield, Bangalore", cityIndex: 3 },
    { fullName: "Manish Malhotra", phone: "9899112233", email: "manish@couture.com", address: "Juhu, Mumbai", cityIndex: 4 }
  ];

  const clients = [];
  for (const c of clientsData) {
    const city = cities[c.cityIndex];
    const client = await prisma.client.create({
      data: {
        fullName: c.fullName,
        phone: c.phone,
        email: c.email,
        address: c.address,
        cityId: city.id
      }
    });
    clients.push(client);
  }
  console.log(`Seeded ${clients.length} clients.`);

  // Seed Tours (1 to 3 per client)
  console.log("Seeding tours...");
  const toursData = [
    // Client 0: Rahul Sharma
    {
      clientId: clients[0].id,
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
      clientId: clients[0].id,
      destination: "Dubai",
      packageName: "Dubai Luxury Getaway",
      travelDate: new Date("2026-10-12"),
      bookingDate: new Date("2026-07-20"),
      numberOfTravelers: 4,
      paymentStatus: "PARTIAL",
      tripStatus: "UPCOMING",
      remarks: "Wants Burj Khalifa tickets"
    },
    // Client 1: Priya Sharma
    {
      clientId: clients[1].id,
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
      clientId: clients[1].id,
      destination: "Kerala",
      packageName: "Kerala Backwaters Delight",
      travelDate: new Date("2026-06-05"),
      bookingDate: new Date("2026-04-10"),
      numberOfTravelers: 2,
      paymentStatus: "PAID",
      tripStatus: "COMPLETED",
      remarks: "Loved the houseboat stay"
    },
    // Client 2: Anil Kumble
    {
      clientId: clients[2].id,
      destination: "Munnar",
      packageName: "Munnar Tea Gardens Tour",
      travelDate: new Date("2026-07-15"),
      bookingDate: new Date("2026-06-01"),
      numberOfTravelers: 5,
      paymentStatus: "PAID",
      tripStatus: "ONGOING",
      remarks: "Currently in Munnar"
    },
    // Client 3: Siddharth Anand
    {
      clientId: clients[3].id,
      destination: "Udaipur",
      packageName: "Royal Udaipur Weekend",
      travelDate: new Date("2026-09-01"),
      bookingDate: new Date("2026-07-10"),
      numberOfTravelers: 6,
      paymentStatus: "PARTIAL",
      tripStatus: "UPCOMING",
      remarks: "Corporate retreat"
    },
    // Client 4: Vikram Malhotra
    {
      clientId: clients[4].id,
      destination: "Munnar",
      packageName: "Munnar & Alleppey Combo",
      travelDate: new Date("2026-05-10"),
      bookingDate: new Date("2026-03-20"),
      numberOfTravelers: 2,
      paymentStatus: "PAID",
      tripStatus: "COMPLETED",
      remarks: "Honeymoon couple"
    },
    // Client 5: Karan Johar
    {
      clientId: clients[5].id,
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
      clientId: clients[5].id,
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
      clientId: clients[5].id,
      destination: "Dubai",
      packageName: "Dubai Shopping Festival",
      travelDate: new Date("2026-02-10"),
      bookingDate: new Date("2025-12-15"),
      numberOfTravelers: 2,
      paymentStatus: "PAID",
      tripStatus: "COMPLETED",
      remarks: "Excellent shopping tour"
    },
    // Client 6: Aditi Rao
    {
      clientId: clients[6].id,
      destination: "Jaipur",
      packageName: "Pink City Heritage Tour",
      travelDate: new Date("2026-11-20"),
      bookingDate: new Date("2026-07-27"),
      numberOfTravelers: 2,
      paymentStatus: "PARTIAL",
      tripStatus: "UPCOMING",
      remarks: "Wants local tour guide"
    },
    // Client 7: Rohan Gupta
    {
      clientId: clients[7].id,
      destination: "Manali",
      packageName: "Manali Adventure Sports",
      travelDate: new Date("2026-10-05"),
      bookingDate: new Date("2026-07-18"),
      numberOfTravelers: 4,
      paymentStatus: "UNPAID",
      tripStatus: "UPCOMING",
      remarks: "Requires paragliding bookings"
    },
    // Client 8: Sneha Reddy
    {
      clientId: clients[8].id,
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
      clientId: clients[8].id,
      destination: "Munnar",
      packageName: "Munnar Honeymoon Express",
      travelDate: new Date("2026-04-12"),
      bookingDate: new Date("2026-02-15"),
      numberOfTravelers: 2,
      paymentStatus: "PAID",
      tripStatus: "COMPLETED",
      remarks: "Had a great time"
    },
    // Client 9: Manish Malhotra
    {
      clientId: clients[9].id,
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
      clientId: clients[9].id,
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
=======
    // 1. Seed Admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@rangtravels.com";
    const adminName = process.env.ADMIN_NAME || "System Admin";

    let admin = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || "Admin@123",
        10
    );

    if (admin) {
        console.log("Admin already exists. Updating credentials...");
        admin = await prisma.user.update({
            where: { email: adminEmail },
            data: {
                fullName: adminName,
                password: hashedPassword
            }
        });
    } else {
        admin = await prisma.user.create({
            data: {
                fullName: adminName,
                email: adminEmail,
                password: hashedPassword,
                role: "ADMIN"
            }
        });
        console.log("Admin created successfully!");
    }

    // 2. Seed Cities
    console.log("Seeding Cities...");
    const delhi = await prisma.city.upsert({
        where: { code: "DEL" },
        update: {},
        create: { name: "New Delhi", state: "Delhi", code: "DEL" }
    });

    const jaipur = await prisma.city.upsert({
        where: { code: "JAI" },
        update: {},
        create: { name: "Jaipur", state: "Rajasthan", code: "JAI" }
    });

    const udaipur = await prisma.city.upsert({
        where: { code: "UDR" },
        update: {},
        create: { name: "Udaipur", state: "Rajasthan", code: "UDR" }
    });

    // 3. Seed Client
    console.log("Seeding Client...");
    const client = await prisma.client.upsert({
        where: { phone: "+39 333 123456" },
        update: {},
        create: {
            fullName: "MICHELA UCCELLI AND PIERPAOLO PULLINI",
            phone: "+39 333 123456",
            email: "michela.uccelli@gmail.com",
            address: "Milan, Italy",
            cityId: delhi.id
        }
    });

    const localClient = await prisma.client.upsert({
        where: { phone: "9876543210" },
        update: {},
        create: {
            fullName: "Rahul Sharma",
            phone: "9876543210",
            email: "rahul@gmail.com",
            address: "Malviya Nagar, Jaipur",
            cityId: jaipur.id
        }
    });

    // 4. Seed Bookings
    console.log("Seeding Bookings...");

    // Confirmed booking matching user reference
    await prisma.booking.upsert({
        where: { fileNo: "RT|MS|206|26-27" },
        update: {},
        create: {
            fileNo: "RT|MS|206|26-27",
            status: "hotel_confirmed",
            clientId: client.id,
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
        }
    });

    // Confirmed booking for another client
    await prisma.booking.upsert({
        where: { fileNo: "RT-2404" },
        update: {},
        create: {
            fileNo: "RT-2404",
            status: "hotel_confirmed",
            clientId: localClient.id,
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
        }
    });

    // A planning booking
    await prisma.booking.upsert({
        where: { fileNo: "RT-2401" },
        update: {},
        create: {
            fileNo: "RT-2401",
            status: "planning",
            clientId: localClient.id,
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
        }
    });

    console.log("Database seeded successfully with cities, clients, and bookings!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

>>>>>>> 055527d (Add Email Center Gmail integration and hotel voucher features)
