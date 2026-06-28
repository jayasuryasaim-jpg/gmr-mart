import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function CartControl() {
  const [cart, setCart] = useState([]);
  const [summary, setSummary] = useState({ total: 0 });
  const [hasAccepted, setHasAccepted] = useState(localStorage.getItem("rules_accepted") === "true");
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const navigate = useNavigate();
  const ESP32_IP = "10.244.253.168";

  // ✅ Memory to prevent vanish/flicker
  const lastDataRef = useRef({ items: [], total: 0 });

  useEffect(() => {
    if (paymentSuccess) return;
    if (!localStorage.getItem("cart_unlocked")) navigate("/scan-cart");
    if (!hasAccepted) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://${ESP32_IP}/getCart`);
        if (!res.ok) return;

        const data = await res.json();
        const itemsArray = Array.isArray(data.items) ? data.items : [];

        // ❌ Prevent empty overwrite (MAIN FIX)
        if (itemsArray.length === 0 && lastDataRef.current.items.length !== 0) {
          return;
        }

        // ❌ Prevent unnecessary re-render
        if (
          JSON.stringify(itemsArray) === JSON.stringify(lastDataRef.current.items) &&
          data.total === lastDataRef.current.total
        ) {
          return;
        }

        // ✅ Update UI
        setCart(itemsArray);
        setSummary({ total: data.total || 0 });

        // ✅ Store last data
        lastDataRef.current = {
          items: itemsArray,
          total: data.total || 0
        };

        // ✅ Firebase Sync
        await updateDoc(doc(db, "active_sessions", "CART-2006"), {
          items: itemsArray,
          totalPrice: data.total || 0,
          timestamp: new Date().toISOString()
        });

      } catch (e) {
        console.warn("ESP32 Syncing...");
      }
    }, 2000);

    return () => clearInterval(interval);

  }, [hasAccepted, navigate, ESP32_IP, paymentSuccess]);

  const toggleFollowMode = async () => {
    try {
      const newStatus = !isFollowing;
      await fetch(`http://${ESP32_IP}/follow?status=${newStatus}`, { mode: "no-cors" });
      setIsFollowing(newStatus);
    } catch (e) {
      alert("Connection Error: Ensure you are on GMR_Mart_WiFi");
    }
  };

  const handlePayment = () => {
    localStorage.removeItem("cart_unlocked");
    localStorage.removeItem("rules_accepted");
    setPaymentSuccess(true);
  };

  // --- RULES VIEW ---
  if (!hasAccepted) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, background: '#0f172a', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #334155', textAlign: 'center' }}>
          <h1 style={{ color: '#22d3ee', fontSize: '1.6rem', margin: 0 }}>GMR MART RULES</h1>
        </div>

        <div 
          onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.target;
            if (scrollHeight - scrollTop <= clientHeight + 50) setHasScrolled(true);
          }}
          style={{ flex: 1, overflowY: 'auto', padding: '25px', background: '#1e293b', lineHeight: '1.8', maxHeight: '75vh' }}
        >
          <ol style={{ fontSize: '1.1rem', color: '#e2e8f0', paddingLeft: '25px', margin: 0 }}>
            <li>Activation: Scan QR code to initiate session.</li>
            <li>Responsibility: You are responsible for all items in the cart.</li>
            <li>Scanning: Every item must be scanned before placement.</li>
            <li>Inventory Accuracy: Digital cart must match physical contents.</li>
            <li>Removal: Remove items from digital cart if returned.</li>
            <li>Anti-Misuse: No bypassing or tampering.</li>
            <li>Hardware Protection: Do not block cameras.</li>
            <li>Security Monitoring: AI monitoring enabled.</li>
            <li>Network: Requires store Wi-Fi.</li>
            <li>Verification: Review before checkout.</li>
            <li>Payment: Must complete before exit.</li>
            <li>Handling: Handle products carefully.</li>
            <li>Session Control: One session per scan.</li>
            <li>Privacy: Limited data collected.</li>
            <li>Support: Inform staff if issues.</li>
            <li>Deactivation: Violations may deactivate cart.</li>
            <li>Compliance: Follow staff instructions.</li>
            <li>Agreement: Accept full liability.</li>
          </ol>

          {!hasScrolled && (
            <div style={{ textAlign: 'center', color: '#22d3ee', marginTop: '10px' }}>
              ▼ SCROLL TO SEE ALL RULES ▼
            </div>
          )}
        </div>

        <div style={{ padding: '20px', background: '#0f172a', borderTop: '1px solid #334155' }}>
          <button
            disabled={!hasScrolled}
            onClick={() => {
              localStorage.setItem("rules_accepted", "true");
              setHasAccepted(true);
            }}
            style={{
              width: '100%',
              padding: '20px',
              background: hasScrolled ? '#22d3ee' : '#475569',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              color: '#0f172a'
            }}
          >
            {hasScrolled ? "I ACCEPT & START SHOPPING" : "SCROLL DOWN TO ACCEPT"}
          </button>
        </div>
      </div>
    );
  }

  // --- PAYMENT SUCCESS ---
  if (paymentSuccess) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', background: '#0f172a', color: '#fff' }}>
        <h1 style={{ color: '#22d3ee' }}>✅ PAYMENT SUCCESSFUL</h1>
        <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '15px 30px', background: '#22d3ee', border: 'none', borderRadius: '8px' }}>
          HOME
        </button>
      </div>
    );
  }

  // --- MAIN UI ---
  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', padding: '20px', color: '#fff', paddingBottom: '180px' }}>
      <h2 style={{ color: '#22d3ee' }}>LIVE TROLLEY: CART-2006</h2>

      <button onClick={toggleFollowMode} style={{
        width: '100%',
        padding: '18px',
        marginTop: '20px',
        background: isFollowing ? '#ef4444' : '#10b981',
        border: 'none',
        borderRadius: '12px',
        fontWeight: 'bold'
      }}>
        {isFollowing ? "STOP FOLLOWING ⏹️" : "FOLLOW ME 🤖"}
      </button>

      <div style={{ marginTop: '30px' }}>
        <h3>ITEMS ({cart.length})</h3>

        {cart.length > 0 ? cart.map((item, index) => (
          <div key={index} style={{
            padding: '15px',
            marginBottom: '10px',
            background: '#1e293b',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>{item.name}</span>
            <span>₹{item.price}</span>
          </div>
        )) : <p>Waiting for scan...</p>}
      </div>

      <div style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        right: 20,
        background: '#064e3b',
        padding: '20px',
        borderRadius: '12px'
      }}>
        <h3>Total: ₹{summary.total}</h3>
        <button onClick={handlePayment} style={{
          width: '100%',
          padding: '15px',
          background: '#22d3ee',
          border: 'none',
          borderRadius: '8px'
        }}>
          PAY NOW
        </button>
      </div>
    </div>
  );
}