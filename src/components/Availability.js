import React, { useState, useMemo } from 'react';
import productsData from '../data/generateProducts'; 
import MapTerminal from './MapTerminal'; // We will create this below
import './Stock.css'; 

const Availability = () => {
  const [activeFloor, setActiveFloor] = useState('LVL_00: GROUND');
  const [activeCategory, setActiveCategory] = useState(null);
  const [lockedId, setLockedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyOffers, setShowOnlyOffers] = useState(false);
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [trackingProduct, setTrackingProduct] = useState(null); // MASTER MAP TRIGGER

  const navigation = {
    'LVL_00: GROUND': ['DAIRY', 'SOFT DRINKS', 'SNACKS', 'PERSONAL CARE'],
    'LVL_01: FIRST': ['MEN', 'WOMEN', 'FOOTWEAR', 'ACCESSORIES'],
    'LVL_02: SECOND': ['KITCHEN', 'HOME ESSENTIALS', 'TOYS', 'FURNITURE']
  };

  const normalize = (str) => str ? str.toUpperCase().replace(/\s|-/g, '') : '';

  let displayProducts = productsData.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (showOnlyOffers) return p.discount !== null && matchesSearch;
    const cleanFloorLabel = activeFloor.split(': ')[1].toUpperCase();
    const floorMatch = p.floor.toUpperCase().includes(cleanFloorLabel);
    const categoryMatch = !activeCategory || normalize(p.category) === normalize(activeCategory);
    return floorMatch && categoryMatch && matchesSearch;
  });

  // Render the Master Map if a product is selected for tracking
  if (trackingProduct) {
    return <MapTerminal product={trackingProduct} closeMap={() => setTrackingProduct(null)} />;
  }

  return (
    <div className="pro-terminal">
      {/* SIDEBAR REMAINS SAME */}
      <aside className="pro-sidebar">
        <div className="logo-area">
          <h1 className="glitch-text">GMR SMART MART</h1>
          <div className="system-path">SECURED_LINK // STOCK_v2.6</div>
        </div>
        
        <div className="pro-search-section">
          <div className="search-neon-box">
            <input type="text" className="pro-search-input" placeholder="SCANNING DATABASE..." onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <nav className="pro-nav-scroll">
          {!showOnlyOffers && Object.keys(navigation).map(floor => (
            <div key={floor} className="floor-group">
              <button className={`pro-floor-id ${activeFloor === floor ? 'floor-active' : ''}`} onClick={() => { setActiveFloor(floor); setActiveCategory(null); }}>
                {floor}
              </button>
              {activeFloor === floor && (
                <div className="pro-cat-group">
                  {navigation[floor].map(cat => (
                    <button key={cat} className={`pro-cat-btn ${activeCategory === cat ? 'cat-glow' : ''}`} onClick={() => setActiveCategory(cat)}>
                      {cat} <span className="arrow">➤</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      <main className="pro-main-viewport">
        <header className="pro-header">
          <div className="pro-path-indicator">DIRECTORY: <span className="path-white">{activeFloor}</span> // <span className="path-neon">{activeCategory || 'ALL_UNITS'}</span></div>
        </header>

        <div className="pro-scroll-grid">
          {displayProducts.map((p) => (
            <div key={p.id} className={`pro-product-card ${lockedId === p.id ? 'locked-glow' : ''}`} onClick={() => setLockedId(lockedId === p.id ? null : p.id)}>
              {p.discount && <div className="yellow-offer-tag">{p.discount} OFF</div>}
              <div className="pro-img-wrapper"><img src={p.image} alt={p.name} className="pro-product-img" /></div>
              <div className="pro-product-info centered-text">
                <span className="pro-brand-label">{p.brand}</span>
                <h3 className="pro-product-name">{p.name}</h3>
                <div className="pro-price-container"><span className="pro-offer-price">₹{p.price}</span></div>

                {lockedId === p.id && (
                  <div className="pro-expanded-details">
                    <div className="detail-line"><span>AISLE:</span> <span className="blue-val">{p.location}</span></div>
                    {/* MASTER TRACKING BUTTON */}
                    <button className="pro-track-trigger" onClick={(e) => { e.stopPropagation(); setTrackingProduct(p); }}>
                      INITIATE 3D TRACKING
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Availability;