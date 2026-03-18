import React from 'react';
import { motion } from 'framer-motion';
import './ProfileModal.css';

const ProfileModal = ({ user, onClose, onLogout, orderHistory = [] }) => {
  return (
    <motion.div 
      className="profile-overlay" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="profile-content" 
        initial={{ scale: 0.9 }} 
        animate={{ scale: 1 }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="main-heading">GMR_IDENTITY</h2>
        
        <div className="profile-details">
          {[ 
            // Forced ID display as requested
            { l: "CUSTOMER ID", v: "GMR-C231" },
            { l: "NAME", v: user.name || "N/A" }, 
            { l: "MOBILE", v: user.mobile || "N/A" }, 
            { l: "EMAIL", v: user.email || "N/A" }, 
            { l: "CITY", v: user.city || "Visakhapatnam" }, 
            { l: "PINCODE", v: user.pincode || "530001" }, 
            { l: "ADDRESS", v: user.address || "Vizag, AP" } 
          ].map((i, idx) => (
            <p key={idx}>
              <span className="side-heading">{i.l}:</span> 
              <span className="data-matter">{i.v}</span>
            </p>
          ))}
        </div>

        <div className="history-section">
          <h4 className="history-title">RECENT_ORDER_HISTORY</h4>
          {orderHistory.length > 0 ? (
            orderHistory.map((o, idx) => (
              <div key={idx} className="history-item">
                [{o.date}] {o.items}
              </div>
            ))
          ) : (
            <div className="history-item">No recent orders found.</div>
          )}
        </div>

        <div className="btn-group">
          <button className="action-btn">EDIT_PROFILE</button>
          <button className="action-btn">CHANGE_PASS</button>
          <button 
            className="action-btn" 
            onClick={onLogout} 
            style={{ borderColor: '#ff3e3e', color: '#ff3e3e' }}
          >
            LOGOUT
          </button>
          <button className="action-btn" onClick={onClose}>CLOSE</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileModal;