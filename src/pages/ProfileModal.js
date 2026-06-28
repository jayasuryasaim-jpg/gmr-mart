import React from "react";
import "./ProfileModal.css";

function ProfileModal({ user, onClose, onLogout }) {
  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-card" onClick={e => e.stopPropagation()}>
        <div className="profile-header">
          <h3 className="profile-title">SYSTEM IDENTITY: {user.id}</h3>
        </div>
        
        <div className="profile-grid">
          <div className="profile-row"><span>FULL NAME:</span> <strong>{user.name}</strong></div>
          <div className="profile-row"><span>USER ID:</span> <strong>{user.username}</strong></div>
          <div className="profile-row"><span>MOBILE:</span> <strong>{user.mobile}</strong></div>
          <div className="profile-row"><span>EMAIL:</span> <strong>{user.email}</strong></div>
          
          <div className="profile-divider">LOCATION_DETAILS</div>
          
          <div className="profile-row"><span>ADDRESS:</span> <strong>{user.address}</strong></div>
          <div className="profile-row"><span>CITY/STATE:</span> <strong>{user.city}, {user.state}</strong></div>
          <div className="profile-row"><span>PINCODE:</span> <strong>{user.pincode}</strong></div>
          
          <div className="profile-divider">PERSONAL_INFO</div>
          
          <div className="profile-row"><span>GENDER:</span> <strong>{user.gender}</strong></div>
          <div className="profile-row"><span>DATE OF BIRTH:</span> <strong>{user.dob}</strong></div>
          <div className="profile-row"><span>PAYMENT:</span> <strong>{user.paymentMethod}</strong></div>
        </div>

        <div className="profile-actions">
          <button className="logout-action" onClick={onLogout}>TERMINATE SESSION</button>
          <button className="close-btn" onClick={onClose}>CLOSE</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;