import React, { useState } from 'react';
import productsData from '../data/products'; 
import './Stock.css';

const StockPage = () => {
  const [view, setView] = useState('floors');
  const [selection, setSelection] = useState({ floor: '', category: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [offerFilter, setOfferFilter] = useState(false);
  const [activeProductId, setActiveProductId] = useState(null); 

  const menuData = {
    "Ground Floor": {
      "Dairy": ["dairy"],
      "Drinks": ["soft-drinks"],
      "Snacks": ["snacks"],
      "Care": ["personal-care"]
    },
    "First Floor": {
      "Apparel": ["men", "women", "kids"],
      "Shoes": ["footwear"],
      "Extra": ["accessories"]
    },
    "Second Floor": {
      "Kitchen": ["kitchen"],
      "Home": ["home-essentials"],
      "Kids": ["toys"],
      "Living": ["furniture"]
    }
  };

  const handleBack = () => {
    setOfferFilter(false);
    setActiveProductId(null);
    if (view === 'products') setView('types');
    else if (view === 'types') setView('categories');
    else if (view === 'categories') {
        setView('floors');
        setSelection({ floor: '', category: '', type: '' });
    }
  };

  const filteredProducts = productsData.filter(p => {
    if (offerFilter) return (p.discount || 0) > 0;
    if (searchTerm) return p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return p.floor === selection.floor && p.category === selection.type;
  });

  return (
    <div className="stock-container">
      <div className="sidebar">
        <h2 className="sidebar-title">GMR STOCK</h2>
        <div className="search-container">
          <input 
            type="text" 
            className="search-input"
            placeholder="Search 300+ Products..." 
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setOfferFilter(false);
                if(e.target.value) setView('products');
                else if (!selection.type) setView('floors');
            }}
          />
        </div>

        <button 
          className={`offers-nav-btn ${offerFilter ? 'active' : ''}`}
          onClick={() => { setOfferFilter(true); setView('products'); setSearchTerm(''); }}
        >
          🏷️ MEGA OFFERS <span>›</span>
        </button>
        
        <div className="nav-controls">
          {(view !== 'floors' || offerFilter) && !searchTerm && (
            <button className="back-nav-btn" onClick={handleBack}>
              ← BACK <span>‹</span>
            </button>
          )}
        </div>
        
        <div className="btn-group">
          {!searchTerm && !offerFilter && view === 'floors' && Object.keys(menuData).map(f => (
            <button key={f} className="menu-btn" onClick={() => { setSelection({floor: f}); setView('categories'); }}>
              {f} <span>›</span>
            </button>
          ))}
          {!searchTerm && !offerFilter && view === 'categories' && selection.floor && 
            Object.keys(menuData[selection.floor]).map(c => (
              <button key={c} className="menu-btn" onClick={() => { setSelection({...selection, category: c}); setView('types'); }}>
                {c} <span>›</span>
              </button>
          ))}
          {!searchTerm && !offerFilter && view === 'types' && selection.floor && selection.category && 
            menuData[selection.floor][selection.category].map(t => (
              <button key={t} className="menu-btn" onClick={() => { setSelection({...selection, type: t}); setView('products'); }}>
                {t.replace("-", " ").toUpperCase()} <span>›</span>
              </button>
          ))}
        </div>
      </div>

      <div className="display-area">
        <div className="mega-sale-banner">
          <div className="marquee-text">
            <span className="highlight-sale">⚡ GMR MEGA SALE: EXCLUSIVE DISCOUNTS ON SELECTED STOCKS! ⚡</span> &nbsp;&nbsp;&nbsp;&nbsp;
            <span>⚡ SMART TRACKING ENABLED: 300 ITEMS LIVE ⚡</span>
          </div>
        </div>

        <div className="product-grid">
          {(view === 'products' || searchTerm || offerFilter) && filteredProducts.map((product) => {
            const hasDiscount = (product.discount || 0) > 0;
            const discountedPrice = hasDiscount 
                ? Math.round(product.price * (1 - product.discount / 100)) 
                : product.price;
            const isExpanded = activeProductId === product.id;

            return (
              <div 
                key={product.id} 
                className={`product-card ${isExpanded ? 'expanded' : ''}`}
                onClick={() => setActiveProductId(isExpanded ? null : product.id)}
              >
                {hasDiscount && <div className="img-discount-badge">{product.discount}% OFF</div>}
                
                <div className="card-inner-layout">
                  <div className="card-visual">
                    <img 
                      src={`/${product.path}${product.filename}`} 
                      alt={product.name} 
                      onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/150'; }} 
                    />
                    <h4>{product.name}</h4>
                    <div className="price-box">
                       {hasDiscount && <span className="strike-price">₹{product.price}</span>}
                       <span className="main-price">₹{discountedPrice}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="card-details-panel">
                      <div className="detail-item"><span className="neon-label">BRAND:</span> {product.brand}</div>
                      <div className="detail-item">
                        <span className="neon-label">MRP:</span> 
                        <span className={hasDiscount ? "strike-price-white" : ""}>₹{product.price}</span>
                      </div>
                      <div className="detail-item"><span className="neon-label">OFFER PRICE:</span> <span className="offer-white">₹{discountedPrice}</span></div>
                      {hasDiscount && (
                        <div className="detail-item"><span className="neon-label">DISCOUNT:</span> <span className="discount-yellow">{product.discount}% SAVED</span></div>
                      )}
                      <div className="detail-item"><span className="neon-label">STOCK:</span> {product.stock} Units</div>
                      <div className="detail-item"><span className="neon-label">MFG DATE:</span> {product.mfg_date}</div>
                      <div className="detail-item"><span className="neon-label">EXP DATE:</span> {product.exp_date}</div>
                      <div className="detail-item"><span className="neon-label">LOCATION:</span> {product.row}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StockPage;