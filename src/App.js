import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Heatmap from "./pages/Heatmap";
import StockPage from "./components/StockPage"; 
import Login from "./pages/Login";
import AdminDashboard from "./components/AdminDashboard"; 
import ScanCart from "./pages/ScanCart"; 
import Navbar from "./components/Navbar";
import "./App.css";

// This wrapper allows us to use 'useNavigate' inside App
const AppContent = () => {
  const [isAuth, setIsAuth] = useState(() => localStorage.getItem('gmr_auth') === 'true');
  const navigate = useNavigate();

  // PRO-LEVEL SECURITY: KEYBOARD GHOST TRIGGER
  useEffect(() => {
    const handleSecretKey = (e) => {
      // Trigger: Shift + Alt + A
      if (e.shiftKey && e.altKey && e.key.toLowerCase() === 'a') {
        console.warn("ADMIN ACCESS DETECTED: Opening Secure Portal...");
        navigate("/terminal-v3-gate");
      }
    };

    window.addEventListener('keydown', handleSecretKey);
    return () => window.removeEventListener('keydown', handleSecretKey);
  }, [navigate]);

  const handleLogin = () => {
    setIsAuth(true);
    localStorage.setItem('gmr_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuth(false);
    localStorage.removeItem('gmr_auth');
  };

  return (
    <>
      <Navbar isAuth={isAuth} onLogout={handleLogout} />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/heatmap" element={<Heatmap />} />
        <Route path="/availability" element={<StockPage />} /> 
        <Route path="/scan-cart" element={<ScanCart />} />
        <Route path="/control-cart" element={<div>Cart Control Interface Ready</div>} />

        {/* GHOST LOGIN ROUTE (Hidden from Public) */}
        <Route path="/terminal-v3-gate" element={
          isAuth ? <Navigate to="/admin-terminal" /> : <Login onLogin={handleLogin} />
        } />
        
        {/* PROTECTED ADMIN TERMINAL */}
        <Route path="/admin-terminal" element={
          isAuth ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/" />
        } />

        {/* CATCH-ALL REDIRECT */}
        <Route path="/login" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;