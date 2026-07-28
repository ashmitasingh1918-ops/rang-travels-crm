import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaArrowLeft, FaSyncAlt, FaSignOutAlt, FaGoogle } from "react-icons/fa";
import { MOCK_HOTELS_LIST } from "../utils/mockEmailData";
import * as gmailService from "../services/gmailService";

import EmailSummaryCards from "../components/email/EmailSummaryCards";
import EmailSidebar from "../components/email/EmailSidebar";
import EmailList from "../components/email/EmailList";
import EmailDetail from "../components/email/EmailDetail";
import ComposeEmailModal from "../components/email/ComposeEmailModal";
import VoucherModal from "../components/email/VoucherModal";
import { toast } from "sonner";

export default function EmailCenter() {
  const [emails, setEmails] = useState([]);
  
  // Connection states
  const [connected, setConnected] = useState(false);
  const [connectedEmail, setConnectedEmail] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [syncingEmails, setSyncingEmails] = useState(false);

  // Selected email references
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Navigation and Views state
  const [activeMailbox, setActiveMailbox] = useState("inbox"); // "inbox" | "sent" | "starred" | "trash" | "awaiting_reply" | "replied"
  const [activeSmartView, setActiveSmartView] = useState(null); // "today" | "this_week" | "this_month" | null
  
  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHotel, setSelectedHotel] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modals state
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);

  // Checked items checklist state
  const [selectedEmails, setSelectedEmails] = useState([]);

  // Responsive device checks
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState("list"); // "mailbox", "list", "detail"

  useEffect(() => {
    const handleResize = () => {
      const mobileStatus = window.innerWidth < 768;
      setIsMobile(mobileStatus);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check Gmail Connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setLoadingStatus(true);
        const data = await gmailService.getGmailStatus();
        setConnected(data.connected);
        if (data.connected) {
          setConnectedEmail(data.email);
        }
      } catch (err) {
        console.error("Gmail connection check failed:", err);
      } finally {
        setLoadingStatus(false);
      }
    };

    // Check if redirected with credentials query parameters
    const params = new URLSearchParams(window.location.search);
    if (params.get("gmail") === "connected") {
      toast.success("Successfully linked ashmitasingh1918@gmail.com!");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get("error")) {
      toast.error(`OAuth alignment failed: ${params.get("error")}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    checkConnection();
  }, []);

  // Sync / Load Gmail messages List
  useEffect(() => {
    if (!connected) return;
    handleRefresh(true);
  }, [connected, activeMailbox]);

  // Load single message detail on click
  useEffect(() => {
    if (!connected || !selectedEmailId) {
      setSelectedEmail(null);
      return;
    }

    const fetchEmailDetail = async () => {
      try {
        setLoadingDetail(true);
        const res = await gmailService.getMessageDetail(selectedEmailId);
        
        // Simulating status and logs for CRM action panel mapping
        const emailDetailObj = {
          ...res.email,
          status: emails.find(m => m.id === selectedEmailId)?.status || "PENDING",
          history: emails.find(m => m.id === selectedEmailId)?.history || [
            { action: "Sourced headers via Gmail API listener", timestamp: new Date().toLocaleTimeString(), user: "System" }
          ]
        };

        setSelectedEmail(emailDetailObj);
        
        // Set message as read in the active listing array
        setEmails(prev => prev.map(m => m.id === selectedEmailId ? { ...m, isRead: true } : m));
      } catch (err) {
        console.error("Failed to load message detail:", err);
        toast.error("Could not fetch email body. Verify auth token.");
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchEmailDetail();
  }, [connected, selectedEmailId]);

  // Execute Fetch / Refresh messages list
  const handleRefresh = async (silent = false) => {
    if (!connected) return;
    try {
      setSyncingEmails(true);
      const res = await gmailService.getMessages({
        mailbox: activeMailbox,
        search: searchQuery
      });
      
      // Inject dummy status mapping so summary counts and badges work
      const enriched = res.emails.map((m, index) => ({
        ...m,
        status: index % 3 === 0 ? "REPLIED" : index % 3 === 1 ? "PENDING" : "VOUCHER SENT",
        history: [
          { action: "Message thread retrieved", timestamp: new Date().toLocaleTimeString(), user: "System" }
        ]
      }));

      setEmails(enriched);
      
      if (enriched.length > 0) {
        setSelectedEmailId(enriched[0].id);
      } else {
        setSelectedEmailId(null);
        setSelectedEmail(null);
      }
      
      if (!silent) {
        toast.success("Synchronized mailbox.");
      }
    } catch (err) {
      console.error("Error refreshing messages:", err);
      toast.error("Failed to query records from Gmail.");
    } finally {
      setSyncingEmails(false);
    }
  };

  // Google OAuth redirect initiation
  const handleConnectGmail = async () => {
    try {
      toast.loading("Initiating developer handshake...");
      const data = await gmailService.getAuthUrl();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        toast.dismiss();
        toast.error("Could not fetch auth link");
      }
    } catch (err) {
      toast.dismiss();
      console.error(err);
      toast.error("Failed to retrieve Google credentials setup.");
    }
  };

  // Disconnect OAuth connection
  const handleDisconnect = async () => {
    if (!window.confirm("Are you sure you want to disconnect Gmail?")) return;
    try {
      await gmailService.disconnectGmail();
      setConnected(false);
      setConnectedEmail("");
      setEmails([]);
      setSelectedEmailId(null);
      setSelectedEmail(null);
      toast.success("Disconnected Gmail account.");
    } catch (err) {
      toast.error("Disconnect action failed.");
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedHotel("All");
    setSelectedStatus("All");
    setStartDate("");
    setEndDate("");
    setSearchQuery("");
    toast.info("Filters cleared successfully.");
  };

  const toggleStar = (id) => {
    // Star toggle operates on the UI representation for sandbox
    setEmails(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, isStarred: !m.isStarred };
      }
      return m;
    }));
    toast.success("Toggled star in list");
  };

  const handleDeleteEmail = (id) => {
    // In dev, simulated deletion moving to trash
    setEmails(prev => prev.filter(m => m.id !== id));
    setSelectedEmailId(null);
    setSelectedEmail(null);
    toast.success("Mail removed successfully.");
    if (isMobile) setMobileView("list");
  };

  const handleStatusChange = (id, newStatus) => {
    setEmails(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
    setSelectedEmail(prev => prev && prev.id === id ? { ...prev, status: newStatus } : prev);
  };

  const handleComposeEmail = async (draftEmail) => {
    try {
      toast.loading("Dispatching email...");
      await gmailService.sendMail({
        to: draftEmail.to,
        subject: draftEmail.subject,
        message: draftEmail.body
      });
      toast.dismiss();
      toast.success("Email sent successfully via Gmail API!");
      setIsComposeOpen(false);
      handleRefresh(true);
    } catch (err) {
      toast.dismiss();
      console.error(err);
      toast.error("Failed to send compose email.");
    }
  };

  const handleSendReply = async (id, replyText) => {
    try {
      toast.loading("Sending threaded reply...");
      await gmailService.replyToMail(id, { message: replyText });
      toast.dismiss();
      toast.success("Reply successfully sent and threaded in Gmail!");
      setTimeout(() => handleRefresh(true), 1500);
    } catch (err) {
      toast.dismiss();
      console.error(err);
      toast.error("Failed to dispatch thread reply.");
    }
  };

  const handleVoucherUploadSuccess = (id, attachment, notes) => {
    handleStatusChange(id, "VOUCHER SENT");
    setEmails(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          attachments: [...(m.attachments || []), attachment],
          history: [{ action: `Voucher uploaded: ${attachment.name}. Notes: ${notes}`, timestamp: new Date().toLocaleTimeString(), user: "Admin User" }, ...m.history]
        };
      }
      return m;
    }));
    setSelectedEmail(prev => {
      if (prev && prev.id === id) {
        return {
          ...prev,
          attachments: [...(prev.attachments || []), attachment],
          history: [{ action: `Voucher uploaded: ${attachment.name}. Notes: ${notes}`, timestamp: new Date().toLocaleTimeString(), user: "Admin User" }, ...prev.history]
        };
      }
      return prev;
    });
  };

  // Local/UI client-side search logic to search loaded list while user types
  const filteredEmails = emails.filter(email => {
    if (selectedHotel !== "All" && email.hotelName !== selectedHotel) return false;
    if (selectedStatus !== "All" && email.status !== selectedStatus) return false;
    if (startDate && new Date(email.receivedAt) < new Date(startDate)) return false;
    if (endDate && new Date(email.receivedAt) > new Date(endDate)) return false;
    return true;
  });

  if (loadingStatus) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5 min-vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // DISCONNECTED OAUTH VIEW
  if (!connected) {
    return (
      <div className="container-fluid p-0 pb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className="mb-4">
          <h1 className="h3 mb-1 text-dark fw-bold font-display">Email Center</h1>
          <p className="text-secondary mb-0 fs-7">Manage hotel quotations, replies and vouchers</p>
        </div>

        <div className="card border-0 rounded-2xl p-5 text-center bg-white shadow-sm max-w-xl mx-auto my-5">
          <div className="bg-primary bg-opacity-10 text-primary p-4 rounded-circle d-inline-flex mx-auto mb-4" style={{ width: "90px", height: "90px", justifyContent: "center", alignItems: "center" }}>
            <FaGoogle size={40} />
          </div>
          <h2 className="h4 fw-bold text-dark font-display mb-3">Gmail Account Connection Required</h2>
          <p className="text-secondary fs-7 mb-4 mx-auto" style={{ maxWidth: "480px" }}>
            To sync hotel inquiries, reply directly inside conversation threads, and send booking vouchers, configure your development account:
            <br />
            <strong className="text-primary mt-2 d-block">ashmitasingh1918@gmail.com</strong>
          </p>
          <button
            className="btn btn-primary btn-lg px-5 py-3 rounded-xl border-0 shadow fw-bold transition-click d-flex align-items-center gap-2 mx-auto justify-content-center"
            onClick={handleConnectGmail}
          >
            <FaGoogle />
            Connect Gmail Account
          </button>
        </div>
      </div>
    );
  }

  // CONNECTED VIEW
  return (
    <div className="container-fluid p-0 pb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
      
      {/* HEADER SECTION */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1 text-dark fw-bold font-display">Email Center</h1>
          <div className="d-flex align-items-center gap-2 fs-7 text-secondary">
            <span>Gmail status:</span>
            <span className="badge bg-success bg-opacity-10 text-success border border-success-subtle py-1 px-2 fw-semibold">
              Connected ({connectedEmail})
            </span>
            <button
              onClick={handleDisconnect}
              className="btn btn-link p-0 text-danger text-decoration-none fs-8 fw-semibold border-0 bg-transparent ms-2"
              title="Disconnect email"
            >
              <FaSignOutAlt className="me-1" /> Disconnect
            </button>
          </div>
        </div>
        
        {/* Search & Compose row */}
        <div className="d-flex align-items-center gap-2.5">
          <div className="input-group border rounded-xl overflow-hidden bg-white shadow-sm" style={{ maxWidth: "300px" }}>
            <span className="input-group-text bg-transparent border-0 text-muted ps-3 pe-2">
              <FaSearch size={14} />
            </span>
            <input
              type="text"
              className="form-control border-0 bg-transparent py-2.5 fs-7 shadow-none text-dark"
              placeholder="Search in Gmail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRefresh();
              }}
            />
          </div>
          <button
            className="btn btn-white border border-soft p-2.5 rounded-xl text-secondary shadow-sm transition-click bg-white"
            onClick={() => handleRefresh()}
            disabled={syncingEmails}
            title="Refresh emails"
          >
            <FaSyncAlt className={syncingEmails ? "spin" : ""} />
          </button>
          <button
            className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2.5 shadow-sm rounded-xl border-0 fw-bold transition-click"
            onClick={() => setIsComposeOpen(true)}
          >
            <FaPlus size={12} />
            <span className="fs-7">Compose Email</span>
          </button>
        </div>
      </div>

      {/* SUMMARY DASHBOARD CARDS */}
      <EmailSummaryCards emails={emails} />

      {/* WORKSPACE AREA CONTAINER */}
      <div className="row g-3">
        
        {/* DESKTOP/TABLET SIDEBAR OR MOBILE PANEL */}
        {(!isMobile || mobileView === "mailbox") && (
          <div className="col-12 col-md-3 col-xl-2 border-end border-soft">
            <div className="card border-0 rounded-xl p-3 bg-white shadow-none h-100">
              <EmailSidebar
                emails={emails}
                activeMailbox={activeMailbox}
                setActiveMailbox={(mb) => {
                  setActiveMailbox(mb);
                  if (isMobile) setMobileView("list");
                }}
                activeSmartView={activeSmartView}
                setActiveSmartView={(sv) => {
                  setActiveSmartView(sv);
                  if (isMobile) setMobileView("list");
                }}
                selectedHotel={selectedHotel}
                setSelectedHotel={setSelectedHotel}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                clearFilters={clearFilters}
                hotelsList={MOCK_HOTELS_LIST}
              />
            </div>
          </div>
        )}

        {/* MIDDLE PANE: EMAILS LIST */}
        {(!isMobile || mobileView === "list") && (
          <div className="col-12 col-md-4 col-xl-4">
            <div className="card border-0 rounded-xl p-3 shadow-none bg-transparent">
              {/* Toolbar in list tab */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  {isMobile && (
                    <button
                      className="btn btn-sm btn-light border d-flex align-items-center gap-1 py-1.5 px-3 rounded-lg fs-7 text-secondary"
                      onClick={() => setMobileView("mailbox")}
                    >
                      <FaArrowLeft size={10} /> Mailboxes
                    </button>
                  )}
                  <span className="overline-title text-secondary m-0">
                    {activeSmartView ? `Smart: ${activeSmartView}` : `Mailbox: ${activeMailbox}`}
                  </span>
                </div>
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle fs-8">
                  {filteredEmails.length} messages
                </span>
              </div>

              {syncingEmails ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary spinner-border-sm" role="status">
                    <span className="visually-hidden">Syncing mailbox...</span>
                  </div>
                  <p className="mt-2 text-secondary fs-8">Syncing with Gmail...</p>
                </div>
              ) : (
                <EmailList
                  emails={filteredEmails}
                  selectedEmailId={selectedEmailId}
                  setSelectedEmailId={(id) => {
                    setSelectedEmailId(id);
                    if (isMobile) setMobileView("detail");
                  }}
                  toggleStar={toggleStar}
                  selectedEmails={selectedEmails}
                  setSelectedEmails={setSelectedEmails}
                />
              )}
            </div>
          </div>
        )}

        {/* RIGHT PANE: SELECTED EMAIL DETAIL */}
        {(!isMobile || mobileView === "detail") && (
          <div className="col-12 col-md-5 col-xl-6">
            {loadingDetail ? (
              <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5 bg-white border border-soft rounded-xl shadow-sm">
                <div className="spinner-border text-primary spinner-border-sm mb-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span className="text-secondary fs-8">Loading email details...</span>
              </div>
            ) : (
              <EmailDetail
                email={selectedEmail}
                onBack={() => setMobileView("list")}
                toggleStar={toggleStar}
                onDelete={handleDeleteEmail}
                onStatusChange={handleStatusChange}
                onOpenVoucher={() => setIsVoucherOpen(true)}
                onSendReply={handleSendReply}
              />
            )}
          </div>
        )}

      </div>

      {/* COMPOSE EMAIL MODAL */}
      <ComposeEmailModal
        open={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        hotelsList={MOCK_HOTELS_LIST}
        onSendEmail={handleComposeEmail}
      />

      {/* VOUCHER GENERATOR GENERATION PLACEHOLDER MODAL */}
      <VoucherModal
        open={isVoucherOpen}
        onClose={() => setIsVoucherOpen(false)}
        email={selectedEmail}
        onUploadSuccess={handleVoucherUploadSuccess}
      />

      {/* CSS Spin effect for loader */}
      <style>{`
        @keyframes spinAround {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin {
          animation: spinAround 1s linear infinite;
        }
      `}</style>

    </div>
  );
}