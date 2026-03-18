import React from 'react';

const ProductList = () => (
  <div className="panel">
    <div className="filter-bar">
      <input type="text" placeholder="🔍 Search Product..." />
      <select><option>All Categories</option></select>
      <button className="primary-btn">Apply Filters</button>
    </div>
    <table className="mart-table">
      <thead>
        <tr><th>Image</th><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th>Actions</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>🥛</td><td>PRD102</td><td>Milk</td><td>Dairy</td><td>₹50</td>
          <td><span className="pill">🟢 Available</span></td>
          <td><button>Generate QR</button> <button>Edit</button></td>
        </tr>
      </tbody>
    </table>
  </div>
);
export default ProductList;