import React from "react";

function ProductCard({ product, addToCart }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />

      <h3>{product.name}</h3>
      <p>Brand: {product.brand}</p>
      <p>₹{product.price}</p>

      <p className={product.discount ? "discount-yes" : "discount-no"}>
        {product.discount ? "Discount Available" : "No Discount"}
      </p>

      <p>Manufacture: {product.manufacture}</p>
      <p>Expiry: {product.expiry}</p>

      {(product.category === "Chocolate" ||
        product.category === "Drink") && (
        <button onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      )}
    </div>
  );
}

export default ProductCard;