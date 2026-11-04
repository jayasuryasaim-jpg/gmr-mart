import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { AuthProvider, useAuth } from "./auth/AuthProvider";
import { apiRequest, jsonBody } from "./services/api";
import "./App.css";

// --- PAGES ---
import Home from "./pages/Home";
import Login from "./pages/Login";
import Payment from "./pages/Payment";
import ReminderQueuePage from "./pages/ReminderQueuePage";
import RulesPage from "./pages/RulesPage";
import OrderHistory from "./pages/OrderHistory";
import HardwareSettings from "./pages/HardwareSettings";
import HardwareDashboard from "./pages/HardwareDashboard";
import ThreeDMart from "./pages/ThreeDMart";

// --- COMPONENTS ---
import Navbar from "./components/Navbar";
import Heatmap from "./components/Heatmap";
import StockPage from "./components/StockPage";
import TrackingPage from "./components/TrackingPage";
import CartControl from "./components/CartControl";

/* ──────────────────────────────────────────────
   SCAN CART PAGE
   ────────────────────────────────────────────── */
const ScanCart = () => {
  const scannerRef = useRef(null);
  const [scanMessage, setScanMessage] = useState(
    "Sign in to start a trolley session. Scanned QR data is not sent while signed out."
  );
  const [scanEnabled, setScanEnabled] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
    scannerRef.current.render(async (qrToken) => {
      if (!scanEnabled) return;
      setScanEnabled(false);
      if (!user) {
        setScanMessage("Sign in before scanning a trolley. The QR value was not sent to the server.");
        return;
      }
      setScanMessage("Checking trolley registration and device availability…");
      try {
        const result = await apiRequest("/api/v1/trolleys/scan", {
          method: "POST",
          body: jsonBody({ qrToken }),
        });
        setScanMessage(
          result.testOnly
            ? "Test simulator only: this is not a real trolley activation."
            : `Trolley session ${result.sessionId} started after hardware confirmation.`
        );
      } catch (error) {
        setScanMessage(`Trolley session could not start: ${error.message}`);
      }
    });
    return () => { if (scannerRef.current) scannerRef.current.clear(); };
  }, [scanEnabled, user]);

  return (
    <div style={{
      minHeight: "calc(100vh - 68px)",
      background: "var(--bg-base)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      gap: "24px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "520px",
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        borderRadius: "18px",
        padding: "40px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
      }}>
        <h2 style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1.6rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          letterSpacing: "-0.5px",
          textAlign: "center",
        }}>
          Trolley QR Scanner
        </h2>
        <p
          role="status"
          aria-live="polite"
          style={{
            color: "var(--text-secondary)",
            fontSize: "14px",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          {scanMessage}
        </p>
        {!scanEnabled && (
          <button
            type="button"
            onClick={() => setScanEnabled(true)}
            style={{
              padding: "11px 24px",
              background: "var(--grad-primary)",
              border: "none",
              borderRadius: "10px",
              color: "#060d1a",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Scan another trolley
          </button>
        )}
        <div
          id="reader"
          style={{
            width: "100%",
            maxWidth: "380px",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid var(--border-default)",
          }}
        />
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────
   ADMIN ACCESS FALLBACK
   ────────────────────────────────────────────── */
const AdminAccessUnavailable = () => (
  <main
    role="status"
    style={{
      maxWidth: 600,
      margin: "6rem auto",
      padding: "3rem",
      textAlign: "center",
      background: "var(--bg-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "18px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
    }}
  >
    <div style={{ fontSize: "3rem" }}>🚫</div>
    <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>
      Admin console unavailable
    </h1>
    <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
      This frontend does not include an administrator console. Privileged API actions
      require a server-authorized administrator account.
    </p>
  </main>
);

const AdminOnly = ({ children }) => {
  const { user } = useAuth();
  if (user?.role !== "admin") {
    return (
      <main
        role="status"
        style={{
          maxWidth: 600,
          margin: "6rem auto",
          padding: "3rem",
          textAlign: "center",
          background: "var(--bg-card)",
          border: "1px solid rgba(255,152,0,0.2)",
          borderRadius: "18px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div style={{ fontSize: "3rem" }}>🔒</div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>
          Administrator access required
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
          Hardware settings and simulation controls are available to authorized administrators only.
        </p>
      </main>
    );
  }
  return children;
};

/* ──────────────────────────────────────────────
   APP CONTENT
   ────────────────────────────────────────────── */
const AppContent = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== "/" && location.pathname !== "/admin-terminal" && location.pathname !== "/3d-mart";
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      {showNavbar && <Navbar isAuth={Boolean(user)} user={user} onLogout={logout} />}
      <div className="system-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/3d-mart" element={<ThreeDMart />} />
          <Route path="/availability" element={<StockPage />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/scan-cart" element={<ScanCart />} />
          <Route path="/control-cart" element={<CartControl />} />
          <Route path="/reminder-queue" element={<ReminderQueuePage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/admin/hardware" element={<AdminOnly><HardwareSettings /></AdminOnly>} />
          <Route path="/admin/carts" element={<AdminOnly><HardwareDashboard /></AdminOnly>} />
          <Route path="/admin-terminal" element={<AdminAccessUnavailable />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default function App() {
  return <AuthProvider><Router><AppContent /></Router></AuthProvider>;
}
