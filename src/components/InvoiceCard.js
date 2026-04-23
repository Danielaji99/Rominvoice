import React from "react";
import StatusBadge from "./StatusBadge";
import { formatCurrency, formatDate } from "../utils/invoiceUtils";
import "./InvoiceCard.css";

const ChevronRight = () => (
  <svg
    width="7"
    height="10"
    viewBox="0 0 7 10"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1l4 4-4 4"
      stroke="#7C5DFA"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function InvoiceCard({ invoice, onClick }) {
  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(invoice.id);
    }
  }

  return (
    <article
      className="invoice-card"
      onClick={() => onClick(invoice.id)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Invoice ${invoice.id}, ${invoice.clientName}, ${formatCurrency(invoice.total)}, status: ${invoice.status}`}
    >
      <span className="invoice-card__id">
        <span className="invoice-card__hash" aria-hidden="true">
          #
        </span>
        {invoice.id}
      </span>

      <span className="invoice-card__due">
        Due {formatDate(invoice.paymentDue)}
      </span>

      <span className="invoice-card__client">{invoice.clientName || "—"}</span>

      <span className="invoice-card__amount">
        {formatCurrency(invoice.total)}
      </span>

      <div className="invoice-card__status">
        <StatusBadge status={invoice.status} />
      </div>

      <span className="invoice-card__arrow" aria-hidden="true">
        <ChevronRight />
      </span>
    </article>
  );
}
