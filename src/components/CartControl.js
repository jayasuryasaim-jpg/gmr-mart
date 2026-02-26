// src/components/ControlCart.js
import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import productsData from "../generateProducts"; // Fixes path error
import "./ControlCart.css";

function ControlCart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("cart-reader", { fps: 10, qrbox: 250 });

    scanner.render((decodedText) => {
      // Logic: Search by ID or Name
      const item = productsData.find(p => p.id === decodedText || p.name === decodedText);

      if (item) {
        setCart((prev) => [...prev, item]);
        setTotal((prev) => prev + item.price);
        if (navigator.vibrate) navigator.vibrate(100); 
      } else {
        alert("Product not found in GMR Database!");
      }
    });

    return () => scanner.clear();
  }, []);

  return (
    <div className="cart-container">
      <header className="cart-header">
        <h2>GMR SMART CART</h2>
        <div className="status-dot">ESP32 ACTIVE</div>
      </header>
      <div id="cart-reader"></div>
      <div className="items-list">
        <h3>Items ({cart.length})</h3>
        {cart.map((item, index) => (
          <div key={index} className="cart-item">
            <span>{item.name} (Loc: {item.location})</span>
            <span>₹{item.price}</span>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <h3>Total: ₹{total}</h3>
        <button className="pay-btn">PAY NOW</button>
      </div>
    </div>
  );
}

export default ControlCart;