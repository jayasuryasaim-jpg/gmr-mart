import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ customers: 40, units: 4 });

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
      {/* SENSOR HUD - Individual boxes with color-coded data */}
      <div className="hud-display">
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
        {/* HERO SECTION */}
        <div className="hero-branding">
          <h1 className="hero-title">GMR CORE</h1>
          <div className="badge-aligner">
            <div className="interface-badge">AI-RETAIL INTERFACE V3.0</div>
          </div>
        </div>

        {/* SCANNER UNIT - Perfectly Centered */}
        <div className="scanner-unit" onClick={() => navigate("/scan-cart")}>
          <div className="scanner-corner tl"></div>
          <div className="scanner-corner tr"></div>
          <div className="scanner-corner bl"></div>
          <div className="scanner-corner br"></div>
          
          <div className="laser-sweep"></div>
          
          <p className="scanner-hint">TAP TO INITIALIZE SCANNER</p>
          
          <div className="qr-frame">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=GMR_ROOT&color=00f7ff&bgcolor=000c14" 
              alt="System QR" 
              className="qr-img-fit"
            />
          </div>
          
          <p className="scanner-footer">SECURE TERMINAL READY // ENCRYPTED SYNC</p>
        </div>
      </main>

      <footer className="terminal-footer">
        <div className="footer-line"></div>
        <p>SYSTEM_STATUS: <span className="green-txt">OPERATIONAL</span> | TERMINAL: <span className="cyan-txt">GATE-01</span></p>
      </footer>
    </div>
  );
}

export default Home;