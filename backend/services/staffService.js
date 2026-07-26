const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

const createStaffService = async (data) => {
    const { fullName, email, phone, password } = data;

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email },
                { phone },
            ].filter(Boolean),
        },
    });

    if (existingUser) {
        throw new Error("Email or phone already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await prisma.user.create({
        data: {
            fullName,
            email,
            phone,
            password: hashedPassword,
            role: "STAFF",
            isActive: true,
            mustChangePassword: true,
        },
    });

    const { password: _, ...staffWithoutPassword } = staff;
    return staffWithoutPassword;
};

const getAllStaff = async () => {
    return await prisma.user.findMany({
        where: {
            role: "STAFF",
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            mustChangePassword: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

const getStaffById = async (id) => {
    return await prisma.user.findFirst({
        where: {
            id: parseInt(id),
            role: "STAFF",
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            mustChangePassword: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

const updateStaff = async (id, data) => {
    const { fullName, email, phone, isActive } = data;

    const existingUser = await prisma.user.findFirst({
        where: {
            NOT: {
                id: parseInt(id),
            },
            OR: [
                { email },
                { phone },
            ].filter(Boolean),
        },
    });

    if (existingUser) {
        throw new Error("Email or phone already exists");
    }

    return await prisma.user.update({
        where: {
            id: parseInt(id),
        },
        data: {
            fullName,
            email,
            phone,
            isActive: isActive !== undefined ? isActive : true,
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            mustChangePassword: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

const deleteStaff = async (id) => {
    return await prisma.user.delete({
        where: {
            id: parseInt(id),
        },
    });
};

module.exports = {
    createStaffService,
    getStaffService: getAllStaff, // Backwards compatibility mapping
    getAllStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
};