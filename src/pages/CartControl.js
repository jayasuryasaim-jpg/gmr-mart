import { useState, useEffect } from "react";
import "./CartControl.css";

function CartControl() {
  const [cartId, setCartId] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const id = localStorage.getItem("cartId");
    setCartId(id);

    // Poll the backend every 2 seconds
    const interval = setInterval(() => {
      if (id) {
        fetch(`http://localhost:5000/cart/${id}`)
          .then((res) => res.json())
          .then((data) => {
            setItems(data);
            const sum = data.reduce((acc, item) => acc + item.price, 0);
            setTotal(sum);
          })
          .catch((err) => console.error("Backend not reachable:", err));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleCheckout = () => {
    // Optional: Tell backend to clear the cart when moving to payment
    fetch(`http://172.16.34.113:5000/clear-cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId: cartId })
    }).then(() => {
      window.location.href = '/payment';
    });
  };

  return (
    <div className="control-wrapper">
      <div className="status-bar">
        <span>Cart ID: <strong>{cartId}</strong></span>
        <span className="live-indicator pulse">● LIVE SYNC</span>
      </div>

      <div className="items-box">
        {items.length === 0 ? (
          <div className="empty-container">
            <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty" className="empty-img" />
            <p className="empty-msg">Your cart is empty. Start scanning!</p>
          </div>
        ) : (
          items.map((item, index) => (
            <div key={index} className="item-row">
              <div className="item-details">
                <img src={item.image} alt={item.name} className="product-thumb" />
                <div className="text-group">
                  <span className="product-name">{item.name}</span>
                  <span className="product-price">₹{item.price}</span>
                </div>
              </div>
              <span className="qty-tag">x1</span>
            </div>
          ))
        )}
      </div>

      <div className="total-box">
        <div className="total-row">
          <span>Subtotal:</span>
          <span>₹{total}</span>
        </div>
        <div className="total-row grand-total">
          <span>Grand Total:</span>
          <span>₹{total}</span>
        </div>
      </div>

      <button className="pay-btn" onClick={handleCheckout} disabled={items.length === 0}>
        Proceed to Checkout
      </button>
    </div>
  );
}

export default CartControl;