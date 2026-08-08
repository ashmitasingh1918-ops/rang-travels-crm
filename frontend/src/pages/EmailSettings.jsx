import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Mail, Link2, Link2Off, RefreshCw, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import api from "../services/axios";

export default function EmailSettings() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get("/gmail/status");
      setStatus(res.data);
    } catch {
      toast.error("Failed to load Gmail status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  // Check if redirected back from Google OAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("gmail") === "connected") {
      toast.success("Gmail connected successfully!");
      window.history.replaceState({}, "", window.location.pathname);
      fetchStatus();
    }
    if (params.get("error")) {
      toast.error("Gmail connection failed: " + params.get("error"));
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      const res = await api.get("/gmail/auth");
      window.location.href = res.data.authUrl;
    } catch {
      toast.error("Could not initiate Google login");
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm("Disconnect Gmail? You will need to reconnect to send emails.")) return;
    try {
      setDisconnecting(true);
      await api.post("/gmail/disconnect");
      toast.success("Gmail disconnected");
      fetchStatus();
    } catch {
      toast.error("Failed to disconnect Gmail");
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="mb-4">
        <h4 className="fw-bold mb-0">Email Settings</h4>
        <p className="text-muted fs-7 mb-0">Manage your Gmail connection for sending hotel requests and vouchers</p>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-5">
          {loading ? (
            <div className="text-center"><div className="spinner-border text-primary" /></div>
          ) : (
            <>
              {/* Status indicator */}
              <div className="d-flex align-items-center gap-4 mb-5">
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: status?.connected ? "#ecfdf5" : "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Mail size={32} color={status?.connected ? "#10b981" : "#ef4444"} />
                </div>
                <div>
                  <h5 className="fw-bold mb-1">
                    {status?.connected ? (
                      <><CheckCircle2 size={18} color="#10b981" className="me-2" />Gmail Connected</>
                    ) : (
                      <><AlertCircle size={18} color="#ef4444" className="me-2" />Not Connected</>
                    )}
                  </h5>
                  {status?.connected ? (
                    <p className="text-muted mb-0">{status.email}</p>
                  ) : (
                    <p className="text-muted mb-0">Connect your Gmail to send hotel requests and vouchers</p>
                  )}
                </div>
              </div>

              {/* Details */}
              {status?.connected && (
                <div className="bg-light rounded-3 p-4 mb-4">
                  <div className="row g-3">
                    <div className="col-6">
                      <small className="text-muted d-block fw-semibold">Connected Account</small>
                      <span>{status.email}</span>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block fw-semibold">Status</small>
                      <span className="badge bg-success">Active</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Features info */}
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">What this enables</h6>
                <div className="d-flex flex-column gap-2">
                  {[
                    "Send hotel availability request emails automatically",
                    "Deliver hotel voucher PDFs directly to hotels",
                    "Track all outgoing emails in Email History",
                    "Token auto-refresh — no re-login needed",
                  ].map((f, i) => (
                    <div key={i} className="d-flex align-items-start gap-2">
                      <CheckCircle2 size={16} color="#10b981" className="mt-1 flex-shrink-0" />
                      <span className="fs-7">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="d-flex gap-3">
                {status?.connected ? (
                  <>
                    <button className="btn btn-outline-secondary" onClick={handleConnect} disabled={connecting}>
                      <RefreshCw size={16} className="me-2" />{connecting ? "Redirecting…" : "Reconnect"}
                    </button>
                    <button className="btn btn-outline-danger" onClick={handleDisconnect} disabled={disconnecting}>
                      <Link2Off size={16} className="me-2" />{disconnecting ? "Disconnecting…" : "Disconnect"}
                    </button>
                  </>
                ) : (
                  <button className="btn btn-primary px-4" onClick={handleConnect} disabled={connecting}>
                    <Link2 size={16} className="me-2" />{connecting ? "Redirecting to Google…" : "Connect Gmail Account"}
                  </button>
                )}
              </div>

              <p className="text-muted fs-8 mt-3 mb-0">
                <AlertCircle size={13} className="me-1" />Only one Gmail account can be connected per user. Refresh tokens are stored securely and auto-refreshed so you never need to log in again unless you explicitly disconnect.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
