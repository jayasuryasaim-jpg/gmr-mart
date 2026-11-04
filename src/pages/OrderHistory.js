import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { apiRequest } from "../services/api";

const css = `
.orders-root { min-height:calc(100vh - 68px); background:#f4f6f8; padding:40px 24px 80px; }
.orders-container { max-width:820px; margin:0 auto; display:flex; flex-direction:column; gap:24px; }

.orders-page-header { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap; }
.orders-page-title { font-family:'Space Grotesk','Inter',sans-serif; font-size:1.9rem; font-weight:700; color:#111827; letter-spacing:-0.7px; }
.orders-page-sub { color:#6b7280; font-size:14px; margin-top:3px; }
.orders-count-badge { display:inline-flex; align-items:center; gap:7px; padding:7px 14px; background:#edfaf3; border:1.5px solid rgba(0,200,83,0.3); border-radius:999px; color:#009624; font-size:13px; font-weight:700; }

.orders-alert { display:flex; align-items:center; gap:10px; padding:13px 16px; border-radius:12px; font-size:14px; font-weight:500; }
.orders-alert.success { background:#f0fdf4; border:1.5px solid #bbf7d0; color:#16a34a; }
.orders-alert.error   { background:#fef2f2; border:1.5px solid #fecaca; color:#dc2626; }

.orders-loading { display:flex; flex-direction:column; gap:14px; }
.orders-skel { height:140px; background:linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%); background-size:800px 100%; animation:shimmer 1.6s infinite linear; border-radius:16px; border:1px solid #e5e7eb; }
@keyframes shimmer { 0%{background-position:-800px 0;}100%{background-position:800px 0;} }

.orders-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; padding:80px 24px; text-align:center; }
.orders-empty-icon { width:88px; height:88px; background:#edfaf3; border:2px solid rgba(0,200,83,0.2); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:2.6rem; }
.orders-empty h2 { font-family:'Space Grotesk',sans-serif; font-size:1.3rem; font-weight:700; color:#111827; }
.orders-empty p { color:#6b7280; font-size:14px; max-width:320px; }

.orders-list { display:flex; flex-direction:column; gap:14px; }
.order-card {
  background:#ffffff; border:1.5px solid #e5e7eb; border-radius:18px;
  padding:24px; display:flex; flex-direction:column; gap:18px;
  box-shadow:0 2px 8px rgba(0,0,0,0.05); transition:all 0.2s;
  animation:fadeInUp 0.4s ease;
}
.order-card:hover { border-color:#00c853; box-shadow:0 8px 28px rgba(0,200,83,0.1),0 2px 8px rgba(0,0,0,0.06); }
@keyframes fadeInUp { from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);} }

.order-card-top { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap; }
.order-id-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.order-id { font-family:'Inter',monospace; font-size:13.5px; font-weight:600; color:#374151; background:#f3f4f6; padding:3px 10px; border-radius:6px; }
.order-status { display:inline-flex; align-items:center; gap:6px; padding:4px 11px; border-radius:999px; font-size:12px; font-weight:700; }
.order-status-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.order-total { font-family:'Space Grotesk',sans-serif; font-size:1.2rem; font-weight:700; color:#00c853; }

.order-items-list { display:flex; flex-direction:column; gap:8px; }
.order-item-row { display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:#f9fafb; border:1px solid #f3f4f6; border-radius:10px; gap:12px; }
.order-item-info { display:flex; align-items:center; gap:10px; }
.order-item-name { font-size:13.5px; font-weight:500; color:#111827; }
.order-item-qty { font-size:12px; color:#6b7280; background:#e5e7eb; padding:2px 8px; border-radius:5px; font-weight:600; }
.order-item-price { font-size:13px; font-weight:600; color:#374151; }

.order-actions { display:flex; gap:10px; flex-wrap:wrap; }
.order-btn { display:inline-flex; align-items:center; gap:7px; padding:10px 20px; border-radius:10px; font-size:13.5px; font-weight:700; cursor:pointer; transition:all 0.2s; border:none; font-family:'Inter',sans-serif; }
.order-btn:disabled { opacity:0.5; cursor:not-allowed; }
.order-btn.pay { background:linear-gradient(135deg,#00c853,#009624); color:#fff; box-shadow:0 3px 12px rgba(0,200,83,0.3); }
.order-btn.pay:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); box-shadow:0 6px 20px rgba(0,200,83,0.4); }
.order-btn.cancel { background:#fef2f2; border:1.5px solid #fecaca; color:#dc2626; }
.order-btn.cancel:hover:not(:disabled) { background:#fee2e2; }
.order-spinner { width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite;display:inline-block; }
@keyframes spin { to{transform:rotate(360deg);} }
`;

