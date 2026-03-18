import React from 'react';
import '../Admin.css';

const InventoryDashboard = () => (
  <div className="admin-root">
    {/* 1. Overview Cards */}
    <div className="dashboard-header">
      <div className="header-box">Total Products: <h2>540</h2></div>
      <div className="header-box">In Stock: <h2>480</h2></div>
      <div className="header-box">Low Stock: <h2>35</h2></div>
      <div className="header-box">Out Stock: <h2>25</h2></div>
    </div>

    <div className="erp-grid">
      {/* LEFT COLUMN: Main Inventory */}
      <div className="main-col">
        <div className="data-panel">
          <input placeholder="🔍 Search Products..." />
          <button className="primary-btn">+ Add New Product</button>
          <table className="mart-table">
            <thead><tr><th>Product</th><th>Category</th><th>Stock</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Milk</td><td>Dairy</td><td>120 L</td><td><span style={{color: 'var(--cyan)'}}>Available</span></td></tr>
            </tbody>
          </table>
        </div>
        
        {/* AI & Reports */}
        <div className="data-panel">
          <h3>🤖 AI Inventory Suggestions</h3>
          <p>Milk stock running low. Recommended restock: 50 units.</p>
        </div>
      </div>

      {/* RIGHT COLUMN: Stock Control */}
      <div className="side-col">
        <div className="data-panel">
          <h3>🔄 Stock Control</h3>
          <select style={{width: '100%', padding: '10px'}}><option>Select Product...</option></select>
          <button className="primary-btn" style={{width: '100%', marginTop: '10px'}}>UPDATE STOCK</button>
        </div>
        <div className="data-panel">
          <h3>⚠ Low Stock Alerts</h3>
          <ul><li>Rice: 5 Kg</li><li>Eggs: 12 Units</li></ul>
        </div>
      </div>
    </div>
  </div>
);

export default InventoryDashboard;