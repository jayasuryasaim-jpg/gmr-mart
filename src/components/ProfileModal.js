import React from "react";
import "./ProfileModal.css"; // This imports the style cleanly

function ProfileModal({ user, onClose, onLogout }) {
  if (!user) return null;

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-dashboard-container" onClick={(e) => e.stopPropagation()}>
        <div className="scanner-bar"></div>
        
        <header className="dash-header">
          <div className="status-indicator">
            <span className="blink-dot"></span> SECURE_CONNECTION
          </div>
          <div className="header-title">
            <h1 className="glitch-txt">GMR <span className="cyan-txt">PROFILE</span></h1>
            <p className="serial-num">CUSTOMER_ID: {user.id || "PENDING"}</p>
          </div>
          <button className="close-corner" onClick={onClose}>&times;</button>
        </header>

        <div className="dash-content">
          <section className="dash-section">
            <h3 className="section-tag">01 // IDENTITY DOSSIER</h3>
            <div className="profile-data-layout">
              
              <div className="data-field full-width">
                <label>FULL NAME</label>
                <div className="display-box primary-glow">{user.name || "N/A"}</div>
              </div>

              <div className="data-field">
                <label>SECURE EMAIL ID</label>
                <div className="display-box">{user.email || "N/A"}</div>
              </div>

              <div className="data-field">
                <label>MOBILE LINK</label>
                <div className="display-box">{user.mobile || "N/A"}</div>
              </div>

              <div className="data-field">
                <label>DATE OF BIRTH</label>
                <div className="display-box">{user.dob || "N/A"}</div>
              </div>

              <div className="data-field">
                <label>GENDER</label>
                <div className="display-box cyan-glow">{user.gender || "N/A"}</div>
              </div>

            </div>
          </section>
          
          <div className="security-notice">
            <p>▶ ACCESS VERIFIED // ACCOUNT REGISTRATION TIMESTAMP: {user.regDate || "N/A"}</p>
          </div>
        </div>

        <footer className="dash-footer">
          <div className="footer-meta">SECURITY LEVEL: LVL_1_CUSTOMER</div>
          <div className="btn-group">
            <button className="dash-btn danger-btn" onClick={onLogout}>TERMINATE_SESSION</button>
            <button className="dash-btn primary-btn" onClick={onClose}>CLOSE WINDOW</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ProfileModal;