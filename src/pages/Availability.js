import React, { useState, useMemo } from 'react';
import productsData from '../generatedProducts'; // Use the JS file we created
import './Stock.css';

const Availability = () => {
  const [view, setView] = useState('floors');
  const [selection, setSelection] = useState({ floor: '', category: '', type: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 1. DYNAMIC MENU GENERATION (Syncs with the Live Data)
  const menuData = useMemo(() => {
    const data = {};
    productsData.forEach(p => {
      if (!data[p.floor]) data[p.floor] = {};
      if (!data[p.floor][p.category]) data[p.floor][p.category] = new Set();
      
      // Using 'brand' or a subset of name as 'type' if type isn't explicitly in your schema
      // Here we use category as the main filter
      data[p.floor][p.category].add(p.category); 
    });
    return data;
  }, []);

  const handleBack = () => {
    if (view === 'products') setView('categories');
    else if (view === 'categories') setView('floors');
  };

  // 2. REAL-WORLD FILTERING
  const filteredProducts = productsData.filter(p => 
    p.floor === selection.floor && p.category === selection.category
  );

  return (
    <div className="stock-container">
      <div className="sidebar">
        <h2 className="sidebar-title">GMR INVENTORY</h2>
        {view !== 'floors' && <button className="back-btn" onClick={handleBack}>← BACK</button>}
        
        <div className="btn-list">
          {view === 'floors' && Object.keys(menuData).map(f => (
            <button key={f} className="menu-btn animate-left" onClick={() => { setSelection({floor: f}); setView('categories'); }}>
              {f.toUpperCase()}
            </button>
          ))}

          {view === 'categories' && Object.keys(menuData[selection.floor]).map(c => (
            <button key={c} className="menu-btn animate-left" onClick={() => { setSelection({...selection, category: c}); setView('products'); }}>
              {c.replace('-', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="display-area">
        <header className="display-header">
           <h1>{selection.category?.replace('-', ' ') || selection.floor || "SELECT FLOOR"}</h1>
           <p className="market-note">Real-time Market Pricing Enabled</p>
        </header>

        {view === 'products' && (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
                <div className="discount-tag">-{product.discount}%</div>
                <img src={`https://placehold.co/200x200/000c14/00f7ff?text=${product.name.split(' ')[0]}`} alt={product.name} />
                <div className="card-meta">
                  <h4>{product.name}</h4>
                  <p className="price-tag">₹{product.price}</p>
                  <p className="row-indicator">Shelf: {product.row}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SYNCED DETAIL MODAL */}
      {selectedProduct && (
        <div className="mini-detail-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="mini-detail-card" onClick={e => e.stopPropagation()}>
            <button className="close-x" onClick={() => setSelectedProduct(null)}>×</button>
            <div className="modal-content">
              <div className="modal-img-side">
                <img src={`https://placehold.co/300x300/000c14/00f7ff?text=${selectedProduct.name}`} className="mini-img" alt="product"/>
                <div className="live-status">
                   <span className="pulse-dot"></span> STOCK: {selectedProduct.stock} units
                </div>
              </div>
              
              <div className="modal-info">
                  <div className="brand-badge">{selectedProduct.brand}</div>
                  <h3>{selectedProduct.name}</h3>
                  <div className="price-row">
                    <span className="current-price">₹{selectedProduct.price}</span>
                    <span className="mrp">₹{Math.floor(selectedProduct.price * 1.2)}</span>
                  </div>
                  
                  <div className="spec-grid">
                    <p><strong>Weight:</strong> {selectedProduct.weight}</p>
                    <p><strong>Floor:</strong> {selectedProduct.floor}</p>
                    <p><strong>Shelf:</strong> {selectedProduct.row}</p>
                    <p><strong>Zone:</strong> {selectedProduct.color_zone}</p>
                  </div>

                  <hr />
                  <div className="tracking-box">
                      <p>📍 <strong>NAV-GUIDE:</strong> Aisle {selectedProduct.row.charAt(0)}</p>
                      <div className="map-placeholder">
                          {/* THE TRACKING LINE LOGIC */}
                          <svg className="nav-svg" width="100%" height="60">
                            <line x1="10" y1="50" x2={selectedProduct.map_position.x / 4} y2={selectedProduct.map_position.y / 6} 
                                  stroke="#00f7ff" strokeWidth="2" strokeDasharray="5,5" />
                            <circle cx="10" cy="50" r="4" fill="white" />
                            <circle cx={selectedProduct.map_position.x / 4} cy={selectedProduct.map_position.y / 6} r="5" fill={selectedProduct.color_zone} />
                          </svg>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Availability;