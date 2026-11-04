import React, { useState, useEffect } from 'react';

const css = `
.rq-root { min-height:calc(100vh - 68px); background:#f4f6f8; padding:40px 24px 80px; }
.rq-wrap { max-width:980px; margin:0 auto; display:flex; flex-direction:column; gap:24px; }

.rq-page-header { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap; }
.rq-page-title { font-family:'Space Grotesk','Inter',sans-serif; font-size:1.9rem; font-weight:700; color:#111827; letter-spacing:-0.7px; }
.rq-page-sub { color:#6b7280; font-size:14px; margin-top:3px; }
.rq-clear-btn { display:flex; align-items:center; gap:7px; padding:9px 16px; background:#fef2f2; border:1.5px solid #fecaca; border-radius:10px; color:#dc2626; font-size:13px; font-weight:700; cursor:pointer; transition:all 0.18s; font-family:'Inter',sans-serif; }
.rq-clear-btn:hover { background:#fee2e2; }

.rq-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; padding:80px 24px; text-align:center; }
.rq-empty-icon { width:88px; height:88px; background:#edfaf3; border:2px solid rgba(0,200,83,0.2); border-radius:50%; display:flex; align-items:center; justify-content:center; color:#00c853; }
.rq-empty h2 { font-family:'Space Grotesk',sans-serif; font-size:1.3rem; font-weight:700; color:#111827; }
.rq-empty p { color:#6b7280; font-size:14px; max-width:330px; }

.rq-body { display:grid; grid-template-columns:1fr 300px; gap:20px; align-items:start; }

.rq-items { display:flex; flex-direction:column; gap:12px; }
.rq-item {
  display:flex; background:#ffffff; border:1.5px solid #e5e7eb;
  border-radius:16px; overflow:hidden; transition:all 0.2s;
  box-shadow:0 2px 6px rgba(0,0,0,0.05);
  animation:fadeInUp 0.35s ease both;
}
.rq-item:hover { border-color:#00c853; box-shadow:0 6px 20px rgba(0,200,83,0.1); transform:translateX(4px); }
.rq-item-accent { width:4px; flex-shrink:0; background:linear-gradient(to bottom,#00c853,#009624); }
.rq-item-body { flex:1; padding:16px 18px; display:flex; flex-direction:column; gap:10px; }
.rq-item-top { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; }
.rq-item-name { font-family:'Space Grotesk',sans-serif; font-size:14.5px; font-weight:600; color:#111827; line-height:1.3; }
.rq-remove { width:28px; height:28px; background:#fef2f2; border:1px solid #fecaca; border-radius:7px; color:#dc2626; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.18s; flex-shrink:0; }
.rq-remove:hover { background:#fee2e2; }
.rq-item-tags { display:flex; gap:7px; flex-wrap:wrap; }
.rq-tag { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; background:#f3f4f6; border:1px solid #e5e7eb; border-radius:999px; font-size:11.5px; color:#6b7280; font-weight:500; }
.rq-item-bottom { display:flex; align-items:center; justify-content:space-between; gap:12px; }
.rq-item-price { font-family:'Space Grotesk',sans-serif; font-size:1.1rem; font-weight:700; color:#00c853; }
.rq-qty { display:flex; align-items:center; background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:10px; overflow:hidden; }
.rq-qty-btn { width:34px; height:34px; background:none; border:none; color:#374151; font-size:17px; font-weight:700; cursor:pointer; transition:background 0.15s; display:flex; align-items:center; justify-content:center; }
.rq-qty-btn:hover:not(:disabled) { background:#edfaf3; color:#00c853; }
.rq-qty-btn:disabled { opacity:0.3; cursor:not-allowed; }
.rq-qty-val { min-width:34px; text-align:center; font-size:14px; font-weight:700; color:#111827; border-left:1px solid #e5e7eb; border-right:1px solid #e5e7eb; height:34px; display:flex; align-items:center; justify-content:center; }

.rq-summary { position:sticky; top:88px; }
.rq-summary-card { background:#ffffff; border:1.5px solid #e5e7eb; border-radius:18px; padding:24px; display:flex; flex-direction:column; gap:18px; box-shadow:0 4px 16px rgba(0,0,0,0.07); }
.rq-summary-title { font-family:'Space Grotesk',sans-serif; font-size:1.1rem; font-weight:700; color:#111827; }
.rq-summary-rows { display:flex; flex-direction:column; gap:10px; }
.rq-summary-row { display:flex; justify-content:space-between; font-size:14px; color:#6b7280; }
.rq-summary-row span:last-child { color:#111827; font-weight:500; }
.rq-summary-divider { height:1px; background:#f3f4f6; }
.rq-summary-total { display:flex; justify-content:space-between; align-items:center; font-size:15px; font-weight:700; color:#111827; }
.rq-total-amount { font-family:'Space Grotesk',sans-serif; font-size:1.5rem; color:#00c853; }
.rq-summary-note { font-size:11.5px; color:#9ca3af; line-height:1.5; }

@media(max-width:720px){ .rq-body{grid-template-columns:1fr;} .rq-summary{position:static;} }
@keyframes fadeInUp { from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);} }
`;

