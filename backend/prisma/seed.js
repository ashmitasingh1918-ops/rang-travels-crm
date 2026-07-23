const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {

    const adminEmail = process.env.ADMIN_EMAIL || "admin@rangtravels.com";
    const adminName = process.env.ADMIN_NAME || "Admin User";

    const admin = await prisma.user.findUnique({
        where: {
            email: adminEmail
        }
    });

    if (admin) {
        console.log("Admin already exists.");
        return;
    }

    const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD,
    10
);


    await prisma.user.create({
        data: {
              fullName: adminName,
              email: adminEmail,
               password: hashedPassword,
               role: "ADMIN"
        }
    });

    console.log("Admin created successfully!");
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
