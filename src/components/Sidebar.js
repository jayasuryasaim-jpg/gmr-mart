import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to check which page is active for styling
  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <aside className="global-sidebar">
      <div className="sidebar-header">
        <span className="gmr-text">GMR</span>
        <span className="mart-text">MART</span>
      </div>
      
      <nav className="sidebar-nav">
        <button className={`nav-btn ${isActive("/blueprint")}`} onClick={() => navigate("/blueprint")}>
          🧭 SYSTEM MAP
        </button>
        <button className={`nav-btn ${isActive("/discounts")}`} onClick={() => navigate("/discounts")}>
          🔥 HOT DEALS
        </button>
        <button className={`nav-btn ${isActive("/remote-control")}`} onClick={() => navigate("/remote-control")}>
          🎮 CART CONTROL
        </button>
        <button className={`nav-btn ${isActive("/checkout")}`} onClick={() => navigate("/checkout")}>
          🛒 CHECKOUT
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="status-indicator">SYSTEM: ONLINE</div>
      </div>
    </aside>
  );
}

export default Sidebar;