const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {

    const admin = await prisma.user.findUnique({
        where: {
            email: "admin@rangtravels.com"
        }
    });

    if (admin) {
        console.log("Admin already exists. Updating password and name from environment variables...");
        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD || "Admin@123",
            10
        );
        await prisma.user.update({
            where: {
                email: adminEmail
            },
            data: {
                fullName: adminName,
                password: hashedPassword
            }
        });
        console.log("Admin details updated successfully!");
        return;
    }

    
    const hashedPassword = await bcrypt.hash("Admin@123", 10);


    await prisma.user.create({
        data: {
              fullName: process.env.ADMIN_NAME,
              email: process.env.ADMIN_EMAIL,
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
