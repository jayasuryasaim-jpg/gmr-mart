import React, { useState } from 'react';
import './Admin.css';

// Importing sub-components for clean code
import InventoryDashboard from './components/InventoryDashboard';
import ProductList from './components/ProductList';
import CategoryManager from './components/CategoryManager';
import StockControl from './components/StockControl';
import Reports from './components/Reports';

const AdminDashboard = ({ onLogout }) => {
  const [view, setView] = useState('DASHBOARD');

  return (
    <div className="admin-root">
      {/* Top Header */}
      <header className="top-header">
        <div className="logo">GMR MART</div>
        <nav className="top-menu">
          <button onClick={() => setView('DASHBOARD')}>Dashboard</button>
          <button onClick={() => setView('PRODUCTS')}>Products</button>
          <button onClick={() => setView('CATEGORIES')}>Categories</button>
          <button onClick={() => setView('STOCK')}>Stock Control</button>
          <button onClick={() => setView('REPORTS')}>Reports</button>
        </nav>
        <div className="user-info">Inventory Manager | 🟢 Online</div>
      </header>

      <main className="view-container">
        {view === 'DASHBOARD' && <InventoryDashboard />}
        {view === 'PRODUCTS' && <ProductList />}
        {view === 'CATEGORIES' && <CategoryManager />}
        {view === 'STOCK' && <StockControl />}
        {view === 'REPORTS' && <Reports />}
      </main>
    </div>
  );
};

export default AdminDashboard;