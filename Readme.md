# Invoice Management App

A fully responsive Invoice Management Application built with React. Matches the provided design spec with full CRUD, draft/paid flow, status filtering, and light/dark mode.

## Quick Start

```bash
npm install
npm start
# → http://localhost:3000
```

### Production Build
```bash
npm run build
npx serve -s build
```

## Features

| Feature | Status |
|---------|--------|
| Create / Read / Update / Delete invoices | ✅ |
| Save as Draft | ✅ |
| Mark as Paid | ✅ |
| Form validation (all fields + items) | ✅ |
| Filter by status (All / Draft / Pending / Paid) | ✅ |
| Light and Dark mode (persisted to localStorage) | ✅ |
| Full responsiveness (320px to 1440px+) | ✅ |
| Hover states on all interactive elements | ✅ |
| Data persistence via localStorage | ✅ |
| Accessible delete confirmation modal | ✅ |
| Keyboard navigation throughout | ✅ |

## Architecture

```
src/
├── components/
│   ├── Button.js / .css          # Reusable button, 5 variants
│   ├── DeleteModal.js / .css     # Accessible confirmation dialog
│   ├── Filter.js / .css          # Multi-select status filter dropdown
│   ├── InvoiceCard.js / .css     # Single row/card in invoice list
│   ├── InvoiceDetail.js / .css   # Full invoice view page
│   ├── InvoiceForm.js / .css     # Slide-in create/edit panel
│   ├── InvoiceList.js / .css     # Main list page with header
│   ├── Sidebar.js / .css         # Vertical nav (desktop) / top bar (mobile)
│   └── StatusBadge.js / .css     # Colored pill: draft / pending / paid
├── context/
│   ├── InvoiceContext.js         # Global invoice state via useReducer
│   └── ThemeContext.js           # Light/dark mode state
├── utils/
│   └── invoiceUtils.js           # Pure helpers: format, validate, generate IDs
├── App.js                         # Root: layout + lightweight view router
├── App.css                        # Layout wrapper
└── index.css                      # CSS design tokens + global reset
```

## Key Architectural Decisions

**No External Router** — Two views (list, detail) wired via `view` state in App.js. A full router would be over-engineering for this scope.

**useReducer for Invoice State** — All mutations are centralized, explicit, and automatically recalculate derived fields (total, paymentDue) before persisting.

**CSS Custom Properties for Theming** — All colors are CSS variables on `:root` / `[data-theme="dark"]`. One `setAttribute` call toggles the entire theme.

**forwardRef on TextInput** — Allows InvoiceForm to programmatically focus the first field on mount for accessibility.

**Validation Strategy** — Draft saves skip validation. Save & Send collects all errors in a single pass and shows both inline field errors and a footer summary.

## Status Flow

```
Create → Draft → (Send) → Pending → (Mark as Paid) → Paid
```
- Draft: edit, send, delete
- Pending: edit, mark paid, delete
- Paid: read-only, delete only

## Accessibility

- All form fields: `<label>` + `htmlFor` + `id`
- All actions: `<button>` elements
- Modal: `role="dialog"`, `aria-modal`, focus trap, ESC to close, safe button focused by default
- Filter: `role="listbox"` / `role="option"` / `aria-selected`
- Status badges: `aria-label` with human-readable text
- Errors: `role="alert"` for screen reader announcement
- Color contrast: WCAG AA in both themes
- `:focus-visible` outlines throughout

## Trade-offs

| Decision | Note |
|----------|------|
| localStorage only | Simple and instant. IndexedDB or a REST API would suit larger / multi-user needs. |
| Lightweight router | Zero dependency for 2 views. Switch to react-router if deep-linking is needed. |
| Plain CSS + BEM | Simple for this scope. CSS Modules add stronger scoping for larger teams. |
| No TypeScript | Lower setup friction. PropTypes could be added for runtime checks. |

## Potential Improvements

- IndexedDB for larger datasets / offline support
- URL routing for deep-linkable invoice pages
- PDF export per invoice
- Undo / optimistic UI for deletes
- Unit tests with React Testing Library
- Multi-currency / i18n support
