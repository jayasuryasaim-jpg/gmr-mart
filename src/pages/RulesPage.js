import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RULES = [
  { num:'01', title:'Smart Trolley Usage', body:'All GMR IoT trolleys must be activated via QR scan at the entrance. Customers are responsible for items in their trolley until checkout.' },
  { num:'02', title:'Product Availability', body:'Real-time stock levels are updated every 60 seconds. Out-of-stock items cannot be added to cart. Prices shown are inclusive of applicable taxes.' },
  { num:'03', title:'Payment Policy', body:'All payments are processed through our secure payment gateway. Cash payments are not accepted for smart cart orders. Refunds are processed within 5–7 business days.' },
  { num:'04', title:'Personal Data', body:'Your shopping data is used solely to improve your in-store experience. We do not share personal information with third parties. See our Privacy Policy for details.' },
  { num:'05', title:'Return & Refunds', body:'Perishable goods cannot be returned once purchased. Non-perishable items may be returned within 7 days in original condition with receipt.' },
  { num:'06', title:'Code of Conduct', body:'GMR reserves the right to revoke access for misuse of smart cart systems, trolley tampering, or any behaviour that disrupts other shoppers.' },
];

const css = `
.rules-root { min-height:calc(100vh - 68px); background:#f4f6f8; }
.rules-progress-bar { position:sticky; top:68px; z-index:100; height:3px; background:#f3f4f6; box-shadow:0 1px 4px rgba(0,0,0,0.06); }
.rules-progress-fill { height:100%; background:linear-gradient(90deg,#00c853,#009624); transition:width 0.2s ease; border-radius:0 2px 2px 0; }

.rules-inner { max-width:720px; margin:0 auto; padding:48px 24px 80px; display:flex; flex-direction:column; gap:28px; }

.rules-hero { background:linear-gradient(135deg,#00c853,#009624); border-radius:20px; padding:40px; text-align:center; position:relative; overflow:hidden; }
.rules-hero::before { content:''; position:absolute; inset:0; background:url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E"); }
.rules-hero-icon { width:64px; height:64px; background:rgba(255,255,255,0.2); border:2px solid rgba(255,255,255,0.35); border-radius:18px; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; backdrop-filter:blur(8px); position:relative; z-index:1; }
.rules-hero-title { font-family:'Space Grotesk',sans-serif; font-size:1.8rem; font-weight:700; color:#fff; margin-bottom:8px; position:relative; z-index:1; }
.rules-hero-sub { color:rgba(255,255,255,0.8); font-size:14.5px; line-height:1.7; position:relative; z-index:1; }

.rules-list { display:flex; flex-direction:column; gap:14px; }
.rule-card { background:#ffffff; border:1.5px solid #e5e7eb; border-radius:16px; padding:24px; display:flex; gap:18px; box-shadow:0 2px 6px rgba(0,0,0,0.05); transition:all 0.2s; }
.rule-card:hover { border-color:#00c853; box-shadow:0 6px 20px rgba(0,200,83,0.1); }
.rule-num { font-family:'Space Grotesk',sans-serif; font-size:2rem; font-weight:800; color:#e5e7eb; line-height:1; flex-shrink:0; min-width:44px; }
.rule-body { display:flex; flex-direction:column; gap:6px; }
.rule-title { font-family:'Space Grotesk',sans-serif; font-size:15px; font-weight:700; color:#111827; }
.rule-text { color:#6b7280; font-size:13.5px; line-height:1.7; }

.rules-agree-box { background:#ffffff; border:1.5px solid #e5e7eb; border-radius:18px; padding:28px; display:flex; flex-direction:column; gap:20px; box-shadow:0 4px 16px rgba(0,0,0,0.06); }
.rules-check-row { display:flex; align-items:flex-start; gap:13px; cursor:pointer; }
.rules-checkbox { width:22px; height:22px; border-radius:7px; border:2px solid #d1d5db; background:#fff; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all 0.18s; margin-top:1px; }
.rules-checkbox.checked { background:#00c853; border-color:#00c853; }
.rules-check-label { color:#374151; font-size:14px; line-height:1.6; cursor:pointer; }
.rules-check-label strong { color:#111827; }
.rules-agree-btn { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:14px; background:linear-gradient(135deg,#00c853,#009624); border:none; border-radius:12px; color:#fff; font-size:15px; font-weight:700; cursor:pointer; transition:all 0.22s; font-family:'Inter',sans-serif; box-shadow:0 4px 14px rgba(0,200,83,0.32); }
.rules-agree-btn:hover:not(:disabled) { background:linear-gradient(135deg,#00b748,#008a20); transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,200,83,0.42); }
.rules-agree-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
`;

export default function RulesPage() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [scroll, setScroll] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const pos = el.scrollTop;
      const max = el.scrollHeight - el.clientHeight;
      setScroll(max>0?(pos/max)*100:100);
    };
    window.addEventListener('scroll',onScroll);
    return ()=>window.removeEventListener('scroll',onScroll);
  },[]);

  return (
    <div className="rules-root"><style>{css}</style>

    <div className="rules-progress-bar">
      <div className="rules-progress-fill" style={{width:`${scroll}%`}}/>
    </div>

    <div className="rules-inner">
      {/* Hero */}
      <div className="rules-hero">
        <div className="rules-hero-icon">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <h1 className="rules-hero-title">Store Policies</h1>
        <p className="rules-hero-sub">Please read through our policies before using the GMR Smart Mart experience.</p>
      </div>

      {/* Rules */}
      <div className="rules-list">
        {RULES.map(r=>(
          <div key={r.num} className="rule-card">
            <span className="rule-num">{r.num}</span>
            <div className="rule-body">
              <h2 className="rule-title">{r.title}</h2>
              <p className="rule-text">{r.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Agreement */}
      <div className="rules-agree-box" ref={scrollRef}>
        <label className="rules-check-row" onClick={()=>setAgreed(v=>!v)}>
          <div className={`rules-checkbox ${agreed?'checked':''}`}>
            {agreed && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
          </div>
          <span className="rules-check-label">
            I have read and agree to all <strong>GMR Smart Mart store policies</strong>. I understand that violating these rules may result in suspension of my account.
          </span>
        </label>

        <button
          className="rules-agree-btn"
          disabled={!agreed}
          onClick={()=>navigate('/scan-cart')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {agreed ? 'Agree & Continue to Smart Cart →' : 'Check the box above to continue'}
        </button>
      </div>
    </div></div>
  );
}