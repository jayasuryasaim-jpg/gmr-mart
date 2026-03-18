import React from "react";
import "./ProfileModal.css";

function ProfileModal({ user, onClose, onLogout }) {
  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-card" onClick={e => e.stopPropagation()}>
        <h3 className="profile-title">CUSTOMER PROFILE</h3>
        <div className="profile-grid">
          <div className="profile-row">
            <span>Name:</span> <strong>{user.name}</strong>
          </div>
          {/* Customer ID added here as requested */}
          <div className="profile-row">
            <span>Customer ID:</span> <strong>{user.customerId || user.id}</strong>
          </div>
          <div className="profile-row">
            <span>Email:</span> <strong>{user.email}</strong>
          </div>
          <div className="profile-row">
            <span>Address:</span> <strong>Vizag, AP</strong>
          </div>
        </div>
        <div className="profile-actions">
          <button className="logout-action" onClick={onLogout}>LOGOUT</button>
          <button className="close-btn" onClick={onClose}>CLOSE</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;