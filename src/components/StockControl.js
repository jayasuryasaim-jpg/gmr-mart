import React from 'react';

const StockControl = () => (
  <div className="panel">
    <h3>🔄 STOCK CONTROL PANEL</h3>
    <label>Select Product</label>
    <select><option>Milk</option><option>Rice</option></select>
    <label>Add Stock</label>
    <input type="number" placeholder="+ Add" />
    <label>Reduce Stock</label>
    <input type="number" placeholder="- Reduce" />
    <label>Reason</label>
    <select>
      <option>Supplier Delivery</option>
      <option>Damaged Items</option>
      <option>Customer Returns</option>
    </select>
    <button className="primary-btn" style={{marginTop:'10px'}}>UPDATE STOCK</button>
  </div>
);
export default StockControl;