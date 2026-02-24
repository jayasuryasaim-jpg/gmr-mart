import { useNavigate } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();
  const cartId = localStorage.getItem("cartId");

  const handlePayment = async () => {
    await fetch("http://localhost:5000/clear-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ cartId })
    });

    alert("Payment Successful ✅");

    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", padding: "50px", color: "white", background:"#000814", minHeight:"100vh" }}>
      <h1>Payment Page</h1>
      <h2>Cart ID: {cartId}</h2>

      <button 
        onClick={handlePayment}
        style={{
          padding:"15px 30px",
          background:"#00ff88",
          border:"none",
          borderRadius:"8px",
          fontSize:"18px",
          cursor:"pointer"
        }}
      >
        Pay Now
      </button>
    </div>
  );
}

export default Payment;