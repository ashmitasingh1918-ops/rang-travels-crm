const jwt = require("jsonwebtoken");
const prisma = require("../../config/prisma");
const gmailService = require("../../services/gmail.service");

const getAuthUrl = async (req, res) => {
  try {
    // Generate secure state payload containing CRM user identity
    const state = jwt.sign(
      { userId: req.user.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const oAuthClient = require("../../services/gmail.service").getAuthorizationUrl();
    // Append the state parameter to Google Auth URL
    const authUrl = `${oAuthClient}&state=${state}`;

    return res.status(200).json({
      success: true,
      authUrl
    });
  } catch (error) {
    console.error("Gmail Auth Url Generation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not generate authorization URL"
    });
  }
};

const oauthCallback = async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/email-center?error=missing_params`);
  }

  try {
    // Decode state to retrieve userId
    const decoded = jwt.verify(state, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Exchange tokens
    const tokens = await gmailService.exchangeAuthorizationCode(code);

    if (!tokens.refresh_token) {
      // Refresh token is only sent on first consent. If already consented, we may only get access_token.
      // In this case, we check if we already have a refresh token.
      const existing = await prisma.gmailConnection.findUnique({
        where: { userId }
      });
      if (!existing) {
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/email-center?error=reset_consent_required`);
      }
      tokens.refresh_token = existing.refreshToken;
    }

    // Load profile email
    const oAuth2Client = new (require("googleapis").google.auth.OAuth2)(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    oAuth2Client.setCredentials(tokens);
    const profile = await gmailService.getProfile(oAuth2Client);
    const emailAddress = profile.emailAddress;

    // Upsert database connection record
    await prisma.gmailConnection.upsert({
      where: { userId },
      update: {
        email: emailAddress,
        refreshToken: tokens.refresh_token
      },
      create: {
        userId,
        email: emailAddress,
        refreshToken: tokens.refresh_token
      }
    });

    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/email-center?gmail=connected`);
  } catch (error) {
    console.error("Gmail OAuth Callback Error:", error);
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/email-center?error=auth_failed`);
  }
};

const getStatus = async (req, res) => {
  try {
    const connection = await prisma.gmailConnection.findUnique({
      where: { userId: req.user.id },
      select: { email: true }
    });

    if (!connection) {
      return res.status(200).json({
        connected: false
      });
    }

    return res.status(200).json({
      connected: true,
      email: connection.email
    });
  } catch (error) {
    console.error("Gmail Connection Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const disconnect = async (req, res) => {
  try {
    await prisma.gmailConnection.deleteMany({
      where: { userId: req.user.id }
    });

    return res.status(200).json({
      success: true,
      message: "Gmail disconnected successfully"
    });
  } catch (error) {
    console.error("Gmail Disconnect Error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not disconnect Gmail connection"
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { mailbox, search, maxResults, pageToken } = req.query;
    
    let client;
    try {
      client = await gmailService.getAuthorizedClient(req.user.id);
    } catch (err) {
      if (err.message === "GMAIL_NOT_CONNECTED") {
        return res.status(400).json({
          success: false,
          code: "GMAIL_NOT_CONNECTED",
          message: "Please connect your Gmail account"
        });
      }
      throw err;
    }

    const data = await gmailService.listMessages(client, {
      mailbox: mailbox || "inbox",
      search: search || "",
      maxResults: parseInt(maxResults || 25),
      pageToken: pageToken || ""
    });

    return res.status(200).json({
      success: true,
      ...data
    });
  } catch (error) {
    console.error("Get Gmail Messages Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gmail sync failed. Please check network/tokens."
    });
  }
};

const getMessageDetail = async (req, res) => {
  try {
    const { messageId } = req.params;

    const client = await gmailService.getAuthorizedClient(req.user.id);
    const detail = await gmailService.getMessage(client, messageId);

    return res.status(200).json({
      success: true,
      email: detail
    });
  } catch (error) {
    console.error("Get Gmail Message Info Error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not retrieve message detail"
    });
  }
};

const sendMail = async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    if (!to || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "to, subject and message parameters are required"
      });
    }

    const client = await gmailService.getAuthorizedClient(req.user.id);
    const result = await gmailService.sendEmail(client, { to, subject, message });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      result
    });
  } catch (error) {
    console.error("Compose Mail Send Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to dispatch email"
    });
  }
};

const replyToMail = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "message is required"
      });
    }

    const client = await gmailService.getAuthorizedClient(req.user.id);
    const result = await gmailService.replyToEmail(client, messageId, { message });

    return res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      result
    });
  } catch (error) {
    console.error("Reply To Mail Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send reply to thread"
    });
  }
};

const downloadAttachment = async (req, res) => {
  try {
    const { messageId, attachmentId } = req.params;

    const client = await gmailService.getAuthorizedClient(req.user.id);
    const file = await gmailService.getAttachment(client, messageId, attachmentId);

    return res.status(200).json({
      success: true,
      data: file.data
    });
  } catch (error) {
    console.error("Download Attachment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve attachment binary"
    });
  }
};

module.exports = {
  getAuthUrl,
  oauthCallback,
  getStatus,
  disconnect,
  getMessages,
  getMessageDetail,
  sendMail,
  replyToMail,
  downloadAttachment
};
