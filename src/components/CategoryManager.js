import React from 'react';

const CategoryManager = () => (
  <div className="data-panel">
    <h3>📂 PRODUCT CATEGORIES</h3>
    <table className="mart-table">
      <thead><tr><th>Category Name</th><th>Total Products</th><th>Actions</th></tr></thead>
      <tbody>
        <tr><td>Grocery</td><td>120</td><td><button>Edit</button> <button>Delete</button></td></tr>
        <tr><td>Dairy</td><td>80</td><td><button>Edit</button> <button>Delete</button></td></tr>
      </tbody>
    </table>
    <button className="primary-btn" style={{marginTop: '20px'}}>+ Add Category</button>
  </div>
);
export default CategoryManager;