import api from "./axios";

export const getAuthUrl = async () => {
  const response = await api.get("/gmail/auth");
  return response.data;
};

export const getGmailStatus = async () => {
  const response = await api.get("/gmail/status");
  return response.data;
};

export const disconnectGmail = async () => {
  const response = await api.post("/gmail/disconnect");
  return response.data;
};

export const getMessages = async ({ mailbox, search, maxResults, pageToken } = {}) => {
  const response = await api.get("/gmail/messages", {
    params: {
      mailbox,
      search,
      maxResults,
      pageToken
    }
  });
  return response.data;
};

export const getMessageDetail = async (messageId) => {
  const response = await api.get(`/gmail/messages/${messageId}`);
  return response.data;
};

export const sendMail = async ({ to, subject, message }) => {
  const response = await api.post("/gmail/send", { to, subject, message });
  return response.data;
};

export const replyToMail = async (messageId, { message }) => {
  const response = await api.post(`/gmail/messages/${messageId}/reply`, { message });
  return response.data;
};

export const downloadAttachment = async (messageId, attachmentId) => {
  const response = await api.get(`/gmail/messages/${messageId}/attachments/${attachmentId}`);
  return response.data;
};
