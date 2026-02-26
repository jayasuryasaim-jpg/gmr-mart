// src/components/Availability.js
import React, { useState } from 'react';
import productsData from '../data/generateProducts';
import './Availability.css';

const Availability = () => {
  const [selected, setSelected] = useState(null);
  const dairyProducts = productsData.filter(p => p.category === 'dairy');

  return (
    <div className="availability-page">
      <div className="status-bar">⚡ SMART TRACKING ENABLED ⚡</div>
      <div className="product-grid">
        {dairyProducts.map(p => (
          <div key={p.id} className="p-card" onClick={() => setSelected(p)}>
            <div className="badge">10% OFF</div>
            <img src="https://placehold.co/150x150/000c14/00f7ff?text=AMUL" alt="p" />
            <h3>{p.name}</h3>
            <p className="price">₹{p.price}</p>
            <div className="loc-tag">LOCATION: {p.location}</div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-flex">
              <div className="modal-img">
                 <img src="https://placehold.co/300x300/white/black?text=PRODUCT" alt="img" />
              </div>
              <div className="modal-info">
                 <p><span>BRAND:</span> {selected.brand}</p>
                 <p><span>MRP:</span> ₹{selected.mrp}</p>
                 <p className="cyan"><span>OFFER PRICE:</span> ₹{selected.price}</p>
                 <p className="yellow"><span>DISCOUNT:</span> {selected.discount}</p>
                 <p><span>STOCK:</span> {selected.stock} Units</p>
                 <p className="tracker"><span>LOCATION:</span> {selected.location}</p>
              </div>
            </div>
            <button onClick={() => setSelected(null)}>CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Availability;