const STORAGE_KEY = 'gmr_reminder_queue';

export default function ReminderQueuePage() {
  const [queue, setQueue] = useState([]);

  const load = () => {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    setQueue(s.map(i=>({...i, quantity:i.quantity||1})));
  };
  useEffect(()=>{ load(); window.addEventListener('focus',load); return ()=>window.removeEventListener('focus',load); },[]);

  const updateQty = (id,delta) => {
    const u = queue.map(i=>i.id===id?{...i,quantity:Math.max(1,(i.quantity||1)+delta)}:i);
    setQueue(u); localStorage.setItem(STORAGE_KEY,JSON.stringify(u));
  };
  const remove = (id) => { const u=queue.filter(i=>i.id!==id); setQueue(u); localStorage.setItem(STORAGE_KEY,JSON.stringify(u)); };
  const clearAll = () => { setQueue([]); localStorage.removeItem(STORAGE_KEY); };

  const totalCost = queue.reduce((s,i)=>s+(parseFloat(i.price)||0)*(i.quantity||1),0);
  const totalItems = queue.reduce((s,i)=>s+(i.quantity||1),0);

  return (
    <div className="rq-root"><style>{css}</style>
    <div className="rq-wrap">
      <div className="rq-page-header">
        <div>
          <h1 className="rq-page-title">My Shopping List</h1>
          <p className="rq-page-sub">Saved products and pre-checkout reminders</p>
        </div>
        {queue.length>0 && (
          <button className="rq-clear-btn" onClick={clearAll}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
            Clear all
          </button>
        )}
      </div>

      {queue.length===0 ? (
        <div className="rq-empty">
          <div className="rq-empty-icon">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </div>
          <h2>Your list is empty</h2>
          <p>Browse products and tap <strong>"Save"</strong> to add items here for easy reference before checkout.</p>
        </div>
      ) : (
        <div className="rq-body">
          <div className="rq-items">
            {queue.map((p,i)=>(
              <div key={p.id} className="rq-item" style={{animationDelay:`${i*0.05}s`}}>
                <div className="rq-item-accent"/>
                <div className="rq-item-body">
                  <div className="rq-item-top">
                    <h3 className="rq-item-name">{p.name}</h3>
                    <button className="rq-remove" onClick={()=>remove(p.id)} aria-label={`Remove ${p.name}`}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                  <div className="rq-item-tags">
                    {p.location && <span className="rq-tag">📍 Zone {p.location}</span>}
                    {p.floor    && <span className="rq-tag">🏢 {p.floor}</span>}
                    {p.brand    && <span className="rq-tag">{p.brand}</span>}
                  </div>
                  <div className="rq-item-bottom">
                    <span className="rq-item-price">₹{((parseFloat(p.price)||0)*(p.quantity||1)).toFixed(2)}</span>
                    <div className="rq-qty">
                      <button className="rq-qty-btn" disabled={(p.quantity||1)<=1} onClick={()=>updateQty(p.id,-1)}>−</button>
                      <span className="rq-qty-val">{p.quantity||1}</span>
                      <button className="rq-qty-btn" onClick={()=>updateQty(p.id,1)}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rq-summary">
            <div className="rq-summary-card">
              <h2 className="rq-summary-title">Order Summary</h2>
              <div className="rq-summary-rows">
                <div className="rq-summary-row"><span>Items</span><span>{totalItems}</span></div>
                <div className="rq-summary-row"><span>Unique products</span><span>{queue.length}</span></div>
                <div className="rq-summary-divider"/>
                <div className="rq-summary-total">
                  <span>Est. Total</span>
                  <span className="rq-total-amount">₹{totalCost.toFixed(2)}</span>
                </div>
              </div>
              <p className="rq-summary-note">Prices are indicative and may vary at checkout.</p>
            </div>
          </div>
        </div>
      )}
    </div></div>
  );
}