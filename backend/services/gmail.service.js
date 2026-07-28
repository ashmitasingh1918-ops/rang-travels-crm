const { google } = require("googleapis");
const prisma = require("../config/prisma");

const SCOPES = ["https://www.googleapis.com/auth/gmail.modify"];

const createOAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
};

const getAuthorizationUrl = () => {
  const oAuth2Client = createOAuthClient();
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent"
  });
};

const exchangeAuthorizationCode = async (code) => {
  const oAuth2Client = createOAuthClient();
  const { tokens } = await oAuth2Client.getToken(code);
  return tokens;
};

// Retrieve connected credentials. Auto-refreshes using refresh token if access token expires.
const getAuthorizedClient = async (userId) => {
  const connection = await prisma.gmailConnection.findUnique({
    where: { userId }
  });

  if (!connection) {
    throw new Error("GMAIL_NOT_CONNECTED");
  }

  const oAuth2Client = createOAuthClient();
  oAuth2Client.setCredentials({
    refresh_token: connection.refreshToken
  });

  return oAuth2Client;
};

const getProfile = async (auth) => {
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.getProfile({ userId: "me" });
  return response.data;
};

// Parse Headers
const getHeader = (headers, name) => {
  if (!headers) return "";
  const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
  return header ? header.value : "";
};

// Recursive multipart body extractor
const getMessageBody = (payload) => {
  if (!payload) return "";
  
  if (payload.body && payload.body.data) {
    return Buffer.from(payload.body.data, "base64").toString("utf-8");
  }
  
  if (payload.parts) {
    return getPartsBody(payload.parts);
  }
  
  return "";
};

const getPartsBody = (parts, preferredType = "text/html") => {
  const part = findPart(parts, preferredType);
  if (part && part.body && part.body.data) {
    return Buffer.from(part.body.data, "base64").toString("utf-8");
  }
  
  const fallbackType = preferredType === "text/html" ? "text/plain" : "text/html";
  const fallbackPart = findPart(parts, fallbackType);
  if (fallbackPart && fallbackPart.body && fallbackPart.body.data) {
    return Buffer.from(fallbackPart.body.data, "base64").toString("utf-8");
  }
  
  return "";
};

const findPart = (parts, mimeType) => {
  for (const part of parts) {
    if (part.mimeType === mimeType) {
      return part;
    }
    if (part.parts) {
      const nestedPart = findPart(part.parts, mimeType);
      if (nestedPart) return nestedPart;
    }
  }
  return null;
};

// Extract lists of attachments
const getAttachmentsMetadata = (parts) => {
  const attachments = [];
  const traverse = (partsList) => {
    for (const part of partsList) {
      if (part.filename && part.body && part.body.attachmentId) {
        attachments.push({
          attachmentId: part.body.attachmentId,
          filename: part.filename,
          size: formatBytes(part.body.size || 0),
          mimeType: part.mimeType
        });
      }
      if (part.parts) {
        traverse(part.parts);
      }
    }
  };
  if (parts) traverse(parts);
  return attachments;
};

const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Normalize message representation
const extractSenderName = (fromStr) => {
  if (!fromStr) return "Partner Hotel";
  const match = fromStr.match(/^"?([^"<]+)"?\s*<[^>]+>/);
  if (match && match[1]) {
    return match[1].trim();
  }
  return fromStr.split("@")[0] || fromStr;
};

const normalizeEmail = (messageDetail) => {
  const payload = messageDetail.payload;
  const headers = payload ? payload.headers : [];
  
  const from = getHeader(headers, "From");
  const to = getHeader(headers, "To");
  const subject = getHeader(headers, "Subject") || "(No Subject)";
  const dateStr = getHeader(headers, "Date");
  
  const labels = messageDetail.labelIds || [];
  const isRead = !labels.includes("UNREAD");
  const isStarred = labels.includes("STARRED");
  
  const body = getMessageBody(payload);
  const preview = messageDetail.snippet || body.substring(0, 100);

  const attachments = payload && payload.parts ? getAttachmentsMetadata(payload.parts) : [];
  const hotelName = extractSenderName(from);

  return {
    id: messageDetail.id,
    gmailMessageId: messageDetail.id,
    threadId: messageDetail.threadId,
    hotelName,
    from,
    to,
    subject,
    preview,
    body,
    receivedAt: dateStr ? new Date(dateStr).toISOString() : new Date().toISOString(),
    isRead,
    isStarred,
    labels,
    attachments
  };
};

