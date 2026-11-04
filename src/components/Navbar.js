import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar({ isAuth, user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutError, setLogoutError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on navigation
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const navItems = [
    {
      label: "Home",
      path: "/home",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      label: "3D Mart",
      path: "/3d-mart",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ),
    },
    {
      label: "Store Map",
      path: "/heatmap",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
        </svg>
      ),
    },
    {
      label: "Products",
      path: "/availability",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
        </svg>
      ),
    },
    {
      label: "My List",
      path: "/reminder-queue",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      ),
    },
  ];

  const handleLogout = async () => {
    setLogoutError("");
    try {
      await onLogout();
      navigate("/");
    } catch (error) {
      setLogoutError(error.message);
    }
  };

  return (
    <nav className={`gmr-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        {/* Logo */}
        <button
          className="nav-logo"
          onClick={() => navigate(isAuth ? "/home" : "/")}
          aria-label="GMR Smart Mart home"
        >
          <span className="nav-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#00e676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="nav-logo-text">
            GMR <span className="nav-logo-accent">Smart Mart</span>
          </span>
        </button>

        {/* Desktop Links */}
        <div className="nav-links">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-item-icon">{item.icon}</span>
              <span className="nav-item-label">{item.label}</span>
            </button>
          ))}

          {isAuth && user?.role === "customer" && (
            <button
              className={`nav-item ${location.pathname === "/orders" ? "active" : ""}`}
              onClick={() => navigate("/orders")}
            >
              <span className="nav-item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
              </span>
              <span className="nav-item-label">My Orders</span>
            </button>
          )}

          {isAuth && user?.role === "admin" && (
            <>
              <button
                className={`nav-item ${location.pathname === "/admin/hardware" ? "active" : ""}`}
                onClick={() => navigate("/admin/hardware")}
              >
                <span className="nav-item-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </span>
                <span className="nav-item-label">Hardware</span>
              </button>
              <button
                className={`nav-item ${location.pathname === "/admin/carts" ? "active" : ""}`}
                onClick={() => navigate("/admin/carts")}
              >
                <span className="nav-item-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
                  </svg>
                </span>
                <span className="nav-item-label">Carts</span>
              </button>
            </>
          )}
        </div>

        {/* Right Section */}
        <div className="nav-right">
          {isAuth ? (
            <div className="nav-user-area">
              <div className="nav-user-badge">
                <span className="nav-user-avatar">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </span>
                <div className="nav-user-info">
                  <span className="nav-user-email">{user?.email?.split("@")[0]}</span>
                  <span className={`nav-user-role ${user?.role === "admin" ? "admin" : "customer"}`}>
                    {user?.role}
                  </span>
                </div>
              </div>
              <button className="nav-logout-btn" onClick={handleLogout} title="Sign out">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button className="nav-signin-btn" onClick={() => navigate("/")}>
              Sign In
            </button>
          )}

          {/* Hamburger */}
          <button
            className={`nav-hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`nav-mobile-drawer ${menuOpen ? "open" : ""}`}>
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`nav-mobile-item ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            {item.icon} {item.label}
          </button>
        ))}
        {isAuth && user?.role === "customer" && (
          <button className={`nav-mobile-item ${location.pathname === "/orders" ? "active" : ""}`} onClick={() => navigate("/orders")}>
            Orders
          </button>
        )}
        {isAuth && (
          <button className="nav-mobile-item logout" onClick={handleLogout}>
            Sign Out
          </button>
        )}
      </div>

      {logoutError && (
        <p className="nav-error" role="alert">{logoutError}</p>
      )}
    </nav>
  );
}

export default Navbar;
