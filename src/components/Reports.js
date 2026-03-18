import React from 'react';

const Reports = () => (
  <div className="panel">
    <h3>📊 INVENTORY REPORTS</h3>
    <div className="report-list">
      <button>Daily Stock Report</button>
      <button>Weekly Inventory Report</button>
      <button>Monthly Inventory Summary</button>
      <button>Most Sold Products</button>
      <button>Least Sold Products</button>
    </div>
    <button className="primary-btn" style={{marginTop:'15px'}}>Download PDF Report</button>
  </div>
);
export default Reports;