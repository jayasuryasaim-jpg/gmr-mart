import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const css = `
.pay-root { min-height:calc(100vh - 68px); background:#f4f6f8; display:flex; align-items:center; justify-content:center; padding:40px 24px; }
.pay-card { background:#ffffff; border:1.5px solid #e5e7eb; border-radius:24px; padding:52px 44px; max-width:480px; width:100%; text-align:center; display:flex; flex-direction:column; align-items:center; gap:22px; box-shadow:0 8px 32px rgba(0,0,0,0.09); animation:fadeInUp 0.5s ease; }
@keyframes fadeInUp { from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);} }

.pay-icon-ring { width:90px; height:90px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.pay-icon-ring.success { background:#f0fdf4; border:2px solid #bbf7d0; }
.pay-icon-ring.pending { background:#fffbeb; border:2px solid #fcd34d; }
.pay-icon-ring.cancelled { background:#fef2f2; border:2px solid #fecaca; }
.pay-icon-ring.demo { background:#edfaf3; border:2px solid rgba(0,200,83,0.3); }

.pay-title { font-family:'Space Grotesk','Inter',sans-serif; font-size:1.7rem; font-weight:700; color:#111827; letter-spacing:-0.5px; }
.pay-subtitle { color:#6b7280; font-size:14.5px; line-height:1.7; max-width:340px; }

.pay-info-box { width:100%; background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:14px; padding:18px 20px; display:flex; flex-direction:column; gap:10px; }
.pay-info-row { display:flex; justify-content:space-between; align-items:center; font-size:13.5px; }
.pay-info-label { color:#6b7280; }
.pay-info-val { color:#111827; font-weight:600; }

.pay-actions { display:flex; gap:10px; width:100%; flex-wrap:wrap; }
.pay-btn { flex:1; display:flex; align-items:center; justify-content:center; gap:7px; padding:12px 20px; border-radius:12px; font-size:14px; font-weight:700; cursor:pointer; transition:all 0.22s; font-family:'Inter',sans-serif; border:none; }
.pay-btn.primary { background:linear-gradient(135deg,#00c853,#009624); color:#fff; box-shadow:0 4px 14px rgba(0,200,83,0.32); }
.pay-btn.primary:hover { background:linear-gradient(135deg,#00b748,#008a20); transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,200,83,0.42); }
.pay-btn.ghost { background:#f9fafb; border:1.5px solid #e5e7eb; color:#374151; }
.pay-btn.ghost:hover { border-color:#d1d5db; background:#f3f4f6; }

.pay-demo-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; width:100%; }
.pay-demo-card { background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:14px; padding:14px; text-align:center; display:flex; flex-direction:column; gap:5px; }
.pay-demo-card-icon { font-size:1.6rem; }
.pay-demo-card-label { font-size:11.5px; font-weight:700; color:#111827; }
.pay-demo-card-sub { font-size:11px; color:#9ca3af; }
`;

export default function Payment() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState('loading');

  useEffect(() => {
    const s = params.get('status');
    if (s) { setState(s); return; }
    const sessionId = params.get('session_id');
    if (sessionId) { setState('success'); return; }
    setState('demo');
  }, [params]);

  if (state === 'loading') return (
    <div className="pay-root"><style>{css}</style>
      <div className="pay-card">
        <div style={{width:48,height:48,border:'3px solid #e5e7eb',borderTopColor:'#00c853',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>
        <p style={{color:'#6b7280',fontSize:14}}>Processing payment…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
      </div>
    </div>
  );

  const configs = {
    success: {
      ring:'success', icon:(
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      ),
      title:'Payment Successful!', sub:'Your order has been placed and confirmed.',
      actions:[{label:'View Orders →', cls:'primary', fn:()=>navigate('/order-history')},{label:'Continue Shopping', cls:'ghost', fn:()=>navigate('/availability')}],
    },
    pending: {
      ring:'pending', icon:(
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      ),
      title:'Payment Pending', sub:'Your payment is being processed. Please do not close this page.',
      actions:[{label:'View Orders →', cls:'primary', fn:()=>navigate('/order-history')},{label:'Go Home', cls:'ghost', fn:()=>navigate('/home')}],
    },
    cancelled: {
      ring:'cancelled', icon:(
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      ),
      title:'Order Cancelled', sub:'Your order was cancelled. You have not been charged.',
      actions:[{label:'Browse Products', cls:'primary', fn:()=>navigate('/availability')},{label:'View Orders', cls:'ghost', fn:()=>navigate('/order-history')}],
    },
    demo: {
      ring:'demo', icon:(
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00c853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      ),
      title:'Payment Gateway', sub:'Connect a live backend to enable real payments.',
      actions:[{label:'Browse Products', cls:'primary', fn:()=>navigate('/availability')},{label:'Go Home', cls:'ghost', fn:()=>navigate('/home')}],
    },
  };

  const cfg = configs[state] || configs.demo;

  return (
    <div className="pay-root"><style>{css}</style>
    <div className="pay-card">
      <div className={`pay-icon-ring ${cfg.ring}`}>{cfg.icon}</div>
      <h1 className="pay-title">{cfg.title}</h1>
      <p className="pay-subtitle">{cfg.sub}</p>

      {state==='demo' && (
        <div className="pay-demo-grid">
          {[{icon:'📦',label:'Add products',sub:'Browse catalog'},{icon:'🛒',label:'Use smart cart',sub:'Scan trolley QR'},{icon:'📋',label:'Save a list',sub:'My shopping list'},{icon:'🗺️',label:'Find products',sub:'Store map'}].map(c=>(
            <div key={c.label} className="pay-demo-card">
              <div className="pay-demo-card-icon">{c.icon}</div>
              <div className="pay-demo-card-label">{c.label}</div>
              <div className="pay-demo-card-sub">{c.sub}</div>
            </div>
          ))}
        </div>
      )}

      <div className="pay-actions">
        {cfg.actions.map(a=>(
          <button key={a.label} className={`pay-btn ${a.cls}`} onClick={a.fn}>{a.label}</button>
        ))}
      </div>
    </div></div>
  );
}