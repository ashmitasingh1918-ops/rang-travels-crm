import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Search, RefreshCw, Paperclip, Mail } from "lucide-react";
import { getEmailHistory } from "../services/emailLogService";

export default function EmailHistory() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getEmailHistory({ search, page, limit: 25 });
      setLogs(res.logs || []);
      setPagination(res.pagination || {});
    } catch {
      toast.error("Failed to load email history");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { fetch(); }, [fetch]);

  const fmtDate = (d) => d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Email History</h4>
          <p className="text-muted fs-7 mb-0">All hotel request and voucher emails sent</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={fetch}><RefreshCw size={15} className="me-1" />Refresh</button>
      </div>

      {/* Search */}
      <div className="card border-0 shadow-sm rounded-3 mb-4">
        <div className="card-body p-3">
          <div className="input-group" style={{ maxWidth: 400 }}>
            <span className="input-group-text bg-transparent border-end-0"><Search size={15} /></span>
            <input
              className="form-control border-start-0"
              placeholder="Search by hotel, tour or subject…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : logs.length === 0 ? (
        <div className="text-center py-5 text-muted border rounded-3 bg-white">
          <Mail size={40} className="mb-3 opacity-25" />
          <p>No emails found.</p>
        </div>
      ) : (
        <>
          <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
            <table className="table table-hover mb-0" style={{ fontSize: 14 }}>
              <thead style={{ background: "#f8faff" }}>
                <tr>
                  <th className="py-3 px-4">To</th>
                  <th className="py-3">Hotel</th>
                  <th className="py-3">Tour</th>
                  <th className="py-3">Subject</th>
                  <th className="py-3">Sent At</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Attachment</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td className="py-3 px-4">{log.to}</td>
                    <td className="py-3">{log.hotel?.name || "—"}</td>
                    <td className="py-3">{log.tour?.packageName || "—"}</td>
                    <td className="py-3" style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.subject}</td>
                    <td className="py-3 text-nowrap">{fmtDate(log.sentAt)}</td>
                    <td className="py-3">
                      <span className={`badge ${log.deliveryStatus === "SENT" ? "bg-success" : "bg-secondary"}`}>
                        {log.deliveryStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      {log.voucherAttached ? (
                        <span className="badge bg-primary"><Paperclip size={11} className="me-1" />PDF</span>
                      ) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-3">
              <button className="btn btn-outline-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span className="align-self-center text-muted fs-7">Page {page} of {pagination.totalPages}</span>
              <button className="btn btn-outline-secondary btn-sm" disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
