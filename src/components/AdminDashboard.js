import React, { useState, useMemo, useEffect } from 'react';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import './Admin.css';

const AdminDashboard = ({ onLogout }) => {
  const [view, setView] = useState('LIVE');
  const [filterDate, setFilterDate] = useState('');
  const [selectedCart, setSelectedCart] = useState(null);

  // --- LOGOUT HANDLER ---
  const handleLogoutClick = (e) => {
    e.preventDefault();
    if (onLogout) {
      onLogout(); // This must trigger the state change in your App.js
    }
  };

  const productLibrary = [
    { name: 'Basmati Rice', weight: '5000g', price: 850 },
    { name: 'Coca Cola 2.5L', weight: '2750g', price: 45 },
    { name: 'Tata Tea 1kg', weight: '1000g', price: 399 },
    { name: 'Organic Honey', weight: '500g', price: 250 },
    { name: 'Almonds 250g', weight: '250g', price: 300 },
    { name: 'Olive Oil', weight: '1000g', price: 900 }
  ];

  const customerNames = ["Arjun Varma", "Sriya Reddy", "Karthik Rao", "Ananya Singh", "Rohan Das", "Priya Mehra", "Vikram Malhotra", "Sneha Kapoor", "Deepak Jha", "Ishita Pal", "Rahul Roy", "Megha Gupta"];

  const [transactions, setTransactions] = useState(() => 
    Array.from({ length: 12 }, (_, i) => {
      const items = [productLibrary[i % 6], productLibrary[(i + 2) % 6]];
      const totalWeight = items.reduce((acc, it) => acc + parseInt(it.weight), 0) + "g";
      const totalPrice = items.reduce((acc, it) => acc + it.price, 0);

      return {
        id: i + 1,
        cartNumber: `CART-${1000 + i}`,
        customerId: `GMR-C${101 + i}`,
        customerName: customerNames[i],
        isPaid: i % 4 !== 0,
        isVerified: false,
        items,
        totalWeight,
        totalPrice,
        aiCameraStatus: 'NO_THEFT_DETECTED'
      };
    })
  );

  const stats = useMemo(() => {
    const totalSales = transactions.reduce((acc, t) => acc + (t.isPaid ? t.totalPrice : 0), 0);
    const paidCount = transactions.filter(t => t.isPaid).length;
    const pendingCount = transactions.filter(t => !t.isPaid).length;
    return [
      { l: 'TOTAL CUSTOMERS', v: '1,240', c: '#00f7ff' },
      { l: 'TOTAL CARTS', v: '50', c: '#bf00ff' },
      { l: 'ACTIVE CARTS', v: '12', c: '#00ff88' },
      { l: 'TOTAL SALES', v: `₹${(totalSales / 1000).toFixed(1)}k`, c: '#00f7ff' },
      { l: 'TOTAL BILLS', v: transactions.length.toString(), c: '#bf00ff' },
      { l: 'PAID', v: paidCount.toString(), c: '#00ff88' },
      { l: 'PENDING', v: pendingCount.toString(), c: '#ffaa00' },
      { l: 'OCCUPANCY', v: '24%', c: '#ffaa00' }
    ];
  }, [transactions]);

  const [history] = useState(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: 200 + i,
      customerId: `GMR-H${200 + i}`,
      name: customerNames[i % 12],
      date: i % 3 === 0 ? '2026-03-08' : '2026-03-09',
      products: 'Rice, Cola, Tea',
      weight: "6275g",
      total: 1294,
      status: 'COMPLETED'
    }))
  );

  const filteredHistory = useMemo(() => filterDate ? history.filter(h => h.date === filterDate) : history, [filterDate, history]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("MART_SENSE TRANSACTION HISTORY REPORT", 14, 15);
    autoTable(doc, {
      head: [['DATE', 'ID', 'NAME', 'PRODUCTS', 'WEIGHT', 'TOTAL', 'STATUS']],
      body: filteredHistory.map(h => [h.date, h.customerId, h.name, h.products, h.weight, `₹${h.total}`, h.status]),
    });
    doc.save(`History_Report.pdf`);
  };

  const authorizeExit = (id) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, isVerified: true } : t));
    setSelectedCart(null);
    setView('LIVE');
  };

  return (
    <div className="admin-root">
      {/* Header modified for Mobile Wrap */}
      <header className="page-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '10px 20px',
        flexWrap: 'wrap', // Allows items to drop to next line on small screens
        gap: '10px'
      }}>
        <div className="view-toggle" style={{ order: 1 }}>
          <button onClick={() => setView('LIVE')} className={`pro-btn ${view === 'LIVE' ? 'active' : ''}`}>LIVE_FEED</button>
          <button onClick={() => setView('HISTORY')} className={`pro-btn ${view === 'HISTORY' ? 'active' : ''}`}>HISTORY</button>
        </div>
        
        <h1 className="centered-title" style={{ 
            margin: 0, 
            fontSize: '1.2rem', 
            order: { mobile: 3, desktop: 2 },
            width: '100%', 
            textAlign: 'center' 
        }}>MART_SENSE DASHBOARD</h1>
        
        <div className="header-logout" style={{ order: 2 }}>
          <button className="btn-logout" onClick={handleLogoutClick} style={{ width: 'auto', padding: '8px 16px' }}>LOG OUT</button>
        </div>
      </header>

      {view === 'LIVE' ? (
        <>
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-box" style={{ borderBottom: `4px solid ${s.c}` }}>
                <span className="stat-label">{s.l}</span>
                <h2 className="stat-value">{s.v}</h2>
              </div>
            ))}
          </div>
          
          {/* Added responsive-table wrapper */}
          <div className="data-panel" style={{ overflowX: 'auto' }}>
            <table className="mart-table" style={{ minWidth: '800px' }}>
              <thead><tr><th>CART_NO</th><th>CUST_ID</th><th>NAME</th><th>PRODUCTS</th><th>STATUS</th><th>WEIGHT</th><th>TOTAL</th><th>ACTION</th></tr></thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id}>
                    <td><span className="txt-cyan">{t.cartNumber}</span></td>
                    <td>{t.customerId}</td>
                    <td>{t.customerName}</td>
                    <td className="txt-dim">{t.items.map(it => it.name).join(', ')}</td>
                    <td><span className={`pill ${t.isPaid ? 'paid' : 'unpaid'}`}>{t.isPaid ? 'PAID' : 'PENDING'}</span></td>
                    <td>{t.totalWeight}</td>
                    <td>₹{t.totalPrice}</td>
                    <td>{t.isVerified ? <span className="txt-verified">VERIFIED</span> : <button className="pro-btn" onClick={() => { setSelectedCart(t); setView('VERIFY'); }}>VERIFY</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="data-panel">
          <div className="filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <input type="date" className="pro-input" onChange={(e) => setFilterDate(e.target.value)} />
            <button className="pro-btn" onClick={() => setFilterDate('')}>RESET_FILTER</button>
            <button className="pro-btn export" onClick={exportPDF}>EXPORT_PDF</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="mart-table" style={{ minWidth: '800px' }}>
                <thead><tr><th>DATE</th><th>ID</th><th>NAME</th><th>PRODUCTS</th><th>WEIGHT</th><th>TOTAL</th><th>STATUS</th></tr></thead>
                <tbody>
                {filteredHistory.map(h => (
                    <tr key={h.id}><td>{h.date}</td><td>{h.customerId}</td><td>{h.name}</td><td>{h.products}</td><td>{h.weight}</td><td>₹{h.total}</td><td>{h.status}</td></tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Verification Overlay - Made scrollable for small screens */}
      {view === 'VERIFY' && selectedCart && (
        <div className="overlay" style={{ padding: '10px', overflowY: 'auto' }}>
          <div className="gate-sense-card" style={{ maxWidth: '100%', width: '100%' }}>
            <div className="gs-header" style={{ fontSize: '0.9rem' }}>GATE_SENSE_VERIFICATION: <span className="txt-cyan">{selectedCart.cartNumber}</span></div>
            <div className="status-indicator-row" style={{ flexDirection: 'column', gap: '5px' }}>
                <div className="indicator-box"><span>PAYMENT:</span><span className={selectedCart.isPaid ? 'txt-green' : 'txt-red'}>{selectedCart.isPaid ? 'CONFIRMED' : 'PENDING'}</span></div>
                <div className="indicator-box"><span>AI_CAMERA:</span><span className="txt-green">CLEAN</span></div>
            </div>
            
            <div className="gs-weight-row">
              <div className="gs-weight-box"><div className="box-label">SYS_WT</div><div className="box-value">{selectedCart.totalWeight}</div></div>
              <div className="gs-weight-box"><div className="box-label">GATE_WT</div><div className="box-value">{selectedCart.totalWeight}</div></div>
            </div>

            <div className="gs-billing-table-container" style={{ overflowX: 'auto' }}>
              <table className="gs-billing-table">
                <thead><tr><th>PRODUCT</th><th>WT</th><th>PRICE</th></tr></thead>
                <tbody>
                  {selectedCart.items.map((item, idx) => (<tr key={idx}><td>{item.name}</td><td>{item.weight}</td><td>₹{item.price}</td></tr>))}
                  <tr className="gs-total-row"><td className="total-label">TOTAL</td><td className="txt-cyan">{selectedCart.totalWeight}</td><td className="total-value txt-cyan">₹{selectedCart.totalPrice}</td></tr>
                </tbody>
              </table>
            </div>
            {selectedCart.isPaid ? <button className="gs-btn-authorize" onClick={() => authorizeExit(selectedCart.id)}>AUTHORIZE_EXIT</button> : <div className="gs-warning-msg">LOCKED: UNPAID</div>}
            <div className="gs-abort-container"><span className="gs-abort-text" onClick={() => setView('LIVE')}>ABORT_SENSE</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;