import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { useAuth } from '../auth/AuthProvider';
import './Stock.css';

/* ─── Rich Demo Products (always shown when backend offline) ─── */
const DEMO_PRODUCTS = [
  /* GROUND — DAIRY */
  { id:'d01', name:'Amul Full Cream Milk 500ml',        brand:'Amul',       price:32,    mrp:35,    stock:120, unit:'pcs', location:'G-A1', floor:'GROUND', category:'DAIRY',         discount:'8% OFF' },
  { id:'d02', name:'Mother Dairy Curd 400g',            brand:'Mother Dairy',price:45,   mrp:50,    stock:90,  unit:'pcs', location:'G-A2', floor:'GROUND', category:'DAIRY',         discount:'' },
  { id:'d03', name:'Amul Butter 500g',                  brand:'Amul',       price:220,   mrp:240,   stock:60,  unit:'pcs', location:'G-A1', floor:'GROUND', category:'DAIRY',         discount:'8% OFF' },
  /* GROUND — SNACKS */
  { id:'d04', name:"Lay's Classic Salted 55g",          brand:"Lay's",      price:20,    mrp:20,    stock:200, unit:'pcs', location:'G-B1', floor:'GROUND', category:'SNACKS',        discount:'' },
  { id:'d05', name:'Parle-G Biscuits 800g',             brand:'Parle',      price:52,    mrp:60,    stock:80,  unit:'pcs', location:'G-B2', floor:'GROUND', category:'SNACKS',        discount:'13% OFF' },
  { id:'d06', name:'Haldiram Bhujia 400g',              brand:'Haldiram',   price:115,   mrp:130,   stock:55,  unit:'pcs', location:'G-B3', floor:'GROUND', category:'SNACKS',        discount:'12% OFF' },
  { id:'d07', name:'Hide & Seek Chocolate Biscuits 300g',brand:'Parle',     price:85,    mrp:95,    stock:70,  unit:'pcs', location:'G-B2', floor:'GROUND', category:'SNACKS',        discount:'11% OFF' },
  /* GROUND — SOFT DRINKS */
  { id:'d08', name:'Coca-Cola 2L Pet Bottle',           brand:'Coca-Cola',  price:85,    mrp:95,    stock:50,  unit:'pcs', location:'G-C1', floor:'GROUND', category:'SOFT DRINKS',   discount:'10% OFF' },
  { id:'d09', name:'Pepsi 2L Pet Bottle',               brand:'Pepsi',      price:82,    mrp:95,    stock:45,  unit:'pcs', location:'G-C1', floor:'GROUND', category:'SOFT DRINKS',   discount:'14% OFF' },
  { id:'d10', name:'Minute Maid Pulpy Orange 1L',       brand:'Coca-Cola',  price:65,    mrp:75,    stock:65,  unit:'pcs', location:'G-C2', floor:'GROUND', category:'SOFT DRINKS',   discount:'13% OFF' },
  { id:'d11', name:'Real Fruit Juice Mango 1L',         brand:'Dabur',      price:110,   mrp:125,   stock:48,  unit:'pcs', location:'G-C2', floor:'GROUND', category:'SOFT DRINKS',   discount:'12% OFF' },
  /* GROUND — PERSONAL CARE */
  { id:'d12', name:'Head & Shoulders Shampoo 340ml',    brand:'H&S',        price:245,   mrp:285,   stock:35,  unit:'pcs', location:'G-D1', floor:'GROUND', category:'PERSONAL CARE', discount:'14% OFF' },
  { id:'d13', name:'Dove Moisturising Bar 100g',        brand:'Dove',       price:58,    mrp:68,    stock:90,  unit:'pcs', location:'G-D2', floor:'GROUND', category:'PERSONAL CARE', discount:'15% OFF' },
  { id:'d14', name:'Colgate MaxFresh Toothpaste 150g',  brand:'Colgate',    price:95,    mrp:105,   stock:110, unit:'pcs', location:'G-D3', floor:'GROUND', category:'PERSONAL CARE', discount:'10% OFF' },
  /* FIRST — CLOTHING */
  { id:'d15', name:"Levi's 511 Slim Jeans",             brand:"Levi's",     price:2499,  mrp:3999,  stock:15,  unit:'pcs', location:'F-A1', floor:'FIRST',  category:'MEN',           discount:'38% OFF' },
  { id:'d16', name:'Arrow Formal Shirt XL',             brand:'Arrow',      price:1299,  mrp:1799,  stock:22,  unit:'pcs', location:'F-A2', floor:'FIRST',  category:'MEN',           discount:'28% OFF' },
  { id:'d17', name:'W Women Kurta Set M',               brand:'W',          price:1099,  mrp:1499,  stock:18,  unit:'pcs', location:'F-B1', floor:'FIRST',  category:'WOMEN',         discount:'27% OFF' },
  { id:'d18', name:'Biba Anarkali Suit',                brand:'Biba',       price:1899,  mrp:2699,  stock:10,  unit:'pcs', location:'F-B2', floor:'FIRST',  category:'WOMEN',         discount:'30% OFF' },
  /* FIRST — FOOTWEAR */
  { id:'d19', name:'Nike Air Max 270 White',            brand:'Nike',       price:8999,  mrp:10999, stock:8,   unit:'pcs', location:'F-C1', floor:'FIRST',  category:'FOOTWEAR',      discount:'18% OFF' },
  { id:'d20', name:'Puma Softride Running Shoes',       brand:'Puma',       price:3499,  mrp:4999,  stock:14,  unit:'pcs', location:'F-C2', floor:'FIRST',  category:'FOOTWEAR',      discount:'30% OFF' },
  { id:'d21', name:'Bata Formal Oxford Shoes',          brand:'Bata',       price:1999,  mrp:2599,  stock:20,  unit:'pcs', location:'F-C3', floor:'FIRST',  category:'FOOTWEAR',      discount:'23% OFF' },
  /* FIRST — ACCESSORIES */
  { id:'d22', name:'Fastrack Chronograph Watch',        brand:'Fastrack',   price:2995,  mrp:3495,  stock:12,  unit:'pcs', location:'F-D1', floor:'FIRST',  category:'ACCESSORIES',   discount:'14% OFF' },
  { id:'d23', name:'Wildcraft 40L Backpack Navy',       brand:'Wildcraft',  price:1799,  mrp:2499,  stock:9,   unit:'pcs', location:'F-D2', floor:'FIRST',  category:'ACCESSORIES',   discount:'28% OFF' },
  /* SECOND — KITCHEN */
  { id:'d24', name:'Prestige Pressure Cooker 5L',       brand:'Prestige',   price:1850,  mrp:2200,  stock:12,  unit:'pcs', location:'S-A1', floor:'SECOND', category:'KITCHEN',       discount:'16% OFF' },
  { id:'d25', name:'Milton Thermosteel Flask 1L',       brand:'Milton',     price:599,   mrp:750,   stock:30,  unit:'pcs', location:'S-A2', floor:'SECOND', category:'KITCHEN',       discount:'20% OFF' },
  { id:'d26', name:'Hawkins Classic Pressure Cooker 3L',brand:'Hawkins',    price:1299,  mrp:1599,  stock:16,  unit:'pcs', location:'S-A1', floor:'SECOND', category:'KITCHEN',       discount:'19% OFF' },
  /* SECOND — HOME */
  { id:'d27', name:'Bombay Dyeing Bath Towel Set 2pc',  brand:'Bombay Dyeing',price:549, mrp:699,   stock:40,  unit:'pcs', location:'S-B1', floor:'SECOND', category:'HOME ESSENTIALS',discount:'21% OFF' },
  { id:'d28', name:'Nilkamal Plastic Chair White',      brand:'Nilkamal',   price:899,   mrp:1099,  stock:25,  unit:'pcs', location:'S-B2', floor:'SECOND', category:'HOME ESSENTIALS',discount:'18% OFF' },
  /* SECOND — TOYS */
  { id:'d29', name:'LEGO Classic Creative Box 484pcs',  brand:'LEGO',       price:3499,  mrp:3999,  stock:5,   unit:'pcs', location:'S-C1', floor:'SECOND', category:'TOYS',          discount:'13% OFF' },
  { id:'d30', name:'Funskool Rubik\'s Cube 3x3',        brand:'Funskool',   price:299,   mrp:399,   stock:35,  unit:'pcs', location:'S-C2', floor:'SECOND', category:'TOYS',          discount:'25% OFF' },
  /* SECOND — FURNITURE */
  { id:'d31', name:'Kurl-On Foam Mattress Queen 6"',    brand:'Kurl-On',    price:12999, mrp:15999, stock:3,   unit:'pcs', location:'S-D1', floor:'SECOND', category:'FURNITURE',     discount:'19% OFF' },
  { id:'d32', name:'Godrej Interio Study Table',        brand:'Godrej',     price:6499,  mrp:7999,  stock:4,   unit:'pcs', location:'S-D2', floor:'SECOND', category:'FURNITURE',     discount:'19% OFF' },
];

