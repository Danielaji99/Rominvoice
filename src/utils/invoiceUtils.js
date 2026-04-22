import { v4 as uuidv4 } from "uuid";
import { format, addDays } from "date-fns";

export function generateInvoiceId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const letter1 = letters[Math.floor(Math.random() * letters.length)];
  const letter2 = letters[Math.floor(Math.random() * letters.length)];
  const numbers = String(Math.floor(Math.random() * 9000) + 1000);
  return `${letter1}${letter2}${numbers}`;
}

export function calculateTotal(items = []) {
  return items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.price) || 0;
    return sum + qty * price;
  }, 0);
}

export function calculateDueDate(createdAt, paymentTerms) {
  if (!createdAt || !paymentTerms) return "";
  return format(
    addDays(new Date(createdAt), parseInt(paymentTerms, 10)),
    "yyyy-MM-dd",
  );
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(amount || 0);
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    return format(new Date(dateStr), "d MMM yyyy");
  } catch {
    return dateStr;
  }
}

export function createBlankItem() {
  return {
    id: uuidv4(),
    name: "",
    quantity: "",
    price: "",
  };
}

export function createBlankInvoice() {
  const today = format(new Date(), "yyyy-MM-dd");
  return {
    id: generateInvoiceId(),
    createdAt: today,
    paymentDue: "",
    description: "",
    paymentTerms: 30,
    clientName: "",
    clientEmail: "",
    status: "draft",
    senderAddress: { street: "", city: "", postCode: "", country: "" },
    clientAddress: { street: "", city: "", postCode: "", country: "" },
    items: [createBlankItem()],
    total: 0,
  };
}

export function validateInvoice(invoice) {
  const errors = {};
  if (!invoice.senderAddress.street.trim())
    errors["senderAddress.street"] = "Required";
  if (!invoice.senderAddress.city.trim())
    errors["senderAddress.city"] = "Required";
  if (!invoice.senderAddress.postCode.trim())
    errors["senderAddress.postCode"] = "Required";
  if (!invoice.senderAddress.country.trim())
    errors["senderAddress.country"] = "Required";
  if (!invoice.clientName.trim()) errors.clientName = "Required";
  if (!invoice.clientEmail.trim()) {
    errors.clientEmail = "Required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invoice.clientEmail)) {
    errors.clientEmail = "Must be a valid email";
  }
  if (!invoice.clientAddress.street.trim())
    errors["clientAddress.street"] = "Required";
  if (!invoice.clientAddress.city.trim())
    errors["clientAddress.city"] = "Required";
  if (!invoice.clientAddress.postCode.trim())
    errors["clientAddress.postCode"] = "Required";
  if (!invoice.clientAddress.country.trim())
    errors["clientAddress.country"] = "Required";
  if (!invoice.createdAt) errors.createdAt = "Required";
  if (!invoice.description.trim()) errors.description = "Required";

  if (!invoice.items || invoice.items.length === 0) {
    errors.items = "An item must be added";
  } else {
    invoice.items.forEach((item, idx) => {
      if (!item.name.trim()) errors[`items[${idx}].name`] = "Required";
      if (!item.quantity || parseFloat(item.quantity) <= 0)
        errors[`items[${idx}].quantity`] = "Must be > 0";
      if (!item.price || parseFloat(item.price) < 0)
        errors[`items[${idx}].price`] = "Must be >= 0";
    });
  }

  return errors;
}

// Seed data for initial app state

export const SEED_INVOICES = [
  {
    id: "RT3080",
    createdAt: "2021-08-18",
    paymentDue: "2021-09-19",
    description: "Re-branding",
    paymentTerms: 30,
    clientName: "Jensen Huang",
    clientEmail: "jensenh@mail.com",
    status: "paid",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "106 Kendell Street",
      city: "Sharrington",
      postCode: "NR24 5WQ",
      country: "United Kingdom",
    },
    items: [
      { id: uuidv4(), name: "Brand Guidelines", quantity: 1, price: 1800.9 },
    ],
    total: 1800.9,
  },
  {
    id: "XM9141",
    createdAt: "2021-08-21",
    paymentDue: "2021-09-20",
    description: "Graphic Design",
    paymentTerms: 30,
    clientName: "Alex Grim",
    clientEmail: "alexgrim@mail.com",
    status: "pending",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "84 Church Way",
      city: "Bradford",
      postCode: "BD1 9PB",
      country: "United Kingdom",
    },
    items: [
      { id: uuidv4(), name: "Banner Design", quantity: 1, price: 156.0 },
      { id: uuidv4(), name: "Email Design", quantity: 2, price: 200.0 },
    ],
    total: 556.0,
  },
  {
    id: "RG0314",
    createdAt: "2021-09-24",
    paymentDue: "2021-10-01",
    description: "Website Redesign",
    paymentTerms: 7,
    clientName: "John Morrison",
    clientEmail: "jm@myco.com",
    status: "paid",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "79 Dover Road",
      city: "Westhall",
      postCode: "IP19 3PF",
      country: "United Kingdom",
    },
    items: [
      { id: uuidv4(), name: "Website Redesign", quantity: 1, price: 14002.33 },
    ],
    total: 14002.33,
  },
  {
    id: "TY9141",
    createdAt: "2021-10-01",
    paymentDue: "2021-10-08",
    description: "Landing Page Design",
    paymentTerms: 7,
    clientName: "Alysa Werner",
    clientEmail: "alysa@email.co.uk",
    status: "pending",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "63 Warwick Road",
      city: "Carlisle",
      postCode: "CA20 2TG",
      country: "United Kingdom",
    },
    items: [
      { id: uuidv4(), name: "Landing Page Design", quantity: 3, price: 102.04 },
    ],
    total: 306.12,
  },
  {
    id: "FV2353",
    createdAt: "2021-10-12",
    paymentDue: "2021-11-12",
    description: "Logo Concept",
    paymentTerms: 30,
    clientName: "Mellisa Clarke",
    clientEmail: "mellisa.clarke@example.com",
    status: "pending",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "46 Abbey Row",
      city: "Cambridge",
      postCode: "CB5 6EG",
      country: "United Kingdom",
    },
    items: [
      { id: uuidv4(), name: "Logo Sketches", quantity: 1, price: 102.04 },
    ],
    total: 102.04,
  },
  {
    id: "RV1049",
    createdAt: "2021-10-07",
    paymentDue: "2021-10-14",
    description: "Portfolio Website",
    paymentTerms: 7,
    clientName: "Anita Wainwright",
    clientEmail: "anita.wainwright@email.com",
    status: "draft",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: { street: "", city: "", postCode: "", country: "" },
    items: [
      { id: uuidv4(), name: "Portfolio Design", quantity: 1, price: 200.0 },
    ],
    total: 200.0,
  },
];
