import React from "react";
import "./CartControl.css";

const CartControl = () => {
  return (
    <div className="circular-pad-viewport">
      <div className="pad-outer-glow">
        <button className="nav-circle up">▲</button>
        <div className="mid-control-row">
          <button className="nav-circle left">◀</button>
          <div className="center-core">
            <button className="stop-btn">STOP</button>
            <div className="core-pulse"></div>
          </div>
          <button className="nav-circle right">▶</button>
        </div>
        <button className="nav-circle down">▼</button>
      </div>
    </div>
  );
};

export default CartControl;