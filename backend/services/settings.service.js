const prisma = require("../config/prisma");

/**
 * Fetch profile data for a user
 * @param {number} userId 
 * @returns {Promise<object>}
 */
const getProfileService = async (userId) => {
  return await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Check if email is already taken by another user
 * @param {string} email 
 * @param {number} excludeUserId 
 * @returns {Promise<boolean>}
 */
const checkDuplicateEmail = async (email, excludeUserId) => {
  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
      id: {
        not: Number(excludeUserId),
      },
    },
  });
  return !!user;
};

/**
 * Check if phone number is already taken by another user
 * @param {string} phone 
 * @param {number} excludeUserId 
 * @returns {Promise<boolean>}
 */
const checkDuplicatePhone = async (phone, excludeUserId) => {
  if (!phone) return false;
  const user = await prisma.user.findFirst({
    where: {
      phone: {
        equals: phone,
        mode: "insensitive",
      },
      id: {
        not: Number(excludeUserId),
      },
    },
  });
  return !!user;
};

/**
 * Update profile details for a user
 * @param {number} userId 
 * @param {object} profileData 
 * @returns {Promise<object>}
 */
const updateProfileService = async (userId, profileData) => {
  return await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      fullName: profileData.fullName,
      email: profileData.email,
      phone: profileData.phone || null,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Fetch password hash of a user
 * @param {number} userId 
 * @returns {Promise<string>}
 */
const getPasswordHashService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      password: true,
    },
  });
  return user ? user.password : null;
};

/**
 * Update hashed password for a user
 * @param {number} userId 
 * @param {string} hashedPassword 
 * @returns {Promise<object>}
 */
const changePasswordService = async (userId, hashedPassword) => {
  return await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      password: hashedPassword,
      mustChangePassword: false,
    },
  });
};

/**
 * Get company details. Auto-creates a default record if one doesn't exist.
 * @returns {Promise<object>}
 */
const getCompanyService = async () => {
  let company = await prisma.company.findFirst();
  
  if (!company) {
    company = await prisma.company.create({
      data: {
        name: "Rang Travels",
        email: "info@rangtravels.com",
        phone: "+91 98765 43210",
        gstNumber: null,
        address: null,
        logo: null,
      },
    });
  }
  
  return company;
};

/**
 * Update company details. Creates a record first if somehow missing.
 * @param {object} companyData 
 * @returns {Promise<object>}
 */
const updateCompanyService = async (companyData) => {
  let company = await prisma.company.findFirst();
  
  if (!company) {
    return await prisma.company.create({
      data: {
        name: companyData.name,
        email: companyData.email || null,
        phone: companyData.phone || null,
        gstNumber: companyData.gstNumber || null,
        address: companyData.address || null,
        logo: companyData.logo || null,
      },
    });
  }
  
  return await prisma.company.update({
    where: {
      id: company.id,
    },
    data: {
      name: companyData.name,
      email: companyData.email !== undefined ? companyData.email : company.email,
      phone: companyData.phone !== undefined ? companyData.phone : company.phone,
      gstNumber: companyData.gstNumber !== undefined ? companyData.gstNumber : company.gstNumber,
      address: companyData.address !== undefined ? companyData.address : company.address,
      logo: companyData.logo !== undefined ? companyData.logo : company.logo,
    },
  });
};

module.exports = {
  getProfileService,
  checkDuplicateEmail,
  checkDuplicatePhone,
  updateProfileService,
  getPasswordHashService,
  changePasswordService,
  getCompanyService,
  updateCompanyService,
};