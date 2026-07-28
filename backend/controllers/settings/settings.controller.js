const bcrypt = require("bcrypt");
const {
  getProfileService,
  checkDuplicateEmail,
  checkDuplicatePhone,
  updateProfileService,
  getPasswordHashService,
  changePasswordService,
  getCompanyService,
  updateCompanyService,
} = require("../../services/settings.service");

// Email regex helper
const validateEmailFormat = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Phone regex helper (simple validation matching generic international formats)
const validatePhoneFormat = (phone) => {
  if (!phone) return true;
  // Allows digits, spaces, dashes, parentheses and a leading plus sign
  const re = /^\+?[0-9\s\-()]{8,20}$/;
  return re.test(phone);
};

/**
 * GET /api/v1/settings/profile
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing from request session",
      });
    }

    const user = await getProfileService(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("[getProfileController]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * PUT /api/v1/settings/profile
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing from request session",
      });
    }

    let { fullName, email, phone } = req.body;

    // Trim inputs
    fullName = fullName ? String(fullName).trim() : "";
    email = email ? String(email).trim() : "";
    phone = phone ? String(phone).trim() : "";

    // 1. Validations
    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    if (!validateEmailFormat(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (phone && !validatePhoneFormat(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      });
    }

    // 2. Duplicate checks (excluding the currently active user)
    const emailExists = await checkDuplicateEmail(email, userId);
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "A user with this email address already exists",
      });
    }

    if (phone) {
      const phoneExists = await checkDuplicatePhone(phone, userId);
      if (phoneExists) {
        return res.status(409).json({
          success: false,
          message: "A user with this phone number already exists",
        });
      }
    }

    // 3. Save updates
    const updatedUser = await updateProfileService(userId, {
      fullName,
      email,
      phone,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("[updateProfileController]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * PUT /api/v1/settings/change-password
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing from request session",
      });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // 1. Validations
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password, new password, and confirmation are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirmation password do not match",
      });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    // 2. Load stored password hash
    const storedHash = await getPasswordHashService(userId);
    if (!storedHash) {
      return res.status(404).json({
        success: false,
        message: "User credentials not found",
      });
    }

    // 3. Verify current password matches
    const isMatch = await bcrypt.compare(currentPassword, storedHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect current password",
      });
    }

    // 4. Hash new password & save
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await changePasswordService(userId, hashedNewPassword);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
      data: {},
    });
  } catch (error) {
    console.error("[changePasswordController]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * GET /api/v1/settings/company
 */
const getCompany = async (req, res) => {
  try {
    const company = await getCompanyService();
    return res.status(200).json({
      success: true,
      message: "Company details fetched successfully",
      data: company,
    });
  } catch (error) {
    console.error("[getCompanyController]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * PUT /api/v1/settings/company
 */
const updateCompany = async (req, res) => {
  try {
    let { name, email, phone, gstNumber, address, logo } = req.body;

    // Trim values
    name = name ? String(name).trim() : "";
    email = email ? String(email).trim() : "";
    phone = phone ? String(phone).trim() : "";
    gstNumber = gstNumber ? String(gstNumber).trim() : "";
    address = address ? String(address).trim() : "";
    logo = logo ? String(logo).trim() : "";

    // 1. Validations
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    if (email && !validateEmailFormat(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (phone && !validatePhoneFormat(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      });
    }

    // 2. Perform save
    const updatedCompany = await updateCompanyService({
      name,
      email,
      phone,
      gstNumber,
      address,
      logo,
    });

    return res.status(200).json({
      success: true,
      message: "Company details updated successfully",
      data: updatedCompany,
    });
  } catch (error) {
    console.error("[updateCompanyController]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getCompany,
  updateCompany,
};