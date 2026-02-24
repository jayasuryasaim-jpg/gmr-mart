import React from "react";

function FloorCard({ title }) {
  return (
    <div className="floor-card">
      <h2>{title}</h2>
      <button className="enter-btn">Enter Floor</button>
    </div>
  );
}

export default FloorCard;