import React, { useState, useMemo, useEffect, useCallback } from 'react';
import './Admin.css';

const AdminDashboard = ({ onLogout }) => {
  const [view, setView] = useState('LIVE');
  const [selectedCart, setSelectedCart] = useState(null);
  const [verifiedCarts, setVerifiedCarts] = useState([]);

  const today = "24/02/2026";

  // --- SECURITY LAYER: AUTO-LOGOUT INACTIVITY TIMER ---
  useEffect(() => {
    let logoutTimer;

    const startTimer = () => {
      // Set timer for 10 minutes (600,000 milliseconds)
      logoutTimer = setTimeout(() => {
        console.warn("SECURITY ALERT: Session idle. Terminating...");
        onLogout(); 
      }, 600000); 
    };

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      startTimer();
    };

    // Listen for activity to reset the timer
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('click', resetTimer);

    startTimer(); // Initial start

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('click', resetTimer);
      clearTimeout(logoutTimer);
    };
  }, [onLogout]);

  // --- DATA LOGIC ---
  const activeCarts = useMemo(() => {
    const names = ["Rahul K.", "Amit P.", "Sania M.", "Sneha L.", "Karan V.", "Vikram S.", "Priya D.", "Arjun B.", "Anjali R.", "Rohan M.", "Deepak J.", "Meera T.", "Suresh N.", "Aditi G.", "Yash P."];
    return names.map((name, i) => {
      const status = i % 3 === 0 ? 'PAID' : 'UNPAID';
      const riskLevel = status === 'PAID' 
        ? Math.floor(Math.random() * 15) + 5  
        : Math.floor(Math.random() * 20) + 75; 
      
      return {
        id: `GMR-C${(i + 1).toString().padStart(2, '0')}`,
        user: name,
        status: status,
        risk: riskLevel,
        paymentWeight: 6075, 
        exitWeight: i === 4 ? 6200 : 6075, 
        total: 1066 + (i * 10),
        items: [
          { n: 'Amul Gold Milk', p: 66, w: '1030g' },
          { n: 'Basmati Rice 5kg', p: 850, w: '5000g' },
          { n: 'Napkin Pack', p: 150, w: '45g' }
        ]
      };
    });
  }, []);

  const handleAuthorize = (id) => {
    const cart = activeCarts.find(c => c.id === id);
    if (cart.status !== 'PAID') return;
    setVerifiedCarts(prev => [...prev, id]);
    setView('LIVE');
  };

  return (
    <div className="terminal-root">
      {/* SIDEBAR NAVIGATION */}
      <nav className="side-nav">
        <div className="nav-header">GMR_CORE</div>
        <div className="nav-links-stack">
          <button className={view === 'LIVE' ? 'active' : ''} onClick={() => setView('LIVE')}>LIVE STATUS</button>
          <button className={view === 'HISTORY' ? 'active' : ''} onClick={() => setView('HISTORY')}>LEDGER</button>
        </div>
        <div className="diag-sidebar-bottom">
          <div className="panel-tag">SYS_HEALTH</div>
          <div className="diag-row"><span>DATE:</span> <span className="txt-cyan">{today}</span></div>
          <div className="diag-row"><span>STATUS:</span> <span className="txt-green">ENCRYPTED</span></div>
          <div className="diag-row"><span>SESSION:</span> <span className="txt-gold">ACTIVE</span></div>
          <button className="logout-mini-btn" onClick={onLogout}>LOGOUT SESSION</button>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="content-area">
        {view === 'LIVE' && (
          <div className="view-wrapper animate-in">
            <div className="metrics-grid">
              <div className="m-card border-cyan"><span className="m-label txt-cyan">TOTAL_CARTS</span><h2 className="txt-cyan">25</h2></div>
              <div className="m-card border-purple"><span className="m-label txt-purple">LIVE_CARTS</span><h2 className="txt-purple">15</h2></div>
              <div className="m-card border-blue"><span className="m-label txt-blue">OCCUPANCY</span><h2 className="txt-blue">74%</h2></div>
              <div className="m-card border-gold"><span className="m-label txt-gold">TODAY_SALES</span><h2 className="txt-gold">₹18,450</h2></div>
            </div>

            <div className="panel main-table-box">
              <div className="panel-tag">ACTIVE_SESSIONS (15)</div>
              <div className="table-container pro-scroll">
                <table className="pro-table">
                  <thead>
                    <tr><th>ID</th><th>USER</th><th>STATUS</th><th>WEIGHT</th><th>RISK_LEVEL</th><th>ACTION</th></tr>
                  </thead>
                  <tbody>
                    {activeCarts.map(c => (
                      <tr key={c.id}>
                        <td className="txt-cyan font-orbitron">{c.id}</td>
                        <td>{c.user}</td>
                        <td><span className={c.status === 'PAID' ? 'tag-paid' : 'tag-unpaid'}>{c.status}</span></td>
                        <td>{c.exitWeight}g</td>
                        <td>
                          <div className="risk-heatmap">
                             <div className="heat-bar" style={{width: `${c.risk}%`, background: c.risk > 70 ? '#ff3e3e' : '#00f7ff'}}></div>
                          </div>
                        </td>
                        <td>
                          {verifiedCarts.includes(c.id) ? (
                            <span className="verified-stamp">VERIFIED ✓</span>
                          ) : (
                            <button className="pro-verify-btn" onClick={() => {setSelectedCart(c); setView('VERIFY');}}>VERIFY</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {view === 'VERIFY' && (
          <div className="verify-screen animate-in">
            <div className="verify-box">
              <div className="panel-tag">GATE_VERIFICATION: {selectedCart?.id}</div>
              <div className="verify-body">
                <div className="v-header">
                  <div className="v-header-item">
                    <span>PAYMENT WEIGHT:</span>
                    <b className="txt-cyan">{selectedCart?.paymentWeight}g</b>
                  </div>
                  <div className="v-header-item right">
                    <span>EXIT SENSE:</span>
                    <b className={selectedCart?.paymentWeight === selectedCart?.exitWeight ? "txt-green" : "txt-red"}>
                      {selectedCart?.exitWeight}g
                    </b>
                  </div>
                </div>

                <div className="receipt-content">
                  <div className="rc-line"><span>UNIT USER:</span> <span>{selectedCart?.user}</span></div>
                  <div className="rc-line status-row">
                    <span>PAYMENT STATUS:</span> 
                    <span className={selectedCart?.status === 'PAID' ? 'txt-green glow' : 'txt-red glow'}>
                        {selectedCart?.status}
                    </span>
                  </div>
                  <div className="v-divider"></div>
                  <div className="rc-grid-header"><span>ITEM</span><span>WT</span><span>PRICE</span></div>
                  {selectedCart?.items.map((item, idx) => (
                    <div className="rc-grid-row" key={idx}>
                      <span>{item.n}</span><span>{item.w}</span><span>₹{item.p}</span>
                    </div>
                  ))}
                  <div className="v-divider"></div>
                  <div className="rc-line total"><span>GRAND TOTAL:</span> <span className="txt-cyan">₹{selectedCart?.total}</span></div>
                </div>

                {selectedCart?.status === 'PAID' ? (
                  <button className="auth-action-glow" onClick={() => handleAuthorize(selectedCart.id)}>
                    AUTHORIZE EXIT & VERIFY
                  </button>
                ) : (
                  <div className="auth-action-alert-red">
                    <div className="alert-shimmer"></div>
                    PAYMENT REQUIRED
                  </div>
                )}
                <span className="close-text-btn" onClick={() => setView('LIVE')}>CANCEL MONITOR</span>
              </div>
            </div>
          </div>
        )}

        {view === 'HISTORY' && (
          <div className="ledger-page animate-in">
            <div className="panel-tag">TRANSACTION_LEDGER_ARCHIVE</div>
            <div className="ledger-container pro-scroll">
              <table className="pro-table">
                <thead>
                  <tr><th>TIMESTAMP</th><th>UNIT_ID</th><th>CUSTOMER</th><th>VALUATION</th><th>SECURITY</th></tr>
                </thead>
                <tbody>
                  {activeCarts.map((c, i) => (
                    <tr key={i}>
                      <td className="txt-dim">19:{20 + i}:56</td>
                      <td className="txt-cyan font-orbitron">{c.id}</td>
                      <td>{c.user}</td>
                      <td>₹{c.total}</td>
                      <td><span className="txt-green">SECURE</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;