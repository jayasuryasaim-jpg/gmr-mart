import React, { useState } from 'react';
import productsData from '../products.json';
import './Stock.css';

const Availability = () => {
  const [view, setView] = useState('floors'); 
  const [selection, setSelection] = useState({ floor: '', category: '', type: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);

  const menuData = {
    "Ground Floor": {
      "Dairy": ["Milk", "Curd", "Butter", "Paneer"],
      "Soft Drinks": ["Coca-Cola", "Pepsi", "Fruit Juices"],
      "Snacks": ["Chips", "Biscuits", "Chocolates"],
      "Personal Care": ["Soap", "Paste"]
    },
    "First Floor": {
      "Men": ["Shirts", "Jeans"],
      "Women": ["Sarees", "Kurtis"],
      "Kids": ["Boys", "Girls"],
      "Accessories": ["Belts", "Nail Cutters"]
    },
    "Second Floor": {
      "Kitchen Items": ["Plates", "Water Bottles"],
      "Home Essentials": ["Towels", "Blankets", "Buckets"],
      "Toys": ["Cars", "Dolls"],
      "Furniture": ["Chairs", "Tables"]
    }
  };

  const handleBack = () => {
    if (view === 'products') setView('types');
    else if (view === 'types') setView('categories');
    else if (view === 'categories') setView('floors');
  };

  return (
    <div className="stock-container">
      <div className="sidebar">
        <h2 className="sidebar-title">GMR INVENTORY</h2>
        {view !== 'floors' && <button className="back-btn" onClick={handleBack}>← BACK</button>}
        
        <div className="btn-list">
          {view === 'floors' && Object.keys(menuData).map(f => (
            <button key={f} className="menu-btn animate-left" onClick={() => { setSelection({...selection, floor: f}); setView('categories'); }}>{f}</button>
          ))}

          {view === 'categories' && Object.keys(menuData[selection.floor]).map(c => (
            <button key={c} className="menu-btn animate-left" onClick={() => { setSelection({...selection, category: c}); setView('types'); }}>{c}</button>
          ))}

          {view === 'types' && menuData[selection.floor][selection.category].map(t => (
            <button key={t} className="menu-btn animate-left" onClick={() => { setSelection({...selection, type: t}); setView('products'); }}>{t}</button>
          ))}
        </div>
      </div>

      <div className="display-area">
        <header className="display-header">
           <h1>{selection.type || selection.category || selection.floor || "SELECT FLOOR"}</h1>
        </header>

        {view === 'products' && (
          <div className="product-grid">
            {Object.values(productsData).filter(p => p.floor === selection.floor && p.type === selection.type).map(product => (
              <div key={product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
                <img src={product.image} alt={product.name} />
                <h4>{product.name}</h4>
                <p>₹{product.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MANDATORY: SMALL DETAIL PAGE MODAL */}
      {selectedProduct && (
        <div className="mini-detail-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="mini-detail-card" onClick={e => e.stopPropagation()}>
            <button className="close-x" onClick={() => setSelectedProduct(null)}>×</button>
            <img src={selectedProduct.image} className="mini-img" alt="product"/>
            <div className="modal-info">
                <h3>{selectedProduct.name}</h3>
                <p><strong>Brand:</strong> {selectedProduct.brand}</p>
                <p><strong>Weight:</strong> {selectedProduct.weight}</p>
                <p><strong>MFG:</strong> {selectedProduct.mfgDate}</p>
                <p><strong>EXP:</strong> {selectedProduct.expDate}</p>
                <p><strong>Stock:</strong> {selectedProduct.stock} Units</p>
                <hr />
                <div className="tracking-box">
                    <p>📍 <strong>Location:</strong> {selectedProduct.floor}, {selectedProduct.row}</p>
                    <div className="map-placeholder">
                        <div className="user-dot"></div>
                        <div className="product-pin" style={{backgroundColor: selectedProduct.zone}}></div>
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