const listMessages = async (auth, { mailbox = "inbox", search = "", maxResults = 25, pageToken = "" }) => {
  const gmail = google.gmail({ version: "v1", auth });
  
  let q = "";
  if (mailbox === "inbox") {
    q = "label:INBOX";
  } else if (mailbox === "sent") {
    q = "label:SENT";
  } else if (mailbox === "starred") {
    q = "is:starred";
  } else if (mailbox === "trash") {
    q = "label:TRASH";
  } else if (mailbox === "awaiting_reply") {
    // Concept: message contains pending tags
    q = "label:INBOX"; 
  }

  if (search) {
    q += ` ${search}`;
  }

  const response = await gmail.users.messages.list({
    userId: "me",
    q,
    maxResults,
    pageToken
  });

  const messages = response.data.messages || [];
  const nextPageToken = response.data.nextPageToken || null;

  // Retrieve message details
  const emailList = await Promise.all(
    messages.map(async (msg) => {
      try {
        const detail = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
          format: "metadata",
          metadataHeaders: ["From", "To", "Subject", "Date"]
        });
        
        const headers = detail.data.payload.headers;
        const from = getHeader(headers, "From");
        const to = getHeader(headers, "To");
        const subject = getHeader(headers, "Subject") || "(No Subject)";
        const dateStr = getHeader(headers, "Date");
        const labels = detail.data.labelIds || [];
        const hotelName = extractSenderName(from);

        return {
          id: msg.id,
          gmailMessageId: msg.id,
          threadId: msg.threadId,
          hotelName,
          from,
          to,
          subject,
          preview: detail.data.snippet || "",
          body: "", // Keep body empty in listing to boost perf
          receivedAt: dateStr ? new Date(dateStr).toISOString() : new Date().toISOString(),
          isRead: !labels.includes("UNREAD"),
          isStarred: labels.includes("STARRED"),
          labels,
          attachments: []
        };
      } catch (err) {
        console.error(`Error loading message meta ${msg.id}:`, err.message);
        return null;
      }
    })
  );

  return {
    emails: emailList.filter(e => e !== null),
    nextPageToken
  };
};

const getMessage = async (auth, messageId) => {
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.messages.get({
    userId: "me",
    id: messageId
  });

  return normalizeEmail(response.data);
};

// Send standard raw email payload
const sendEmail = async (auth, { to, subject, message, attachments = [] }) => {
  const gmail = google.gmail({ version: "v1", auth });

  const mailLines = [];
  mailLines.push(`To: ${to}`);
  mailLines.push(`Subject: ${subject}`);
  mailLines.push("Content-Type: text/html; charset=utf-8");
  mailLines.push("MIME-Version: 1.0");
  mailLines.push("");
  mailLines.push(message);

  const raw = Buffer.from(mailLines.join("\r\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const response = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw
    }
  });

  return response.data;
};

// Send reply linking threadId
const replyToEmail = async (auth, parentMessageId, { message }) => {
  const gmail = google.gmail({ version: "v1", auth });
  
  // 1. Fetch parent email headers
  const parent = await gmail.users.messages.get({
    userId: "me",
    id: parentMessageId,
    format: "metadata",
    metadataHeaders: ["Subject", "Message-ID", "References", "From"]
  });

  const headers = parent.data.payload.headers;
  const parentSubject = getHeader(headers, "Subject") || "";
  const parentMessageIdHeader = getHeader(headers, "Message-ID");
  const parentReferences = getHeader(headers, "References");
  const parentFrom = getHeader(headers, "From");

  const replySubject = parentSubject.toLowerCase().startsWith("re:") 
    ? parentSubject 
    : `Re: ${parentSubject}`;

  const referencesHeader = parentReferences 
    ? `${parentReferences} ${parentMessageIdHeader}` 
    : parentMessageIdHeader;

  const mailLines = [];
  mailLines.push(`To: ${parentFrom}`);
  mailLines.push(`Subject: ${replySubject}`);
  mailLines.push(`In-Reply-To: ${parentMessageIdHeader}`);
  mailLines.push(`References: ${referencesHeader}`);
  mailLines.push("Content-Type: text/html; charset=utf-8");
  mailLines.push("MIME-Version: 1.0");
  mailLines.push("");
  mailLines.push(message);

  const raw = Buffer.from(mailLines.join("\r\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const response = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw,
      threadId: parent.data.threadId
    }
  });

  return response.data;
};

// Fetch attachment file payload
const getAttachment = async (auth, messageId, attachmentId) => {
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.messages.attachments.get({
    userId: "me",
    messageId,
    id: attachmentId
  });

  return {
    data: response.data.data // Base64 encoded string payload
  };
};

module.exports = {
  getAuthorizationUrl,
  exchangeAuthorizationCode,
  getAuthorizedClient,
  getProfile,
  listMessages,
  getMessage,
  sendEmail,
  replyToEmail,
  getAttachment
};
