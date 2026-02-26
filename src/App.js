// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Heatmap from "./pages/Heatmap";
import StockPage from "./components/StockPage"; 
import Login from "./pages/Login";
import AdminDashboard from "./components/AdminDashboard"; 
import ScanCart from "./pages/ScanCart"; 
// Note: Create an empty ControlCart.js if you don't have one to prevent errors
import ControlCart from "./components/ControlCart"; 
import Navbar from "./components/Navbar";
import "./App.css";

const AppContent = () => {
  const [isAuth, setIsAuth] = useState(() => localStorage.getItem('gmr_auth') === 'true');
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuth(false);
    localStorage.removeItem('gmr_auth');
    navigate("/");
  };

  return (
    <>
      <Navbar isAuth={isAuth} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/heatmap" element={<Heatmap />} />
        <Route path="/availability" element={<StockPage />} /> 
        <Route path="/scan-cart" element={<ScanCart />} />
        <Route path="/control-cart" element={<ControlCart />} /> 
        <Route path="/terminal-v3-gate" element={isAuth ? <Navigate to="/admin-terminal" /> : <Login onLogin={() => setIsAuth(true)} />} />
        <Route path="/admin-terminal" element={isAuth ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}