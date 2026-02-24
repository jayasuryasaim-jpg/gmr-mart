import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar({ isAuth, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "HOME", path: "/" },
    { label: "LIVE CROWD", path: "/heatmap" },
    { label: "AVAILABILITY", path: "/availability" },
  ];

  return (
    <nav className="cyber-navbar">
      <div className="nav-logo" onClick={() => navigate("/")}>
        GMR <span className="logo-accent">SMART MART</span>
      </div>

      <div className="nav-links-container">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`nav-btn ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="btn-text">{item.label}</span>
            <div className="btn-glimmer"></div>
          </button>
        ))}

        {isAuth ? (
          <button className="nav-btn logout-btn" onClick={onLogout}>
            <span className="btn-text">TERMINATE SESSION</span>
            <div className="btn-glimmer"></div>
          </button>
        ) : (
          <button
            className={`nav-btn login-btn-nav ${location.pathname === "/login" ? "active" : ""}`}
            onClick={() => navigate("/login")}
          >
            <span className="btn-text">ADMIN LOGIN</span>
            <div className="btn-glimmer"></div>
          </button>
        )}
      </div>
      
      <div className="nav-bottom-line"></div>
    </nav>
  );
}

export default Navbar;