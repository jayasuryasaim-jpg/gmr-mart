import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const css = `
.track-root { min-height:calc(100vh - 68px); background:#f4f6f8; padding:40px 24px 80px; }
.track-inner { max-width:900px; margin:0 auto; display:flex; flex-direction:column; gap:28px; }

.track-header { display:flex; align-items:flex-start; gap:16px; }
.track-header-icon { width:52px; height:52px; background:linear-gradient(135deg,#00c853,#009624); border-radius:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 4px 14px rgba(0,200,83,0.3); }
.track-title { font-family:'Space Grotesk','Inter',sans-serif; font-size:1.9rem; font-weight:700; color:#111827; letter-spacing:-0.6px; }
.track-sub { color:#6b7280; font-size:14px; margin-top:3px; }

.track-product-banner { display:flex; align-items:center; gap:12px; padding:16px 20px; background:#edfaf3; border:1.5px solid rgba(0,200,83,0.3); border-radius:14px; }
.track-product-tag { display:inline-flex; align-items:center; gap:6px; padding:4px 12px; background:#00c853; border-radius:999px; color:#fff; font-size:12px; font-weight:700; }
.track-product-name { font-size:14.5px; font-weight:600; color:#111827; }
.track-product-zone { font-size:13px; color:#6b7280; }

.track-section-label { font-size:11px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:0.9px; margin-bottom:12px; }

.track-floors { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
.track-floor-btn {
  padding:20px 16px; background:#ffffff; border:1.5px solid #e5e7eb; border-radius:16px;
  text-align:center; cursor:pointer; transition:all 0.2s; display:flex; flex-direction:column; align-items:center; gap:8px;
  box-shadow:0 2px 6px rgba(0,0,0,0.05);
}
.track-floor-btn:hover { border-color:#00c853; transform:translateY(-2px); box-shadow:0 8px 20px rgba(0,200,83,0.12); }
.track-floor-btn.active { border-color:#00c853; background:#edfaf3; box-shadow:0 4px 16px rgba(0,200,83,0.18); }
.track-floor-num { font-family:'Space Grotesk',sans-serif; font-size:1.9rem; font-weight:800; color:#d1d5db; transition:color 0.2s; }
.track-floor-btn.active .track-floor-num { color:#00c853; }
.track-floor-name { font-size:13px; font-weight:600; color:#374151; }
.track-floor-desc { font-size:11.5px; color:#9ca3af; }

.track-transit { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
.track-transit-card {
  display:flex; align-items:center; gap:14px; padding:18px; background:#ffffff;
  border:1.5px solid #e5e7eb; border-radius:14px; cursor:pointer; transition:all 0.2s;
  box-shadow:0 2px 6px rgba(0,0,0,0.05);
}
.track-transit-card:hover { border-color:#00c853; background:#f0fdf4; box-shadow:0 6px 18px rgba(0,200,83,0.1); }
.track-transit-card.active-transit { border-color:#00c853; background:#edfaf3; }
.track-transit-icon { width:44px; height:44px; background:#f3f4f6; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.4rem; flex-shrink:0; transition:background 0.2s; }
.track-transit-card.active-transit .track-transit-icon { background:#00c853; }
.track-transit-name { font-size:14px; font-weight:600; color:#111827; }
.track-transit-desc { font-size:12px; color:#6b7280; }

.track-route-card { background:#ffffff; border:1.5px solid #e5e7eb; border-radius:18px; padding:28px; box-shadow:0 4px 16px rgba(0,0,0,0.07); }
.track-route-title { font-family:'Space Grotesk',sans-serif; font-size:1rem; font-weight:700; color:#111827; margin-bottom:20px; display:flex; align-items:center; gap:8px; }
.track-route-steps { display:flex; flex-direction:column; gap:0; }
.track-step { display:flex; gap:14px; }
.track-step-left { display:flex; flex-direction:column; align-items:center; }
.track-step-dot { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; flex-shrink:0; }
.track-step-dot.start { background:linear-gradient(135deg,#00c853,#009624); color:#fff; box-shadow:0 3px 10px rgba(0,200,83,0.35); }
.track-step-dot.mid { background:#f3f4f6; border:1.5px solid #e5e7eb; color:#9ca3af; }
.track-step-dot.end { background:#edfaf3; border:2px solid #00c853; color:#009624; }
.track-step-line { width:2px; flex:1; background:#f3f4f6; margin:4px auto; }
.track-step-content { padding:4px 0 20px; flex:1; }
.track-step-label { font-size:14px; font-weight:600; color:#111827; }
.track-step-sub { font-size:12px; color:#9ca3af; margin-top:2px; }
`;

