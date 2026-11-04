import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import "./Home.css";

const FEATURES = [
  {
    icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>),
    title: "Interactive Store Map",
    desc: "Navigate every aisle with our real-time heatmap and zone-based routing system.",
    cta: "Open Map", path: "/heatmap", color:"#00c853", delay:"0s",
  },
  {
    icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>),
    title: "Browse Products", 
    desc: "Explore real-time inventory across all floors, filter by category and find deals.",
    cta: "Shop Now", path: "/availability", color:"#009624", delay:"0.08s",
  },
  {
    icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>),
    title: "Smart Cart",
    desc: "Scan the trolley QR and let our IoT system track every item you add in real-time.",
    cta: "Scan Trolley", path: "/scan-cart", color:"#00c853", delay:"0.16s",
  },
  {
    icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>),
    title: "My Shopping List",
    desc: "Save items to your personal list, set quantities and track estimated cost before checkout.",
    cta: "View My List", path: "/reminder-queue", color:"#009624", delay:"0.24s",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const name = user?.email?.split("@")[0] || "Shopper";

  return (
    <div className="home-root">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="home-hero-section">
        <div className="home-hero-blob home-hero-blob-1" />
        <div className="home-hero-blob home-hero-blob-2" />

        <div className="home-hero-inner">
          <div className="home-hero-eyebrow">
            <span className="home-hero-dot" />
            {user ? `Welcome back, ${name}` : "GMR Smart Mart — AI-Powered Retail"}
          </div>

          <h1 className="home-hero-title">
            The smarter way to<br /><em>shop in-store</em>
          </h1>

          <p className="home-hero-sub">
            Navigate, scan, browse and checkout seamlessly with our IoT-enabled smart cart
            system and real-time inventory platform.
          </p>

          <div className="home-hero-btns">
            <button className="home-btn-white" onClick={() => navigate("/availability")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              Browse Products
            </button>
            <button className="home-btn-outline-white" onClick={() => navigate("/heatmap")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
              </svg>
              View Store Map
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────── */}
      <div className="home-stats-bar">
        <div className="home-stats-inner">
          {[
            { num: "500+", lbl: "Products in Stock" },
            { num: "3",    lbl: "Shopping Floors" },
            { num: "24/7", lbl: "Live Inventory" },
            { num: "IoT",  lbl: "Smart Trolleys" },
          ].map(s => (
            <div key={s.lbl} className="home-stat-item">
              <span className="home-stat-num">{s.num}</span>
              <span className="home-stat-lbl">{s.lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Feature Cards ──────────────────────────────── */}
      <div className="home-main">
        <section>
          <div className="home-sec-eyebrow">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            Features
          </div>
          <h2 className="home-sec-title">Everything you need to shop smarter</h2>
          <p className="home-sec-sub">One unified platform connecting navigation, inventory, smart carts and checkout.</p>

          <div className="home-features-grid" style={{ marginTop:32 }}>
            {FEATURES.map(f => (
              <button
                key={f.title}
                className="home-feat-card"
                style={{ "--d": f.delay }}
                onClick={() => navigate(f.path)}
              >
                <div className="home-feat-icon">{f.icon}</div>
                <div>
                  <h3 className="home-feat-title">{f.title}</h3>
                  <p className="home-feat-desc">{f.desc}</p>
                </div>
                <div className="home-feat-cta">
                  {f.cta}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── QR CTA ─────────────────────────────────── */}
        <section className="home-qr-card">
          <div className="home-qr-frame">
            <div className="home-qr-corner tl" />
            <div className="home-qr-corner tr" />
            <div className="home-qr-corner bl" />
            <div className="home-qr-corner br" />
            <span className="home-qr-label">QR</span>
            <div className="home-qr-beam" />
          </div>

          <div className="home-qr-content">
            <div className="home-qr-badge">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              Smart Trolley System
            </div>
            <h2 className="home-qr-title">Activate your smart cart</h2>
            <p className="home-qr-desc">
              Scan the QR code on any GMR trolley to start an authenticated session.
              Items are tracked automatically as you shop.
            </p>
            <div className="home-qr-btns">
              <button className="home-btn-green" onClick={() => navigate("/scan-cart")}>
                Start Scanning
              </button>
              <button className="home-btn-outline-green" onClick={() => navigate("/rules")}>
                Read Policies
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
