import React, { useState } from "react";
import { InvoiceProvider } from "./context/InvoiceContext";
import { ThemeProvider } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import InvoiceList from "./components/InvoiceList";
import InvoiceDetail from "./components/InvoiceDetail";
import "./App.css";

function App() {
  const [view, setView] = useState("list");
  const [activeId, setActiveId] = useState(null);

  function navigateTo(id) {
    setActiveId(id);
    setView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigateBack() {
    setView("list");
    setActiveId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <ThemeProvider>
      <InvoiceProvider>
        <div className="app-layout">
          <Sidebar />
          <div className="app-content">
            {view === "list" && <InvoiceList onViewInvoice={navigateTo} />}
            {view === "detail" && (
              <InvoiceDetail invoiceId={activeId} onBack={navigateBack} />
            )}
          </div>
        </div>
      </InvoiceProvider>
    </ThemeProvider>
  );
}

export default App;
