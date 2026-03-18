import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar({ isAuth, onProfileClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "HOME", path: "/home" },
    { label: "LIVE CROWD", path: "/heatmap" },
    { label: "AVAILABILITY", path: "/availability" },
    // Updated: Pointing to the new Reminder Queue
    { label: "REMINDER LIST", path: "/reminder-queue" },
  ];

  return (
    <nav className="cyber-navbar">
      <div className="nav-logo" onClick={() => navigate(isAuth ? "/home" : "/")}>
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
          </button>
        ))}

        {isAuth && (
          <button className="nav-btn profile-trigger" onClick={onProfileClick}>
            <span className="btn-text">PROFILE</span>
          </button>
        )}
      </div>
      <div className="nav-bottom-line"></div>
    </nav>
  );
}
export default Navbar;