function formatPrice(v) {
  return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR"}).format(v/100);
}
function statusCfg(s) {
  if (s==="paid"||s==="completed") return {label:"Completed",color:"#16a34a",bg:"#f0fdf4",border:"#bbf7d0"};
  if (s==="pending_payment")       return {label:"Pending Payment",color:"#d97706",bg:"#fffbeb",border:"#fcd34d"};
  if (s==="cancelled")             return {label:"Cancelled",color:"#dc2626",bg:"#fef2f2",border:"#fecaca"};
  return {label:s||"Unknown",color:"#6b7280",bg:"#f9fafb",border:"#e5e7eb"};
}

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders]     = useState([]);
  const [status, setStatus]     = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(true);
  const [busy, setBusy]         = useState("");

  const load = useCallback(async (sig) => {
    const r = await apiRequest("/api/v1/orders",{signal:sig});
    setOrders(r.orders); setError("");
  },[]);

  useEffect(()=>{
    if (user?.role!=="customer") return;
    setLoading(true);
    const c = new AbortController();
    load(c.signal).catch(e=>{ if(e.name!=="AbortError") setError(e.message); }).finally(()=>setLoading(false));
    return ()=>c.abort();
  },[load,user]);

  const doAction = async (order, action) => {
    setBusy(order.id); setStatus("");
    try {
      if (action==="cancel") {
        await apiRequest(`/api/v1/orders/${order.id}/cancel`,{method:"POST"});
        setStatus("Order cancelled."); await load();
      } else {
        const r = await apiRequest(`/api/v1/orders/${order.id}/payment-session`,{method:"POST"});
        window.location.assign(r.checkoutUrl);
      }
    } catch(e){ setStatus(e.message); } finally { setBusy(""); }
  };

  if (user?.role!=="customer") return (
    <div className="orders-root"><style>{css}</style>
      <div className="orders-empty"><div className="orders-empty-icon">🔒</div><h2>Sign in required</h2><p>Please sign in with a customer account to view orders.</p></div>
    </div>
  );

  return (
    <div className="orders-root"><style>{css}</style>
    <div className="orders-container">
      <div className="orders-page-header">
        <div>
          <h1 className="orders-page-title">Order History</h1>
          <p className="orders-page-sub">Track your purchases and pending payments</p>
        </div>
        <span className="orders-count-badge">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          {orders.length} order{orders.length!==1?"s":""}
        </span>
      </div>

      {status && <div className={`orders-alert ${status.includes("cancel")?"success":"error"}`}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        {status}</div>}
      {error && <div className="orders-alert error">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        {error}</div>}

      {loading && <div className="orders-loading">{[1,2,3].map(i=><div key={i} className="orders-skel"/>)}</div>}

      {!loading && !error && orders.length===0 && (
        <div className="orders-empty"><div className="orders-empty-icon">📦</div><h2>No orders yet</h2><p>Your orders will appear here once you make a purchase.</p></div>
      )}

      {!loading && orders.length>0 && (
        <div className="orders-list">
          {orders.map(order=>{
            const cfg=statusCfg(order.status); const isBusy=busy===order.id;
            return (
              <article key={order.id} className="order-card">
                <div className="order-card-top">
                  <div className="order-id-row">
                    <span className="order-id">#{order.id}</span>
                    <span className="order-status" style={{color:cfg.color,background:cfg.bg,border:`1.5px solid ${cfg.border}`}}>
                      <span className="order-status-dot" style={{background:cfg.color}}/>{cfg.label}
                    </span>
                  </div>
                  <span className="order-total">{formatPrice(order.totalMinor)}</span>
                </div>

                <div className="order-items-list">
                  {order.items.map(item=>(
                    <div key={item.productId} className="order-item-row">
                      <div className="order-item-info">
                        <span className="order-item-name">{item.name}</span>
                        <span className="order-item-qty">×{item.quantity}</span>
                      </div>
                      <span className="order-item-price">{formatPrice(item.unitPriceMinor)}</span>
                    </div>
                  ))}
                </div>

                {order.status==="pending_payment" && (
                  <div className="order-actions">
                    <button className="order-btn pay" disabled={isBusy} onClick={()=>doAction(order,"pay")}>
                      {isBusy?<span className="order-spinner"/>:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
                      Continue to Payment
                    </button>
                    <button className="order-btn cancel" disabled={isBusy} onClick={()=>doAction(order,"cancel")}>Cancel Order</button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div></div>
  );
}
