// src/components/StockPage.js
import React, { useState } from 'react';
import productsData from '../generateProducts'; 
import './StockPage.css';

const StockPage = () => {
  const [filterFloor, setFilterFloor] = useState('Ground Floor');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filtered = productsData.filter(p => p.floor === filterFloor);

  return (
    <div className="gmr-stock-viewer">
      <div className="floor-tabs">
        {['Ground Floor', 'First Floor', 'Second Floor'].map(f => (
          <button 
            key={f} 
            className={filterFloor === f ? 'active' : ''} 
            onClick={() => setFilterFloor(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filtered.map(p => (
          <div key={p.id} className="modern-p-card" onClick={() => setSelectedProduct(p)}>
            <div className="loc-badge">{p.location}</div>
            <img src={`https://placehold.co/150x150/000c14/00f7ff?text=${p.category.toUpperCase()}`} alt="p" />
            <div className="p-meta">
              <h4>{p.name}</h4>
              <p className="price">₹{p.price}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="gmr-modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="gmr-modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-top">
              <h2>{selectedProduct.name}</h2>
              <span className="sync-status">SYNCED TO {selectedProduct.location}</span>
            </div>
            <div className="modal-specs">
              <p><span>AISLE:</span> {selectedProduct.location}</p>
              <p><span>FLOOR:</span> {selectedProduct.floor}</p>
              <p><span>STOCK:</span> {selectedProduct.stock} Units</p>
              <p className="cyan"><span>OFFER PRICE:</span> ₹{selectedProduct.price}</p>
            </div>
            <button onClick={() => setSelectedProduct(null)}>CLOSE TERMINAL</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockPage;