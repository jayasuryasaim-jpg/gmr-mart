import React, { useState } from 'react';
import productsData from '../generateProducts'; 
import './Availability.css';

const Availability = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Group products by floor for cleaner browsing
  const groundFloor = productsData.filter(p => p.floor === "Ground Floor");

  return (
    <div className="availability-wrapper">
      <div className="tracking-banner">
        ⚡ SMART TRACKING SYSTEM: {productsData.length} ITEMS SYNCED TO HEATMAP ⚡
      </div>

      <div className="product-display-grid">
        {groundFloor.map(product => (
          <div key={product.id} className="product-info-card" onClick={() => setSelectedProduct(product)}>
             <div className="card-top">
                <span className="offer-badge">{product.discount.split('%')[0]}% OFF</span>
                <img src={`https://placehold.co/150x150/000c14/00f7ff?text=${product.brand}`} alt="product" />
             </div>
             <div className="card-bottom">
                <h3>{product.name}</h3>
                <p className="price-main">₹{product.price}</p>
                {/* PROOF OF SYNC */}
                <div className="row-tracker">AISLE: {product.location}</div>
             </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL (matches your uploaded image style) */}
      {selectedProduct && (
        <div className="tracking-modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="tracking-modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-layout">
              <div className="image-side">
                 <img src="https://placehold.co/300x300/white/black?text=AMUL+GOLD" alt="Amul" />
                 <h2>{selectedProduct.name}</h2>
                 <p className="modal-price-label">₹{selectedProduct.mrp} <span>₹{selectedProduct.price}</span></p>
              </div>
              <div className="details-side">
                 <div className="detail-item"><span>BRAND:</span> {selectedProduct.brand}</div>
                 <div className="detail-item"><span>MRP:</span> ₹{selectedProduct.mrp}</div>
                 <div className="detail-item cyan"><span>OFFER PRICE:</span> ₹{selectedProduct.price}</div>
                 <div className="detail-item yellow"><span>DISCOUNT:</span> {selectedProduct.discount}</div>
                 <div className="detail-item"><span>STOCK:</span> {selectedProduct.stock} Units</div>
                 <div className="detail-item"><span>MFG DATE:</span> {selectedProduct.mfg_date}</div>
                 <div className="detail-item"><span>EXP DATE:</span> {selectedProduct.exp_date}</div>
                 {/* THIS IS THE SYNCED TRACKING FIELD */}
                 <div className="detail-item tracker-highlight">
                    <span>LOCATION:</span> {selectedProduct.location}
                 </div>
              </div>
            </div>
            <button className="close-terminal" onClick={() => setSelectedProduct(null)}>EXIT TERMINAL</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Availability;