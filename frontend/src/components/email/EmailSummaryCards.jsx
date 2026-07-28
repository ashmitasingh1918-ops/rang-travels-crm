import React from "react";
import { FaEnvelopeOpen, FaEnvelope, FaPaperPlane, FaFileInvoice } from "react-icons/fa";

export default function EmailSummaryCards({ emails }) {
  // Counts derived from active state data
  const pendingCount = emails.filter(m => m.status === "PENDING").length;
  const repliedCount = emails.filter(m => m.status === "REPLIED").length;
  const quotationsSent = emails.filter(m => m.status === "QUOTATION_SENT" || m.mailbox === "sent").length;
  const vouchersSent = emails.filter(m => m.status === "VOUCHER SENT").length;

  const cardsData = [
    {
      id: "pending",
      title: "Pending Replies",
      value: pendingCount,
      subtitle: "Awaiting hotel response",
      icon: <FaEnvelope className="fs-4" />,
      colorClass: "primary",
      bgColor: "rgba(13, 110, 253, 0.08)",
      textColor: "#0d6efd"
    },
    {
      id: "replied",
      title: "Received",
      value: repliedCount,
      subtitle: "Hotel replies received",
      icon: <FaEnvelopeOpen className="fs-4" />,
      colorClass: "success",
      bgColor: "rgba(25, 135, 84, 0.08)",
      textColor: "#198754"
    },
    {
      id: "quotations",
      title: "Quotations Sent",
      value: quotationsSent,
      subtitle: "Total quotations sent",
      icon: <FaPaperPlane className="fs-4" />,
      colorClass: "info",
      bgColor: "rgba(111, 66, 193, 0.08)", // Purple tone
      textColor: "#6f42c1"
    },
    {
      id: "vouchers",
      title: "Vouchers Sent",
      value: vouchersSent,
      subtitle: "Hotel vouchers sent",
      icon: <FaFileInvoice className="fs-4" />,
      colorClass: "warning",
      bgColor: "rgba(253, 126, 20, 0.08)", // Orange/warning tone
      textColor: "#fd7e14"
    }
  ];

  return (
    <div className="row g-3 mb-4">
      {cardsData.map((card) => (
        <div key={card.id} className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 rounded-xl p-3 bg-white shadow-sm d-flex align-items-center flex-row gap-3 transition-hover-card">
            <div
              className="p-3 rounded-circle d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: card.bgColor,
                color: card.textColor,
                width: "56px",
                height: "56px"
              }}
            >
              {card.icon}
            </div>
            <div>
              <h3 className="m-0 fw-extrabold text-dark h4">{card.value}</h3>
              <div className="fw-semibold text-dark fs-7 mt-0.5">{card.title}</div>
              <div className="text-secondary fs-8">{card.subtitle}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
