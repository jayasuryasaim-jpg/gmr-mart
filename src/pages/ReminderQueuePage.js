import React, { useState, useEffect } from 'react';
import './ReminderQueue.css';

const ReminderQueuePage = () => {
  const [queue, setQueue] = useState([]);
  const STORAGE_KEY = 'gmr_reminder_queue';

  const loadQueue = () => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const initialized = saved.map(item => ({ ...item, quantity: item.quantity || 1 }));
    setQueue(initialized);
  };

  useEffect(() => {
    loadQueue();
    window.addEventListener('focus', loadQueue);
    return () => window.removeEventListener('focus', loadQueue);
  }, []);

  const updateQuantity = (id, delta) => {
    const updated = queue.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setQueue(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const removeFromQueue = (id) => {
    const updated = queue.filter(item => item.id !== id);
    setQueue(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const totalCost = queue.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    return sum + (price * (item.quantity || 1));
  }, 0);

  return (
    <div className="reminder-page-container">
      <h1>YOUR REMINDER LIST 📌</h1>
      
      {queue.length === 0 ? (
        <p>No products in your reminder list yet.</p>
      ) : (
        <>
          <div className="reminder-list">
            {queue.map((p) => (
              <div key={p.id} className="reminder-item">
                <div className="item-info">
                  <h3>{p.name}</h3>
                  <p>Location: {p.location} | Floor: {p.floor}</p>
                  <p className="item-price"><strong>Price: ₹{p.price}</strong></p>
                </div>

                <div className="quantity-controls">
                  <button className="qty-btn" onClick={() => updateQuantity(p.id, -1)}>-</button>
                  <span className="qty-display">{p.quantity || 1}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(p.id, 1)}>+</button>
                </div>

                <button className="remove-btn" onClick={() => removeFromQueue(p.id)}>REMOVE ❌</button>
              </div>
            ))}
          </div>

          <div className="reminder-summary">
            <h2>TOTAL ESTIMATED COST: ₹{totalCost.toFixed(2)}</h2>
          </div>
        </>
      )}
    </div>
  );
};

export default ReminderQueuePage;