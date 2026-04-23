import React, { useState, useMemo } from "react";
import { useInvoices } from "../context/InvoiceContext";
import InvoiceCard from "./InvoiceCard";
import Filter from "./Filter";
import InvoiceForm from "./InvoiceForm";

import "./InvoiceList.css";

const PlusIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 11 11"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.313 5.5v5.5H4.688V5.5H-.001V3.875h4.689V-0.001h1.625V3.875h4.688V5.5z"
      fill="#7C5DFA"
      fillRule="nonzero"
    />
  </svg>
);

const EmptyIllustration = () => (
  <svg
    width="242"
    height="200"
    viewBox="0 0 242 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse
      cx="121"
      cy="185"
      rx="99"
      ry="15"
      fill="var(--color-border)"
      opacity="0.5"
    />
    <path
      d="M42 40h158l-18 120H60L42 40z"
      fill="var(--color-surface)"
      stroke="var(--color-border)"
      strokeWidth="2"
    />
    <rect
      x="62"
      y="64"
      width="118"
      height="8"
      rx="4"
      fill="var(--color-border)"
    />
    <rect
      x="62"
      y="84"
      width="80"
      height="8"
      rx="4"
      fill="var(--color-border)"
      opacity="0.6"
    />
    <rect
      x="62"
      y="104"
      width="100"
      height="8"
      rx="4"
      fill="var(--color-border)"
      opacity="0.4"
    />
    <rect
      x="62"
      y="124"
      width="60"
      height="8"
      rx="4"
      fill="var(--color-border)"
      opacity="0.3"
    />
    <circle cx="121" cy="30" r="22" fill="var(--color-brand)" opacity="0.15" />
    <path
      d="M121 20v20M111 30h20"
      stroke="var(--color-brand)"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export default function InvoiceList({ onViewInvoice }) {
  const { invoices, createInvoice } = useInvoices();
  const [filter, setFilter] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() => {
    if (filter.length === 0) return invoices;
    return invoices.filter((inv) => filter.includes(inv.status));
  }, [invoices, filter]);

  function handleSave(data) {
    createInvoice({ ...data, status: "pending" });
    setShowForm(false);
  }

  function handleSaveDraft(data) {
    createInvoice({ ...data, status: "draft" });
    setShowForm(false);
  }

  const count = filtered.length;
  const countLabel =
    count === 0
      ? "No invoices"
      : window.innerWidth < 640
        ? `${count} invoice${count !== 1 ? "s" : ""}`
        : `There are ${count} total invoice${count !== 1 ? "s" : ""}`;

  return (
    <main className="invoice-list">
      {/* Header */}
      <header className="invoice-list__header">
        <div className="invoice-list__title-group">
          <h1 className="invoice-list__title">Invoices</h1>
          <p className="invoice-list__count" aria-live="polite">
            {countLabel}
          </p>
        </div>

        <div className="invoice-list__actions">
          <Filter selected={filter} onChange={setFilter} />

          <button
            className="btn-new-invoice"
            onClick={() => setShowForm(true)}
            aria-label="Create new invoice"
          >
            <span className="btn-new-invoice__circle" aria-hidden="true">
              <PlusIcon />
            </span>
            <span className="btn-new-invoice__label">
              <span className="btn-new-invoice__label--desktop">
                New Invoice
              </span>
              <span className="btn-new-invoice__label--mobile">New</span>
            </span>
          </button>
        </div>
      </header>

      {/* Invoice cards / empty state */}
      {filtered.length > 0 ? (
        <ul className="invoice-list__items" aria-label="Invoice list">
          {filtered.map((invoice) => (
            <li key={invoice.id} className="invoice-list__item">
              <InvoiceCard invoice={invoice} onClick={onViewInvoice} />
            </li>
          ))}
        </ul>
      ) : (
        <div
          className="invoice-list__empty"
          role="status"
          aria-label="No invoices found"
        >
          <EmptyIllustration />
          <h2 className="invoice-list__empty-title">There is nothing here</h2>
          <p className="invoice-list__empty-body">
            {filter.length > 0
              ? `No invoices match the selected filter${filter.length > 1 ? "s" : ""}.`
              : "Create an invoice by clicking the New Invoice button and get started."}
          </p>
        </div>
      )}

      {/* Form slide-in panel */}
      {showForm && (
        <InvoiceForm
          onSave={handleSave}
          onSaveDraft={handleSaveDraft}
          onCancel={() => setShowForm(false)}
        />
      )}
    </main>
  );
}
