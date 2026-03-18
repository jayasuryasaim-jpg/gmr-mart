import React from 'react';

const DashboardOverview = () => (
  <div className="dashboard-content">
    <div className="stats-grid">
      <div className="panel">Total Products <h2>540</h2></div>
      <div className="panel">In Stock <h2>480</h2></div>
      <div className="panel">Low Stock <h2>35</h2></div>
      <div className="panel">Out Stock <h2>25</h2></div>
    </div>
    <div className="panel">
      <h3>🤖 AI INVENTORY SUGGESTIONS</h3>
      <p>Milk stock running low. Recommended restock: 50 units.</p>
      <p>Rice demand increased by 25% this week.</p>
      <button className="primary-btn">Auto Restock Recommendation</button>
    </div>
  </div>
);
export default DashboardOverview;