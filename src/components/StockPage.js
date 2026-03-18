import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import productsData from '../data/generateProducts';
import './Stock.css';

const StockPage = () => {
  const navigate = useNavigate();

  const [activeFloor, setActiveFloor] = useState('LVL_00: GROUND');
  const [activeCategory, setActiveCategory] = useState(null);
  const [lockedId, setLockedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyOffers, setShowOnlyOffers] = useState(false);
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [selectedVariants, setSelectedVariants] = useState({});

  const STORAGE_KEY = 'gmr_reminder_queue';

  // Apply 10% reduction to items costing > 1000
  const optimizedProducts = useMemo(() => {
    return productsData.map(p => {
      if (p.mrp > 1000) {
        return { ...p, mrp: Math.round(p.mrp * 0.9), discount: "10% OFF" };
      }
      return p;
    });
  }, []);

  const handleProductClick = (id) => setLockedId(lockedId === id ? null : id);

  const addToQueue = (e, product) => {
    e.stopPropagation();
    const existingQueue = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!existingQueue.find(item => item.id === product.id)) {
      const updatedQueue = [...existingQueue, product];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQueue));
      alert(`${product.name} SAVED TO REMINDER LIST`);
    } else {
      alert("ITEM ALREADY IN YOUR REMINDER LIST");
    }
  };

  const normalize = (str) => str ? str.toUpperCase().replace(/\s|-/g, '') : '';

  let displayProducts = optimizedProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (showOnlyOffers) return p.discount !== null && matchesSearch;
    const cleanFloorLabel = activeFloor.split(': ')[1].toUpperCase();
    const floorMatch = p.floor.toUpperCase().includes(cleanFloorLabel);
    const categoryMatch = !activeCategory || normalize(p.category) === normalize(activeCategory);
    return floorMatch && categoryMatch && matchesSearch;
  });

  // Sort Logic
  if (sortBy === 'PRICE_LOW') displayProducts.sort((a, b) => a.mrp - b.mrp);
  if (sortBy === 'PRICE_HIGH') displayProducts.sort((a, b) => b.mrp - a.mrp);
  if (sortBy === 'NAME') displayProducts.sort((a, b) => a.name.localeCompare(b.name));

  const navigation = {
    'LVL_00: GROUND': ['DAIRY', 'SOFT DRINKS', 'SNACKS', 'PERSONAL CARE'],
    'LVL_01: FIRST': ['MEN', 'WOMEN', 'FOOTWEAR', 'ACCESSORIES'],
    'LVL_02: SECOND': ['KITCHEN', 'HOME ESSENTIALS', 'TOYS', 'FURNITURE']
  };

  return (
    <div className="pro-terminal">
      <aside className="pro-sidebar">
        <div className="logo-area">
          <h1 className="glitch-text">GMR SMART MART</h1>
          <div className="system-path">SECURED_LINK // STOCK_v2.6</div>
        </div>
        <div className="pro-search-section">
          <input type="text" className="pro-search-input" placeholder="SCANNING DATABASE..." onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <button className={`mega-offer-btn ${showOnlyOffers ? 'mega-active' : ''}`} onClick={() => { setShowOnlyOffers(!showOnlyOffers); setActiveCategory(null); }}>
          ⚡ MEGA OFFERS
        </button>
        <nav className="pro-nav-scroll">
          {!showOnlyOffers && Object.keys(navigation).map(floor => (
            <div key={floor} className="floor-group">
              <button className={`pro-floor-id ${activeFloor === floor ? 'floor-active' : ''}`} onClick={() => { setActiveFloor(floor); setActiveCategory(null); }}>{floor}</button>
              {activeFloor === floor && (
                <div className="pro-cat-group">
                  {navigation[floor].map(cat => (
                    <button key={cat} className={`pro-cat-btn ${activeCategory === cat ? 'cat-glow' : ''}`} onClick={() => setActiveCategory(cat)}>{cat} ➤</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      <main className="pro-main-viewport">
        <div className="pro-control-bar" style={{ padding: '10px', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #333' }}>
            <select className="pro-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ background: '#0a0a0a', color: '#00ffcc', border: '1px solid #00ffcc', padding: '5px' }}>
                <option value="DEFAULT">SORT BY: DEFAULT</option>
                <option value="PRICE_LOW">PRICE: LOW TO HIGH</option>
                <option value="PRICE_HIGH">PRICE: HIGH TO LOW</option>
                <option value="NAME">NAME: A-Z</option>
            </select>
        </div>

        <div className="pro-scroll-grid">
          {displayProducts.map((p) => {
            const variant = selectedVariants[p.id] || p.variants?.[0] || { label: 'Standard', price: p.mrp };
            return (
              <div key={p.id} className={`pro-product-card ${lockedId === p.id ? 'locked-glow' : ''}`} onClick={() => handleProductClick(p.id)}>
                <div className="yellow-offer-tag">{p.discount || "NONE"}</div>
                <div className="pro-img-wrapper"><img src={p.image} alt={p.name} className="pro-product-img" /></div>
                
                <div className="pro-product-info centered-text">
                  <span className="pro-brand-label">{p.brand}</span>
                  <h3 className="pro-product-name">{p.name}</h3>
                  <div className="pro-price-container">
                    <span className="pro-offer-price">₹{p.mrp}</span>
                  </div>

                  {lockedId === p.id && (
                    <div className="pro-expanded-details">
                      {p.variants && (
                        <select className="variant-select" onChange={(e) => setSelectedVariants({...selectedVariants, [p.id]: JSON.parse(e.target.value)})}>
                          {p.variants.map((v, i) => <option key={i} value={JSON.stringify(v)}>{v.label}</option>)}
                        </select>
                      )}
                      {/* ADDED MISSING DETAILS */}
                      <div className="detail-line"><span>MFG:</span> <span className="blue-val">{p.mfg_date || 'N/A'}</span></div>
                      <div className="detail-line"><span>EXP:</span> <span className="blue-val">{p.exp_date || 'N/A'}</span></div>
                      <div className="detail-line"><span>ROW:</span> <span className="blue-val">{p.location}</span></div>
                      <div className="detail-line"><span>STOCK:</span> <span className="blue-val">{p.stock} U</span></div>
                      <div className="detail-line"><span>STATUS:</span> <span className="status-live">● LIVE</span></div>
                      
                      <button className="pro-track-btn" onClick={(e) => addToQueue(e, p)}>ADD TO REMINDER 📌</button>
                      <button className="pro-track-btn" onClick={(e) => { e.stopPropagation(); navigate("/tracking", { state: { product: p } }); }}>INITIATE TRACKING 📍</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
export default StockPage;