import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./ControlCart.css";

const PRODUCT_DB = {
  "ITEM_001": { name: "Lays Chips", price: 20 },
  "ITEM_002": { name: "Coca Cola", price: 45 },
  "ITEM_003": { name: "Milk Bread", price: 35 }
};

function ControlCart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("cart_unlocked") !== "true") {
       window.location.href = "/scan-cart";
       return;
    }

    const scanner = new Html5QrcodeScanner("cart-reader", { fps: 10, qrbox: 250 });
    scanner.render((decodedText) => {
      if (PRODUCT_DB[decodedText]) {
        const item = PRODUCT_DB[decodedText];
        setCart(prev => [...prev, item]);
        setTotal(prev => prev + item.price);
        if (navigator.vibrate) navigator.vibrate(100); 
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
        {cart.map((item, idx) => (
          <div key={idx} className="cart-item">
            <span>{item.name}</span>
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