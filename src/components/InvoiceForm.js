import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
} from "react";
import Button from "./Button";
import {
  validateInvoice,
  createBlankItem,
  calculateTotal,
  calculateDueDate,
  createBlankInvoice,
} from "../utils/invoiceUtils";
import "./InvoiceForm.css";

// Icons
const TrashIcon = () => (
  <svg
    width="13"
    height="16"
    viewBox="0 0 13 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.583 3.556h-2.334V2.667C9.25 1.747 8.505 1 7.584 1H5.417C4.496 1 3.75 1.747 3.75 2.667v.889H1.417a.444.444 0 000 .888h.444v8c0 .98.796 1.778 1.778 1.778h5.722c.982 0 1.778-.797 1.778-1.778v-8h.444a.444.444 0 000-.888zm-6.945-.889c0-.489.4-.889.89-.889h2.166c.49 0 .89.4.89.889v.889H4.638v-.889zm5.306 9.777a.89.89 0 01-.889.89H3.639a.89.89 0 01-.889-.89v-8h7.194v8z"
      fill="#888EB0"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 11 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.313 5.5v5.5H4.688V5.5H-.001V3.875h4.689V-.001h1.625V3.875h4.688V5.5z"
      fill="#7C5DFA"
    />
  </svg>
);

const BackArrow = () => (
  <svg
    width="7"
    height="10"
    viewBox="0 0 7 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 1L2 5l4 4"
      stroke="#7C5DFA"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function FormField({ label, error, children, id }) {
  return (
    <div className={`form-field${error ? " form-field--error" : ""}`}>
      <label className="form-field__label" htmlFor={id}>
        <span>{label}</span>
        {error && (
          <span className="form-field__error" role="alert">
            {error}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

const TextInput = forwardRef(function TextInput(
  { id, value, onChange, error, placeholder, type = "text", disabled, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      id={id}
      type={type}
      className={`form-input${error ? " form-input--error" : ""}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={!!error}
      {...rest}
    />
  );
});

function SelectInput({ id, value, onChange, children }) {
  return (
    <select
      id={id}
      className="form-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {children}
    </select>
  );
}

function AddressGroup({ prefix, label, values, onChange, errors }) {
  function field(key) {
    return {
      value: values[key] || "",
      onChange: (val) => onChange({ ...values, [key]: val }),
      error: errors[`${prefix}.${key}`],
    };
  }

  return (
    <fieldset className="form-address-group">
      <legend className="form-address-group__legend">{label}</legend>
      <div className="form-row form-row--full">
        <FormField
          label="Street Address"
          error={errors[`${prefix}.street`]}
          id={`${prefix}-street`}
        >
          <TextInput id={`${prefix}-street`} {...field("street")} />
        </FormField>
      </div>
      <div className="form-row form-row--3">
        <FormField
          label="City"
          error={errors[`${prefix}.city`]}
          id={`${prefix}-city`}
        >
          <TextInput id={`${prefix}-city`} {...field("city")} />
        </FormField>
        <FormField
          label="Post Code"
          error={errors[`${prefix}.postCode`]}
          id={`${prefix}-postCode`}
        >
          <TextInput id={`${prefix}-postCode`} {...field("postCode")} />
        </FormField>
        <FormField
          label="Country"
          error={errors[`${prefix}.country`]}
          id={`${prefix}-country`}
        >
          <TextInput id={`${prefix}-country`} {...field("country")} />
        </FormField>
      </div>
    </fieldset>
  );
}

function ItemRow({ item, index, onChange, onDelete, errors }) {
  const qty = parseFloat(item.quantity) || 0;
  const price = parseFloat(item.price) || 0;
  const total = qty * price;

  return (
    <div className="item-row">
      <div className="item-row__name">
        <FormField
          label="Item Name"
          error={errors[`items[${index}].name`]}
          id={`item-name-${index}`}
        >
          <TextInput
            id={`item-name-${index}`}
            value={item.name}
            onChange={(val) => onChange({ ...item, name: val })}
            error={errors[`items[${index}].name`]}
          />
        </FormField>
      </div>
      <div className="item-row__qty">
        <FormField
          label="Qty."
          error={errors[`items[${index}].quantity`]}
          id={`item-qty-${index}`}
        >
          <TextInput
            id={`item-qty-${index}`}
            type="number"
            min="1"
            value={item.quantity}
            onChange={(val) => onChange({ ...item, quantity: val })}
            error={errors[`items[${index}].quantity`]}
          />
        </FormField>
      </div>
      <div className="item-row__price">
        <FormField
          label="Price"
          error={errors[`items[${index}].price`]}
          id={`item-price-${index}`}
        >
          <TextInput
            id={`item-price-${index}`}
            type="number"
            min="0"
            step="0.01"
            value={item.price}
            onChange={(val) => onChange({ ...item, price: val })}
            error={errors[`items[${index}].price`]}
          />
        </FormField>
      </div>
      <div className="item-row__total">
        <span className="item-row__total-label">Total</span>
        <span className="item-row__total-value">{total.toFixed(2)}</span>
      </div>
      <button
        type="button"
        className="item-row__delete"
        onClick={() => onDelete(item.id)}
        aria-label={`Remove item ${item.name || index + 1}`}
      >
        <TrashIcon />
      </button>
    </div>
  );
}

export default function InvoiceForm({
  invoice: editInvoice,
  onSave,
  onSaveDraft,
  onCancel,
}) {
  const isEditing = !!editInvoice;
  const [form, setForm] = useState(() => editInvoice || createBlankInvoice());
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => firstFieldRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const total = calculateTotal(form.items);
  const paymentDue = calculateDueDate(form.createdAt, form.paymentTerms);

  const set = useCallback(
    (key, val) => setForm((f) => ({ ...f, [key]: val })),
    [],
  );

  function setAddress(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function addItem() {
    setForm((f) => ({ ...f, items: [...f.items, createBlankItem()] }));
  }

  function updateItem(id, updated) {
    setForm((f) => ({
      ...f,
      items: f.items.map((it) => (it.id === id ? updated : it)),
    }));
  }

  function deleteItem(id) {
    setForm((f) => ({ ...f, items: f.items.filter((it) => it.id !== id) }));
  }

  function handleSave() {
    const errs = validateInvoice(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setShowErrors(true);
      document
        .querySelector(".form-input--error, .form-field--error")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      return;
    }
    onSave({
      ...form,
      total,
      paymentDue,
      status: isEditing ? form.status : "pending",
    });
  }

  function handleSaveDraft() {
    onSaveDraft({ ...form, total, paymentDue, status: "draft" });
  }

  const hasErrors = showErrors && Object.keys(errors).length > 0;

  return (
    <>
      <div className="form-overlay" onClick={onCancel} aria-hidden="true" />

      <div
        className="form-panel"
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? `Edit Invoice #${form.id}` : "New Invoice"}
      >
        <div className="form-panel__inner">
          {/* Mobile back */}
          <button
            className="form-panel__back"
            onClick={onCancel}
            aria-label="Go back"
          >
            <BackArrow />
            Go back
          </button>

          <h1 className="form-panel__title">
            {isEditing ? (
              <>
                <span className="form-panel__title-hash">#</span>
                {form.id}
              </>
            ) : (
              "New Invoice"
            )}
          </h1>

          <div className="form-panel__scroll">
            <form noValidate onSubmit={(e) => e.preventDefault()}>
              {/* Bill From */}
              <AddressGroup
                prefix="senderAddress"
                label="Bill From"
                values={form.senderAddress}
                onChange={(val) => setAddress("senderAddress", val)}
                errors={errors}
              />

              {/* Bill To */}
              <section className="form-section">
                <h2 className="form-section__title">Bill To</h2>

                <div className="form-row form-row--full">
                  <FormField
                    label="Client's Name"
                    error={errors.clientName}
                    id="clientName"
                  >
                    <TextInput
                      ref={firstFieldRef}
                      id="clientName"
                      value={form.clientName}
                      onChange={(val) => set("clientName", val)}
                      error={errors.clientName}
                    />
                  </FormField>
                </div>

                <div className="form-row form-row--full">
                  <FormField
                    label="Client's Email"
                    error={errors.clientEmail}
                    id="clientEmail"
                  >
                    <TextInput
                      id="clientEmail"
                      type="email"
                      placeholder="e.g. email@example.com"
                      value={form.clientEmail}
                      onChange={(val) => set("clientEmail", val)}
                      error={errors.clientEmail}
                    />
                  </FormField>
                </div>

                <AddressGroup
                  prefix="clientAddress"
                  label="Client's Address"
                  values={form.clientAddress}
                  onChange={(val) => setAddress("clientAddress", val)}
                  errors={errors}
                />
              </section>

              {/* Dates & terms */}
              <div className="form-row form-row--2">
                <FormField
                  label="Invoice Date"
                  error={errors.createdAt}
                  id="createdAt"
                >
                  <TextInput
                    id="createdAt"
                    type="date"
                    value={form.createdAt}
                    onChange={(val) => set("createdAt", val)}
                    error={errors.createdAt}
                    disabled={isEditing}
                  />
                </FormField>
                <FormField label="Payment Terms" id="paymentTerms">
                  <SelectInput
                    id="paymentTerms"
                    value={form.paymentTerms}
                    onChange={(val) => set("paymentTerms", Number(val))}
                  >
                    <option value={1}>Net 1 Day</option>
                    <option value={7}>Net 7 Days</option>
                    <option value={14}>Net 14 Days</option>
                    <option value={30}>Net 30 Days</option>
                  </SelectInput>
                </FormField>
              </div>

              <div className="form-row form-row--full">
                <FormField
                  label="Project Description"
                  error={errors.description}
                  id="description"
                >
                  <TextInput
                    id="description"
                    placeholder="e.g. Graphic Design Service"
                    value={form.description}
                    onChange={(val) => set("description", val)}
                    error={errors.description}
                  />
                </FormField>
              </div>

              {/* Item list */}
              <div className="item-list">
                <h3 className="item-list__title">Item List</h3>

                {form.items.length > 0 && (
                  <div className="item-list__items" aria-label="Invoice items">
                    {form.items.map((item, idx) => (
                      <ItemRow
                        key={item.id}
                        item={item}
                        index={idx}
                        onChange={(updated) => updateItem(item.id, updated)}
                        onDelete={deleteItem}
                        errors={errors}
                      />
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  className="item-list__add-btn"
                  onClick={addItem}
                  aria-label="Add a new item"
                >
                  <PlusIcon />
                  Add New Item
                </button>
              </div>

              {/* Error summary */}
              {hasErrors && (
                <div
                  className="form-error-summary"
                  role="alert"
                  aria-live="assertive"
                >
                  {errors.items && <p>— An item must be added</p>}
                  {Object.keys(errors).some((k) => k !== "items") && (
                    <p>— All fields must be filled in</p>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="form-panel__footer">
            {isEditing ? (
              <>
                <Button variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={onCancel}
                  className="form-panel__discard"
                >
                  Discard
                </Button>
                <div className="form-panel__right-actions">
                  <button
                    type="button"
                    className="btn btn--draft"
                    onClick={handleSaveDraft}
                  >
                    Save as Draft
                  </button>
                  <Button variant="primary" onClick={handleSave}>
                    Save &amp; Send
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
