import React from 'react';
import './Receipt.css';

const Receipt = ({ cartData, onHide }) => {
  const date = new Date().toLocaleString();

  return (
    <div className="receipt-overlay">
      <div className="receipt-paper">
        <div className="receipt-header">
          <h1>GMR SMART MART</h1>
          <p>Terminal: GATE-01 | Auth: ADMIN_01</p>
          <div className="divider"></div>
        </div>

        <div className="receipt-body">
          <div className="info-row"><span>Date:</span> <span>{date}</span></div>
          <div className="info-row"><span>Cart ID:</span> <span>{cartData.id}</span></div>
          <div className="info-row"><span>User:</span> <span>{cartData.user}</span></div>
          
          <table className="receipt-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Weight</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {/* This would normally map over actual cart items */}
              <tr><td>Amul Gold Milk</td><td>1030g</td><td>₹66</td></tr>
              <tr><td>Basmati Rice 5kg</td><td>5000g</td><td>₹850</td></tr>
              <tr><td>Napkin Pack</td><td>45g</td><td>₹150</td></tr>
            </tbody>
          </table>

          <div className="divider"></div>
          <div className="info-row total">
            <span>TOTAL WEIGHT:</span> <span>{cartData.sysWeight}g</span>
          </div>
          <div className="info-row total">
            <span>GRAND TOTAL:</span> <span>₹1,066</span>
          </div>
        </div>

        <div className="receipt-footer">
          <div className="barcode-sim">|| ||| || |||| ||| | ||</div>
          <p>GATE PASS VERIFIED - SAFE TO EXIT</p>
          <button className="print-btn" onClick={() => window.print()}>PRINT RECEIPT</button>
          <button className="close-btn" onClick={onHide}>CLOSE</button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;