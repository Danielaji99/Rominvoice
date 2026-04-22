import React, { useState, useRef, useEffect } from "react";
import "./Filter.css";

const STATUSES = ["draft", "pending", "paid"];

const ChevronIcon = ({ open }) => (
  <svg
    width="11"
    height="7"
    viewBox="0 0 11 7"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      transform: open ? "rotate(180deg)" : "none",
      transition: "transform 0.2s ease",
    }}
  >
    <path
      d="M1 1l4.228 4.228L9.456 1"
      stroke="#7C5DFA"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="10"
    height="8"
    viewBox="0 0 10 8"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.5 4L3.833 6.5 8.5 1.5"
      stroke="#FFFFFF"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Filter({ selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function toggle(status) {
    if (selected.includes(status)) {
      onChange(selected.filter((s) => s !== status));
    } else {
      onChange([...selected, status]);
    }
  }

  return (
    <div className="filter" ref={ref}>
      <button
        className="filter__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Filter invoices by status"
      >
        <span className="filter__label">
          <span className="filter__label--mobile">Filter</span>
          <span className="filter__label--desktop">Filter by status</span>
        </span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div
          className="filter__menu"
          role="listbox"
          aria-multiselectable="true"
          aria-label="Invoice statuses"
        >
          {STATUSES.map((status) => (
            <label
              key={status}
              className="filter__option"
              role="option"
              aria-selected={selected.includes(status)}
            >
              <input
                type="checkbox"
                className="filter__checkbox-input"
                checked={selected.includes(status)}
                onChange={() => toggle(status)}
                aria-label={status}
              />
              <span
                className={`filter__checkbox ${selected.includes(status) ? "filter__checkbox--checked" : ""}`}
                aria-hidden="true"
              >
                {selected.includes(status) && <CheckIcon />}
              </span>
              <span className="filter__option-label">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
