import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";

// --- PAGES ---
import Home from "./pages/Home";
import Login from "./pages/Login";
import ReminderQueuePage from "./pages/ReminderQueuePage";
import RulesPage from "./pages/RulesPage";

// --- COMPONENTS ---
import AdminDashboard from "./components/AdminDashboard";
import Navbar from "./components/Navbar";
import Heatmap from "./components/Heatmap";
import StockPage from "./components/StockPage";
import TrackingPage from "./components/TrackingPage";
// FIXED: Changed from ControlCart to CartControl to match your file system
import CartControl from "./components/CartControl"; 
import ProfileModal from "./components/ProfileModal";

// --- SCANNER LOGIC ---
const ScanCart = ({ onScanSuccess }) => {
  const navigate = useNavigate();
  const scannerRef = useRef(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
    scannerRef.current.render(async (text) => {
      // Logic for your specific secure trolley QR
      if (text === "GMR_TROLLEY_01_SECURE") {
        onScanSuccess(); 
      }
    });
    return () => { if (scannerRef.current) scannerRef.current.clear(); };
  }, [onScanSuccess]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2 style={{ color: '#00f7ff', marginBottom: '20px', fontFamily: 'Orbitron' }}>INITIALIZING RADAR...</h2>
      <div id="reader" style={{ width: '100%', maxWidth: '400px', margin: 'auto' }}></div>
    </div>
  );
};

// --- APP CONTENT ---
const AppContent = () => {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('gmr_auth'));
  const [showProfile, setShowProfile] = useState(false);
  const [isCartActive, setIsCartActive] = useState(localStorage.getItem('cart_unlocked') === 'true');
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (authData) => {
    setIsAuth(true);
    localStorage.setItem('gmr_auth', 'true');
    localStorage.setItem('gmr_role', authData.type);
    navigate(authData.type === 'admin' ? '/admin-terminal' : '/home');
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuth(false);
    setIsCartActive(false);
    navigate("/");
  };

  const handleScanSuccess = () => {
    localStorage.setItem("cart_unlocked", "true");
    setIsCartActive(true);
    navigate("/control-cart");
  };

  return (
    <div className="app-shell">
      <style>{`
        :root { --cyan: #00f7ff; }
        .app-shell { background: #01080e; min-height: 100vh; width: 100%; overflow-x: hidden; }
        .system-container { width: 100%; min-height: calc(100vh - 70px); box-sizing: border-box; }
        
        .sticky-cart-btn {
          position: fixed; bottom: 20px; right: 20px;
          background: var(--cyan); color: #000;
          padding: 12px 20px; border-radius: 50px;
          font-family: 'Orbitron', sans-serif; font-weight: bold; font-size: 0.8rem;
          box-shadow: 0 0 15px var(--cyan); z-index: 999; cursor: pointer;
          animation: pulse 2s infinite; border: none;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>

      {isAuth && <Navbar isAuth={isAuth} onProfileClick={() => setShowProfile(true)} />}
      
      {isAuth && isCartActive && location.pathname !== "/control-cart" && (
        <button className="sticky-cart-btn" onClick={() => navigate("/control-cart")}>
          VIEW ACTIVE CART 🛒
        </button>
      )}

      {showProfile && (
        <ProfileModal 
          user={JSON.parse(localStorage.getItem('gmr_user') || '{"name":"M. Jayasuryasasi", "customerId":"GMR-C231"}')} 
          onClose={() => setShowProfile(false)} 
          onLogout={handleLogout} 
        />
      )}

      <div className="system-container">
        <Routes>
          <Route path="/" element={!isAuth ? <Login onLogin={handleLogin} /> : <Navigate to="/home" />} />
          <Route path="/home" element={isAuth ? <Home /> : <Navigate to="/" />} />
          <Route path="/availability" element={isAuth ? <StockPage /> : <Navigate to="/" />} />
          <Route path="/heatmap" element={isAuth ? <Heatmap /> : <Navigate to="/" />} />
          <Route path="/tracking" element={isAuth ? <TrackingPage /> : <Navigate to="/" />} />
          <Route path="/scan-cart" element={isAuth ? <ScanCart onScanSuccess={handleScanSuccess} /> : <Navigate to="/" />} />
          <Route path="/control-cart" element={isAuth ? <CartControl /> : <Navigate to="/" />} />
          <Route path="/reminder-queue" element={isAuth ? <ReminderQueuePage /> : <Navigate to="/" />} />
          <Route path="/rules" element={isAuth ? <RulesPage /> : <Navigate to="/" />} />
          <Route path="/admin-terminal" element={isAuth ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default function App() { 
  return <Router><AppContent /></Router>; 
}