const STORAGE_KEY = 'gmr_reminder_queue';

const FLOORS = [
  { key:'ALL',    label:'All Floors',    short:'All' },
  { key:'GROUND', label:'Ground Floor',  short:'GF'  },
  { key:'FIRST',  label:'First Floor',   short:'1F'  },
  { key:'SECOND', label:'Second Floor',  short:'2F'  },
];

const CATEGORIES = {
  ALL:    [],
  GROUND: ['DAIRY','SOFT DRINKS','SNACKS','PERSONAL CARE'],
  FIRST:  ['MEN','WOMEN','FOOTWEAR','ACCESSORIES'],
  SECOND: ['KITCHEN','HOME ESSENTIALS','TOYS','FURNITURE'],
};

const StockPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeFloor, setActiveFloor]               = useState('ALL');
  const [activeCategory, setActiveCategory]         = useState('');
  const [lockedId, setLockedId]                     = useState(null);
  const [searchTerm, setSearchTerm]                 = useState('');
  const [showOnlyOffers, setShowOnlyOffers]         = useState(false);
  const [sortBy, setSortBy]                         = useState('DEFAULT');
  const [reminderStatus, setReminderStatus]         = useState('');
  const [products, setProducts]                     = useState([]);
  const [loading, setLoading]                       = useState(true);
  const [loadError, setLoadError]                   = useState('');
  const [isDemo, setIsDemo]                         = useState(false);
  const [reloadKey, setReloadKey]                   = useState(0);
  const [cartId, setCartId]                         = useState(null);
  const [cartItemQuantities, setCartItemQuantities] = useState({});
  const [cartBusy, setCartBusy]                     = useState(false);
  const [cartStatus, setCartStatus]                 = useState('');
  const [currentOrder, setCurrentOrder]             = useState(null);

  const cartItemCount = Object.values(cartItemQuantities).reduce((s, q) => s + q, 0);

  /* ─── Load Products ── */
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ limit: '500' });
    if (searchTerm.trim()) params.set('q', searchTerm.trim());

    setLoading(true);
    setLoadError('');

    apiRequest(`/api/v1/products?${params}`, { signal: controller.signal })
      .then(result => {
        const items = result?.products;
        if (Array.isArray(items) && items.length > 0) {
          setProducts(items);
          setIsDemo(false);
        } else {
          setProducts(DEMO_PRODUCTS);
          setIsDemo(true);
        }
        setLoadError('');
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          /* Backend offline — show demo products, no error */
          setProducts(DEMO_PRODUCTS);
          setIsDemo(true);
          setLoadError('');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [searchTerm, reloadKey]);

  /* ─── Cart helpers ── */
  const handleProductClick = id => setLockedId(prev => prev === id ? null : id);

  const addToServerCart = async (e, product) => {
    e.stopPropagation();
    if (isDemo) { setCartStatus('Demo mode — connect live backend to use cart.'); return; }
    setCartBusy(true); setCartStatus('');
    try {
      let cid = cartId;
      if (!cid) {
        const cart = await apiRequest('/api/v1/carts', {
          method: 'POST',
          body: JSON.stringify({ storeId: '11111111-1111-4111-8111-111111111111' }),
        });
        cid = cart.id; setCartId(cid);
      }
      await apiRequest(`/api/v1/carts/${cid}/items`, {
        method: 'PUT',
        body: JSON.stringify({ productId: product.id, quantity: (cartItemQuantities[product.id] ?? 0) + 1 }),
      });
      setCartItemQuantities(q => ({ ...q, [product.id]: (q[product.id] ?? 0) + 1 }));
      setCartStatus(`✓ ${product.name} added to cart.`);
    } catch (err) { setCartStatus(err.message); }
    finally { setCartBusy(false); }
  };

  const placeOrder = async () => {
    if (!cartId) return;
    setCartBusy(true); setCartStatus('');
    try {
      const res = await apiRequest('/api/v1/orders', {
        method: 'POST',
        headers: { 'Idempotency-Key': `order-${cartId}` },
        body: JSON.stringify({ cartId }),
      });
      setCurrentOrder(res.order);
      setCartId(null); setCartItemQuantities({});
      setCartStatus(`Order ${res.order.id} created.`);
    } catch (err) { setCartStatus(err.message); }
    finally { setCartBusy(false); }
  };

  const addToQueue = (e, product) => {
    e.stopPropagation();
    try {
      const q = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!q.find(i => i?.id === product.id)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...q, { ...product, quantity: 1 }]));
        setReminderStatus(`✓ "${product.name}" saved to your list!`);
      } else {
        setReminderStatus(`"${product.name}" is already in your list.`);
      }
    } catch { setReminderStatus('Could not update list.'); }
    setTimeout(() => setReminderStatus(''), 3000);
  };

  /* ─── Filter & Sort ── */
  let displayProducts = products.filter(p => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q);

    if (showOnlyOffers && !p.discount) return false;
    if (activeFloor !== 'ALL' && (p.floor || '').toUpperCase() !== activeFloor) return false;
    if (activeCategory && (p.category || '').toUpperCase() !== activeCategory) return false;
    return matchSearch;
  });

  if (sortBy === 'PRICE_LOW')  displayProducts = [...displayProducts].sort((a, b) => a.price - b.price);
  if (sortBy === 'PRICE_HIGH') displayProducts = [...displayProducts].sort((a, b) => b.price - a.price);
  if (sortBy === 'NAME')       displayProducts = [...displayProducts].sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === 'DISCOUNT')   displayProducts = [...displayProducts].sort((a, b) => (b.discount ? 1 : 0) - (a.discount ? 1 : 0));

  const cats = CATEGORIES[activeFloor] || [];

  return (
    <div className="pro-terminal">

      {/* ── Sidebar ─────────────────────────────── */}
      <aside className="pro-sidebar">

        {/* Search */}
        <div className="search-neon-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="pro-search-input"
            placeholder="Search products, brands…"
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setActiveFloor('ALL'); setActiveCategory(''); }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ background:'none',border:'none',color:'#9ca3af',cursor:'pointer',padding:0,display:'flex',alignItems:'center' }}
              aria-label="Clear search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>

        {/* Offers Toggle */}
        <button
          className={`mega-offer-btn ${showOnlyOffers ? 'mega-active' : ''}`}
          onClick={() => { setShowOnlyOffers(v => !v); setActiveCategory(''); }}
        >
          🏷️ Sale & Offers Only
        </button>

        {/* Floor Tabs */}
        <span className="sidebar-section-label">Browse by floor</span>
        {FLOORS.map(f => (
          <button
            key={f.key}
            className={`pro-floor-id ${activeFloor === f.key ? 'floor-active' : ''}`}
            onClick={() => { setActiveFloor(f.key); setActiveCategory(''); setShowOnlyOffers(false); }}
          >
            <span style={{ display:'flex',alignItems:'center',gap:8 }}>
              <span style={{
                display:'inline-flex',alignItems:'center',justifyContent:'center',
                width:26,height:26,borderRadius:7,
                background: activeFloor === f.key ? '#00c853' : '#f3f4f6',
                color: activeFloor === f.key ? '#fff' : '#6b7280',
                fontSize:11,fontWeight:800,flexShrink:0,
              }}>{f.short}</span>
              {f.label}
            </span>
          </button>
        ))}

        {/* Category Filter */}
        {cats.length > 0 && (
          <>
            <span className="sidebar-section-label" style={{ marginTop:4 }}>Categories</span>
            {cats.map(cat => (
              <button
                key={cat}
                className={`pro-cat-btn ${activeCategory === cat ? 'cat-glow' : ''}`}
                onClick={() => setActiveCategory(activeCategory === cat ? '' : cat)}
              >
                {cat}
                {activeCategory === cat && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            ))}
          </>
        )}
      </aside>

      {/* ── Main ──────────────────────────────────── */}
      <main className="pro-main-viewport">

        {/* Demo Notice */}
        {isDemo && (
          <div className="cart-status-bar" style={{ background:'#fffbeb', borderColor:'#fcd34d', color:'#b45309' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Showing demo products — backend not connected. All {DEMO_PRODUCTS.length} sample products are displayed.
          </div>
        )}

        {/* Reminder / Cart Status */}
        {(reminderStatus || cartStatus) && (
          <div className="cart-status-bar" role="status" aria-live="polite">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {reminderStatus || cartStatus}
          </div>
        )}

        {/* Sort Bar */}
        <div className="pro-sort-bar">
          <span className="pro-sort-label">Sort</span>
          {[['DEFAULT','Default'],['PRICE_LOW','Price ↑'],['PRICE_HIGH','Price ↓'],['NAME','A–Z'],['DISCOUNT','On Sale']].map(([v,l]) => (
            <button
              key={v}
              className={`pro-sort-btn ${sortBy === v ? 'active-sort' : ''}`}
              onClick={() => setSortBy(v)}
            >{l}</button>
          ))}
          <span className="pro-sort-count">
            {loading ? '…' : `${displayProducts.length} of ${products.length} products`}
          </span>
        </div>

        {/* ── Product Grid ── */}
        {loading ? (
          <div className="pro-loading-grid">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="pro-skeleton-card" />)}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="pro-empty-state">
            <div className="pro-empty-icon">{showOnlyOffers ? '🏷️' : searchTerm ? '🔍' : '📦'}</div>
            <p style={{ color:'#374151', fontSize:15, fontWeight:600 }}>
              {showOnlyOffers ? 'No offers right now' : searchTerm ? `No results for "${searchTerm}"` : 'No products in this section'}
            </p>
            <p style={{ color:'#9ca3af', fontSize:13 }}>Try a different filter or browse all floors</p>
            <button
              style={{ padding:'9px 20px',background:'#edfaf3',border:'1.5px solid rgba(0,200,83,0.3)',borderRadius:10,color:'#009624',fontWeight:700,cursor:'pointer',fontSize:13,fontFamily:'Inter,sans-serif' }}
              onClick={() => { setActiveFloor('ALL'); setActiveCategory(''); setShowOnlyOffers(false); setSearchTerm(''); }}
            >
              Show all products
            </button>
          </div>
        ) : (
          <div className="pro-scroll-grid">
            {displayProducts.map(p => (
              <div
                key={p.id}
                className={`pro-product-card ${lockedId === p.id ? 'locked-glow' : ''}`}
                onClick={() => handleProductClick(p.id)}
              >
                {p.discount && <div className="yellow-offer-tag">{p.discount}</div>}

                {/* Image / Icon */}
                <div className="pro-img-wrapper">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="pro-product-img" loading="lazy"
                      onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                    />
                  ) : null}
                  <div style={{
                    display: p.image ? 'none' : 'flex',
                    flexDirection:'column', alignItems:'center', gap:6,
                    color:'#d1d5db',
                  }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                    <span style={{ fontSize:10, color:'#9ca3af', fontFamily:'Inter,sans-serif' }}>{p.category}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="pro-card-body">
                  {p.brand && <span className="pro-brand-label">{p.brand}</span>}
                  <h3 className="pro-product-name">{p.name}</h3>

                  <div className="pro-price-container">
                    <span className="pro-offer-price">₹{Number(p.price).toFixed(2)}</span>
                    {p.mrp && Number(p.mrp) > Number(p.price) && (
                      <span className="pro-mrp-strike">₹{Number(p.mrp).toFixed(2)}</span>
                    )}
                  </div>

                  {/* Floor + Zone badges */}
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                    <span style={{ display:'inline-flex',alignItems:'center',gap:3,padding:'2px 8px',background:'#f3f4f6',border:'1px solid #e5e7eb',borderRadius:999,fontSize:10.5,color:'#6b7280',fontWeight:600 }}>
                      📍 {p.location}
                    </span>
                    <span style={{ display:'inline-flex',alignItems:'center',gap:3,padding:'2px 8px',background:'#f3f4f6',border:'1px solid #e5e7eb',borderRadius:999,fontSize:10.5,color:'#6b7280',fontWeight:600 }}>
                      🏢 {p.floor}
                    </span>
                  </div>

                  {/* Expanded Details */}
                  {lockedId === p.id && (
                    <div className="pro-expanded-details">
                      <div className="detail-line"><span>Stock</span><span className="blue-val">{p.stock} {p.unit}</span></div>
                      <div className="detail-line"><span>Category</span><span className="blue-val">{p.category}</span></div>
                      <div className="detail-line"><span>Status</span><span className="status-live">● Available</span></div>

                      {user?.role === 'customer' && !isDemo && (
                        <button
                          className="pro-add-cart-btn"
                          disabled={cartBusy}
                          onClick={e => addToServerCart(e, p)}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
                          </svg>
                          Add to Cart
                        </button>
                      )}

                      <div className="pro-action-row">
                        <button className="pro-remind-btn" onClick={e => addToQueue(e, p)}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                            <line x1="3" y1="6" x2="3.01" y2="6"/>
                          </svg>
                          Save to List
                        </button>
                        <button
                          className="pro-track-btn"
                          onClick={e => { e.stopPropagation(); navigate('/tracking', { state: { product: p } }); }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 010 16c-4.418 0-8-3.582-8-8s3.582-8 8-8z"/>
                          </svg>
                          Navigate
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cart FAB */}
        {cartItemCount > 0 && (
          <button className="sticky-cart-fab" onClick={placeOrder} disabled={cartBusy}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
            </svg>
            {cartItemCount} item{cartItemCount !== 1 ? 's' : ''} — Place Order
          </button>
        )}
      </main>
    </div>
  );
};

export default StockPage;
