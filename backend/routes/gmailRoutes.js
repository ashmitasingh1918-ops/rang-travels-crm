const express = require("express");
const router = express.Router();
const gmailController = require("../controllers/gmail/gmailController");
const authenticate = require("../middleware/authMiddleware");

// OAuth authorization URL initiation endpoint
router.get("/auth", authenticate, gmailController.getAuthUrl);

// Google OAuth callback redirection endpoint (Open access, state validated internally)
router.get("/oauth/callback", gmailController.oauthCallback);

// Gmail connection state endpoint
router.get("/status", authenticate, gmailController.getStatus);

// Gmail disconnection endpoint
router.post("/disconnect", authenticate, gmailController.disconnect);

// Message querying & listing endpoint
router.get("/messages", authenticate, gmailController.getMessages);

// Fetching single message details endpoint
router.get("/messages/:messageId", authenticate, gmailController.getMessageDetail);

// Dispatch incoming compose mails endpoint
router.post("/send", authenticate, gmailController.sendMail);

// Reply dispatch endpoint
router.post("/messages/:messageId/reply", authenticate, gmailController.replyToMail);

// Attachment downloader endpoint
router.get("/messages/:messageId/attachments/:attachmentId", authenticate, gmailController.downloadAttachment);

module.exports = router;
