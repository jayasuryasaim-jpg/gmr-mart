import React from "react";
import { useLocation } from "react-router-dom";
import "./SmartBuddy.css";

function SmartBuddy() {
  const location = useLocation();
  
  // Only show the buddy on the Welcome page ('/') or Floors page ('/floors')
  const isHomePage = location.pathname === "/" || location.pathname === "/floors";

  if (!isHomePage) return null; // Returns nothing if not on home pages

  return (
    <div className="buddy-container">
      <div className="speech-bubble">
        Namaste! I am your GMR Smart Guide. How can I help you today?
        <div className="bubble-arrow"></div>
      </div>
      <div className="buddy-wrapper">
        <img src="/assets/guide/gmr-smart-buddy.png" alt="Buddy" className="buddy-image" />
        <div className="buddy-platform"></div>
      </div>
    </div>
  );
}

export default SmartBuddy;