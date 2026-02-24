import React from "react";

function GuideBot() {
  return (
    <div className="guide-container">
      <img
        src="/assets/guide.png"
        alt="Guide Bot"
        className="guide-img"
      />
      <div className="guide-tooltip">
        👋 Welcome to GMR Smart Mart!  
        Scan your Cart QR to begin shopping!
      </div>
    </div>
  );
}

export default GuideBot;