import React, { useState } from "react";
import { useInvoices } from "../context/InvoiceContext";
import StatusBadge from "./StatusBadge";
import Button from "./Button";
import DeleteModal from "./DeleteModal";
import InvoiceForm from "./InvoiceForm";
import { formatCurrency, formatDate } from "../utils/invoiceUtils";
import "./InvoiceDetail.css";

const ArrowLeft = () => (
  <svg
    width="7"
    height="10"
    viewBox="0 0 7 10"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 1L2 5l4 4"
      stroke="#7C5DFA"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function InvoiceDetail({ invoiceId, onBack }) {
  const { invoices, updateInvoice, deleteInvoice, markAsPaid } = useInvoices();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const invoice = invoices.find((inv) => inv.id === invoiceId);

  if (!invoice) {
    return (
      <main className="invoice-detail invoice-detail--not-found">
        <button className="back-btn" onClick={onBack} aria-label="Go back">
          <ArrowLeft /> Go back
        </button>
        <p>Invoice not found.</p>
      </main>
    );
  }

  function handleDelete() {
    deleteInvoice(invoice.id);
    setShowDeleteModal(false);
    onBack();
  }

  function handleMarkPaid() {
    markAsPaid(invoice.id);
  }

  function handleSaveEdit(updated) {
    updateInvoice(updated);
    setShowEditForm(false);
  }

  return (
    <>
      <main className="invoice-detail">
        {/* Back link */}
        <button
          className="back-btn"
          onClick={onBack}
          aria-label="Go back to invoices list"
        >
          <ArrowLeft /> Go back
        </button>

        {/* Status & action bar */}
        <div className="invoice-detail__topbar">
          <div className="invoice-detail__status-row">
            <span className="invoice-detail__status-label">Status</span>
            <StatusBadge status={invoice.status} />
          </div>

          <div
            className="invoice-detail__actions"
            role="group"
            aria-label="Invoice actions"
          >
            {invoice.status !== "paid" && (
              <Button variant="edit" onClick={() => setShowEditForm(true)}>
                Edit
              </Button>
            )}
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              Delete
            </Button>
            {invoice.status === "pending" && (
              <Button variant="primary" onClick={handleMarkPaid}>
                Mark as Paid
              </Button>
            )}
            {invoice.status === "draft" && (
              <Button
                variant="primary"
                onClick={() => updateInvoice({ ...invoice, status: "pending" })}
              >
                Send Invoice
              </Button>
            )}
          </div>
        </div>

        {/* Invoice body */}
        <div className="invoice-detail__body">
          {/* Top meta */}
          <div className="invoice-detail__meta">
            <div>
              <p className="invoice-detail__id">
                <span className="invoice-detail__hash" aria-hidden="true">
                  #
                </span>
                {invoice.id}
              </p>
              <p className="invoice-detail__desc">{invoice.description}</p>
            </div>
            <address className="invoice-detail__sender-address">
              <span>{invoice.senderAddress.street}</span>
              <span>{invoice.senderAddress.city}</span>
              <span>{invoice.senderAddress.postCode}</span>
              <span>{invoice.senderAddress.country}</span>
            </address>
          </div>

          {/* Dates, client info */}
          <div className="invoice-detail__info-grid">
            <div className="invoice-detail__info-col">
              <div>
                <dt className="invoice-detail__info-label">Invoice Date</dt>
                <dd className="invoice-detail__info-value">
                  {formatDate(invoice.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="invoice-detail__info-label">Payment Due</dt>
                <dd className="invoice-detail__info-value">
                  {formatDate(invoice.paymentDue)}
                </dd>
              </div>
            </div>

            <div className="invoice-detail__info-col">
              <dt className="invoice-detail__info-label">Bill To</dt>
              <dd className="invoice-detail__info-value invoice-detail__client-name">
                {invoice.clientName}
              </dd>
              <address className="invoice-detail__client-address">
                <span>{invoice.clientAddress.street}</span>
                <span>{invoice.clientAddress.city}</span>
                <span>{invoice.clientAddress.postCode}</span>
                <span>{invoice.clientAddress.country}</span>
              </address>
            </div>

            <div className="invoice-detail__info-col">
              <dt className="invoice-detail__info-label">Sent To</dt>
              <dd className="invoice-detail__info-value">
                {invoice.clientEmail}
              </dd>
            </div>
          </div>

          {/* Items table */}
          <div className="invoice-detail__items-section">
            <table className="items-table" aria-label="Invoice items">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="items-table__th items-table__th--name"
                  >
                    Item Name
                  </th>
                  <th
                    scope="col"
                    className="items-table__th items-table__th--qty"
                  >
                    QTY.
                  </th>
                  <th
                    scope="col"
                    className="items-table__th items-table__th--price"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="items-table__th items-table__th--total"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => {
                  const qty = parseFloat(item.quantity) || 0;
                  const price = parseFloat(item.price) || 0;
                  return (
                    <tr key={item.id} className="items-table__row">
                      <td className="items-table__td items-table__td--name">
                        {item.name}
                      </td>
                      <td className="items-table__td items-table__td--qty">
                        {qty}
                      </td>
                      <td className="items-table__td items-table__td--price">
                        {formatCurrency(price)}
                      </td>
                      <td className="items-table__td items-table__td--total">
                        {formatCurrency(qty * price)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Grand total */}
            <div className="invoice-detail__total">
              <span className="invoice-detail__total-label">Amount Due</span>
              <span className="invoice-detail__total-value">
                {formatCurrency(invoice.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile action bar */}
        <div
          className="invoice-detail__mobile-actions"
          role="group"
          aria-label="Invoice actions"
        >
          {invoice.status !== "paid" && (
            <Button variant="edit" onClick={() => setShowEditForm(true)}>
              Edit
            </Button>
          )}
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            Delete
          </Button>
          {invoice.status === "pending" && (
            <Button variant="primary" onClick={handleMarkPaid}>
              Mark as Paid
            </Button>
          )}
          {invoice.status === "draft" && (
            <Button
              variant="primary"
              onClick={() => updateInvoice({ ...invoice, status: "pending" })}
            >
              Send Invoice
            </Button>
          )}
        </div>
      </main>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {/* Edit form panel */}
      {showEditForm && (
        <InvoiceForm
          invoice={invoice}
          onSave={handleSaveEdit}
          onSaveDraft={handleSaveEdit}
          onCancel={() => setShowEditForm(false)}
        />
      )}
    </>
  );
}
