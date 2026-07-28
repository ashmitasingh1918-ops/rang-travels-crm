const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
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
