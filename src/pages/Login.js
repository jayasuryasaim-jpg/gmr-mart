import React, { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const FEATURES = [
  { ico: "🗺️", label: "Interactive Store Map & Navigation" },
  { ico: "🛒", label: "IoT Smart Cart with QR Activation" },
  { ico: "📦", label: "Real-time Inventory Browsing" },
  { ico: "📋", label: "Personal Shopping List & Reminders" },
];

export default function Login() {
  const { user, login, register, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab]         = useState("signin");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (tab === "signin" || tab === "admin") {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate("/home");
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Already signed-in view ── */
  if (user) {
    const initial = user.email?.[0]?.toUpperCase() || "U";
    return (
      <div className="login-root">
        <div className="login-bg">
          <div className="login-bg-blob blob-1" />
          <div className="login-bg-blob blob-2" />
          <div className="login-bg-grid" />
        </div>
        <div className="login-panel" style={{ maxWidth:480,minHeight:'auto' }}>
          <div className="login-form-side" style={{ flex:'1' }}>
            <div className="login-card">
              <div className="login-signed-in">
                <div className="login-si-avatar">{initial}</div>
                <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.4rem', fontWeight:700, color:'#f0f4f8' }}>
                  Welcome back!
                </h2>
                <p style={{ color:'#6a8aaa', fontSize:14 }}>{user.email}</p>
                <span className={`login-role ${user.role || 'customer'}`}>{user.role || 'customer'}</span>
                <button className="login-btn" style={{ marginTop:8 }} onClick={() => navigate("/home")}>
                  Go to Dashboard →
                </button>
                <button onClick={logout} style={{ background:'none',border:'none',color:'#3a5070',fontSize:13,cursor:'pointer',marginTop:4,fontFamily:'Inter,sans-serif' }}>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-root">
      {/* Background */}
      <div className="login-bg">
        <div className="login-bg-blob blob-1" />
        <div className="login-bg-blob blob-2" />
        <div className="login-bg-grid" />
      </div>

      <div className="login-panel">
        {/* ── LEFT: Branding ───────────────── */}
        <div className="login-branding">
          <div className="login-branding-inner">
            <div className="login-logo-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00e676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>

            <h1 className="login-brand-name">
              GMR<br /><span>Smart Mart</span>
            </h1>
            <p className="login-tagline">
              The future of retail is here. Shop smarter with AI-powered navigation,
              IoT carts, and real-time inventory tracking.
            </p>

            <div className="login-feats">
              {FEATURES.map(f => (
                <div key={f.label} className="login-feat">
                  <div className="login-feat-ico">{f.ico}</div>
                  {f.label}
                </div>
              ))}
            </div>

            <div className="login-stats">
              <div>
                <span className="login-stat-val">500+</span>
                <span className="login-stat-label">Products</span>
              </div>
              <div>
                <span className="login-stat-val">3</span>
                <span className="login-stat-label">Floors</span>
              </div>
              <div>
                <span className="login-stat-val">24/7</span>
                <span className="login-stat-label">Live Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Form ──────────────────── */}
        <div className="login-form-side">
          <div className="login-card">
            {/* Tabs */}
            <div className="login-tabs">
              <button className={`login-tab ${tab==='signin'?'active':''}`} onClick={() => { setTab('signin'); setError(''); }}>Sign In</button>
              <button className={`login-tab ${tab==='register'?'active':''}`} onClick={() => { setTab('register'); setError(''); }}>Register</button>
              <button className={`login-tab ${tab==='admin'?'active':''}`} onClick={() => { setTab('admin'); setError(''); }}>Admin</button>
            </div>

            {/* Card Header */}
            <div className="login-card-header">
              {tab === 'signin'   && <><h2 className="login-card-title">Welcome back</h2><p className="login-card-sub">Sign in to your GMR account</p></>}
              {tab === 'register' && <><h2 className="login-card-title">Create account</h2><p className="login-card-sub">Join GMR Smart Mart today</p></>}
              {tab === 'admin'    && (
                <>
                  <h2 className="login-card-title">Admin Access</h2>
                  <p className="login-card-sub">Restricted to authorized staff</p>
                  <div className="login-admin-warn">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    Requires admin credentials
                  </div>
                </>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="login-error" style={{ marginBottom:16 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Form */}
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label className="login-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email address
                </label>
                <input
                  className="login-input"
                  type="email"
                  placeholder={tab==='admin'?'admin@gmrmart.in':'you@example.com'}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="login-field">
                <label className="login-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  Password
                </label>
                <div className="login-input-wrap">
                  <input
                    className="login-input"
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete={tab==='register'?'new-password':'current-password'}
                  />
                  <button type="button" className="login-pw-toggle" onClick={() => setShowPw(v => !v)} aria-label="Toggle password">
                    {showPw
                      ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                {tab === 'register' && <p className="login-hint">Use 8+ characters with a mix of letters and numbers</p>}
              </div>

              <button
                type="submit"
                className={`login-btn ${tab==='admin'?'admin-btn':''}`}
                disabled={loading}
              >
                {loading
                  ? <><span className="login-spinner" /> Authenticating…</>
                  : tab === 'signin'   ? 'Sign In to Dashboard →'
                  : tab === 'register' ? 'Create My Account →'
                  : 'Access Admin Console →'
                }
              </button>
            </form>

            <div className="login-footer">
              <div className="login-divider">or</div>
              <button
                className="login-demo"
                onClick={() => navigate("/home")}
              >
                Browse as guest →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