const FLOORS = [
  { code:'GROUND', label:'G', name:'Ground Floor', desc:'Grocery, Dairy, Snacks' },
  { code:'FIRST',  label:'1', name:'First Floor',  desc:'Clothing, Footwear' },
  { code:'SECOND', label:'2', name:'Second Floor', desc:'Home, Kitchen, Toys' },
];
const TRANSIT = [
  { id:'ELEVATOR', icon:'🛗', name:'Elevator',   desc:'Accessible, carries trolley' },
  { id:'ESCALATOR',icon:'📶', name:'Escalator',  desc:'Fast, no trolley' },
  { id:'STAIRS',   icon:'🚶', name:'Stairs',      desc:'Closest, ground only' },
  { id:'RAMP',     icon:'♿', name:'Ramp',        desc:'Wheelchair friendly' },
];

export default function TrackingPage() {
  const { state: ls } = useLocation();
  const product = ls?.product;

  const [floor, setFloor]     = useState('GROUND');
  const [transit, setTransit] = useState('ELEVATOR');

  const destFloor = product?.floor || floor;
  const destZone  = product?.location || 'A1';

  const steps = [
    { dot:'start', label:'You are here', sub:'Store Entrance / Current Position' },
    ...(floor!==destFloor?[{ dot:'mid', label:`Take ${TRANSIT.find(t=>t.id===transit)?.name || 'Elevator'} to ${destFloor.charAt(0)+destFloor.slice(1).toLowerCase()} Floor`, sub:'Change floors' }]:[]),
    { dot:'mid', label:`Head to Zone ${destZone}`, sub:`${destFloor.charAt(0)+destFloor.slice(1).toLowerCase()} Floor — Aisle ${destZone}` },
    { dot:'end', label:product?product.name:'Your Destination', sub:'📍 Found!' },
  ];

  return (
    <div className="track-root"><style>{css}</style>
    <div className="track-inner">

      <div className="track-header">
        <div className="track-header-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 010 16c-3.31 0-6.21-2-7.4-5"/><path d="M4.93 4.93L2 2"/></svg>
        </div>
        <div>
          <h1 className="track-title">Store Navigation</h1>
          <p className="track-sub">Get step-by-step directions to any product or zone</p>
        </div>
      </div>

      {product && (
        <div className="track-product-banner">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#009624" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
          <div style={{flex:1}}>
            <p className="track-product-name">{product.name}</p>
            <p className="track-product-zone">Zone {product.location} · {product.floor} Floor</p>
          </div>
          <span className="track-product-tag">Navigate Here</span>
        </div>
      )}

      <div>
        <p className="track-section-label">Select Floor</p>
        <div className="track-floors">
          {FLOORS.map(f=>(
            <button key={f.code} className={`track-floor-btn ${floor===f.code?'active':''}`} onClick={()=>setFloor(f.code)}>
              <span className="track-floor-num">{f.label}</span>
              <span className="track-floor-name">{f.name}</span>
              <span className="track-floor-desc">{f.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="track-section-label">Mode of Transit</p>
        <div className="track-transit">
          {TRANSIT.map(t=>(
            <div key={t.id} className={`track-transit-card ${transit===t.id?'active-transit':''}`} onClick={()=>setTransit(t.id)}>
              <div className={`track-transit-icon ${transit===t.id?'':''}` }>{t.icon}</div>
              <div>
                <p className="track-transit-name">{t.name}</p>
                <p className="track-transit-desc">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="track-route-card">
        <h2 className="track-route-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00c853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          Suggested Route
        </h2>
        <div className="track-route-steps">
          {steps.map((step,i)=>(
            <div key={i} className="track-step">
              <div className="track-step-left">
                <div className={`track-step-dot ${step.dot}`}>{i+1}</div>
                {i<steps.length-1 && <div className="track-step-line"/>}
              </div>
              <div className="track-step-content">
                <p className="track-step-label">{step.label}</p>
                <p className="track-step-sub">{step.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div></div>
  );
}