import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import {
  SEED_INVOICES,
  calculateTotal,
  calculateDueDate,
} from "../utils/invoiceUtils";

const STORAGE_KEY = "invoice_app_data";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load from localStorage", e);
  }
  return null;
}

function saveToStorage(invoices) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  } catch (e) {
    console.warn("Failed to save to localStorage", e);
  }
}

function invoiceReducer(state, action) {
  let next;
  switch (action.type) {
    case "CREATE": {
      const invoice = {
        ...action.payload,
        total: calculateTotal(action.payload.items),
        paymentDue: calculateDueDate(
          action.payload.createdAt,
          action.payload.paymentTerms,
        ),
      };
      next = [invoice, ...state];
      break;
    }
    case "UPDATE": {
      next = state.map((inv) =>
        inv.id === action.payload.id
          ? {
              ...action.payload,
              total: calculateTotal(action.payload.items),
              paymentDue: calculateDueDate(
                action.payload.createdAt,
                action.payload.paymentTerms,
              ),
            }
          : inv,
      );
      break;
    }
    case "DELETE":
      next = state.filter((inv) => inv.id !== action.payload);
      break;
    case "MARK_PAID":
      next = state.map((inv) =>
        inv.id === action.payload ? { ...inv, status: "paid" } : inv,
      );
      break;
    default:
      return state;
  }
  saveToStorage(next);
  return next;
}

const InvoiceContext = createContext(null);

export function InvoiceProvider({ children }) {
  const stored = loadFromStorage();
  const [invoices, dispatch] = useReducer(
    invoiceReducer,
    stored || SEED_INVOICES,
  );

  useEffect(() => {
    if (!loadFromStorage()) {
      saveToStorage(SEED_INVOICES);
    }
  }, []);

  const createInvoice = useCallback((data) => {
    dispatch({ type: "CREATE", payload: data });
  }, []);

  const updateInvoice = useCallback((data) => {
    dispatch({ type: "UPDATE", payload: data });
  }, []);

  const deleteInvoice = useCallback((id) => {
    dispatch({ type: "DELETE", payload: id });
  }, []);

  const markAsPaid = useCallback((id) => {
    dispatch({ type: "MARK_PAID", payload: id });
  }, []);

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        markAsPaid,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error("useInvoices must be used within InvoiceProvider");
  return ctx;
}
