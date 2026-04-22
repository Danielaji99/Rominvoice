import React, { useEffect, useRef } from "react";
import Button from "./Button";
import "./DeleteModal.css";

export default function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  const cancelRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handleTab(e) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") onCancel();
    }

    modal.addEventListener("keydown", handleTab);
    document.addEventListener("keydown", handleEsc);
    return () => {
      modal.removeEventListener("keydown", handleTab);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onCancel]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="modal-backdrop" onClick={onCancel} aria-hidden="true">
      <div
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="modal__title">
          Confirm Deletion
        </h2>
        <p className="modal__body">
          Are you sure you want to delete invoice #{invoiceId}? This action
          cannot be undone.
        </p>
        <div className="modal__actions">
          <button
            ref={cancelRef}
            className="btn btn--secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
