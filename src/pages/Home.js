import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ customers: 42, units: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        customers: prev.customers + (Math.random() > 0.5 ? 1 : -1),
        units: Math.max(0, prev.units + (Math.random() > 0.8 ? 1 : -1))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-content-wrapper">
      <div className="hud-container">
        <div className="hud-box">
          <span className="hud-label">SENSORS_ACTIVE</span>
          <span className="hud-value cyan-txt">{stats.customers} USERS</span>
        </div>
        <div className="hud-box">
          <span className="hud-label">CART_INVENTORY</span>
          <span className="hud-value green-txt">{stats.units} UNITS</span>
        </div>
      </div>

      <main className="center-stage">
        <div className="hero-branding">
          <h1 className="hero-title">GMR SMART MART</h1>
          <div className="interface-badge">AI-RETAIL INTERFACE V3.0</div>
        </div>

        {/* Professional Scanner Unit */}
        <div className="scanner-unit" onClick={() => navigate("/scan-cart")}>
          <div className="scan-beam"></div>
          <div className="qr-frame">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=GMR_ROOT&color=00f7ff&bgcolor=000c14" alt="QR" />
          </div>
        </div>
        <p className="scanner-hint">▶ TAP TO INITIALIZE SCANNER</p>
      </main>

      <footer className="terminal-footer">
        <div className="footer-line"></div>

      </footer>
    </div>
  );
}
export default Home;