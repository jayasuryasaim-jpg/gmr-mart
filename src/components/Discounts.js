import React from "react";
import { useNavigate } from "react-router-dom";
import "./Discounts.css";

const allProducts = [
  // FASHION DISCOUNTS
  { name: "Men T-Shirt", floor: "Fashion", price: 699, discount: 10, img: "/assets/products/fashion/mens-tshirt.jpg", row: "M1" },
  { name: "Men Shirt", floor: "Fashion", price: 999, discount: 5, img: "/assets/products/fashion/mens-shirt.jpg", row: "M3" },
  { name: "Men Shoes", floor: "Fashion", price: 1999, discount: 15, img: "/assets/products/fashion/mens-shoes.jpg", row: "M4" },
  { name: "Kurti", floor: "Fashion", price: 899, discount: 20, img: "/assets/products/fashion/kurti.jpg", row: "W1" },
  { name: "Saree", floor: "Fashion", price: 2499, discount: 10, img: "/assets/products/fashion/saree.jpg", row: "W3" },
  { name: "Heels", floor: "Fashion", price: 1299, discount: 5, img: "/assets/products/fashion/heels.jpg", row: "W5" },
  { name: "Kids Frock", floor: "Fashion", price: 799, discount: 10, img: "/assets/products/fashion/kids-frock.jpg", row: "K2" },

  // GROCERY DISCOUNTS
  { name: "Dairy Milk", floor: "Grocery", price: 40, discount: 5, img: "/assets/products/food/dairy-milk.jpg", row: "A1" },
  { name: "Snickers", floor: "Grocery", price: 50, discount: 10, img: "/assets/products/food/snickers.jpg", row: "A5" },
  { name: "Silk", floor: "Grocery", price: 90, discount: 5, img: "/assets/products/food/silk.jpg", row: "A7" },
  { name: "Red Bull", floor: "Grocery", price: 110, discount: 5, img: "/assets/products/food/redbull.jpg", row: "B4" },
  { name: "Rice", floor: "Grocery", price: 1200, discount: 10, img: "/assets/products/food/rice.jpg", row: "C1" },
  { name: "Dal", floor: "Grocery", price: 150, discount: 5, img: "/assets/products/food/dal.jpg", row: "C5" },

  // HOME DISCOUNTS
  { name: "Pan", floor: "Home", price: 799, discount: 10, img: "/assets/products/home/pan.jpg", row: "H1" },
  { name: "Mixer", floor: "Home", price: 2999, discount: 5, img: "/assets/products/home/mixer.jpg", row: "H2" },
  { name: "Pressure Cooker", floor: "Home", price: 1999, discount: 10, img: "/assets/products/home/pressure-cooker.jpg", row: "H5" },
  { name: "Lamp", floor: "Home", price: 1499, discount: 15, img: "/assets/products/home/lamp.jpg", row: "L4" },
  { name: "Lego", floor: "Home", price: 1999, discount: 5, img: "/assets/products/home/lego.jpg", row: "T1" }
];

function Discounts() {
  const navigate = useNavigate();

  // FILTER: Only show products that have a discount
  const hotDeals = allProducts.filter(item => item.discount > 0);

  return (
    <div className="discounts-container">
      <div className="header-actions">
        <button className="back-btn" onClick={() => navigate("/floors")}>← Back to Mall</button>
        <h1 className="discount-title">🔥 Daily Hot Deals</h1>
      </div>

      <div className="discount-grid">
        {hotDeals.map((item, index) => {
          const discountAmt = (item.price * item.discount) / 100;
          const finalPrice = item.price - discountAmt;

          return (
            <div className="deal-card" key={index}>
              <div className="discount-tag">{item.discount}% OFF</div>
              <img src={item.img} alt={item.name} />
              
              <div className="deal-details">
                <h3>{item.name}</h3>
                <p className="floor-label">📍 {item.floor} Floor (Row: {item.row})</p>
                
                <div className="price-tag">
                  <span className="original-price">₹{item.price}</span>
                  <span className="deal-price">₹{finalPrice.toFixed(0)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="buddy-corner">
        <div className="speech-cloud">Namaste! These are the best prices today!</div>
        <img src="/assets/guide/gmr-smart-buddy.png" alt="Buddy" className="buddy-icon" />
      </div>
    </div>
  );
}

export default Discounts;