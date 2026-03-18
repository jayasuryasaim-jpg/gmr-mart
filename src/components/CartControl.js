import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function CartControl() {
  const [cart, setCart] = useState([]);
  const [reminderList, setReminderList] = useState([]);
  const [summary, setSummary] = useState({ total: 0 });
  const [hasAccepted, setHasAccepted] = useState(localStorage.getItem("rules_accepted") === "true");
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const navigate = useNavigate();
  const ESP32_IP = "10.244.253.168"; 

  useEffect(() => {
    if (paymentSuccess) return;
    if (!localStorage.getItem("cart_unlocked")) navigate("/scan-cart");

    if (!hasAccepted) return;

    const interval = setInterval(async () => {
      try {
        // 1. Fetch live data from ESP32
        const res = await fetch(`http://${ESP32_IP}/getCart`);
        const data = await res.json();
        const itemsArray = Array.isArray(data.items) ? data.items : [];
        
        setCart(itemsArray);
        setSummary({ total: data.total || 0 });

        // 2. Logic: Move items from Reminder -> Billing Summary
        const savedReminders = JSON.parse(localStorage.getItem("gmr_reminder_queue") || "[]");
        
        // Filter: Keep only reminders that are NOT in the cart yet
        const pendingReminders = savedReminders.filter(reminder => {
          return !itemsArray.some(cartItem => 
            cartItem.name.trim().toLowerCase() === (reminder.name || "").trim().toLowerCase()
          );
        });

        setReminderList(pendingReminders);

        // 3. Update Firebase for remote monitoring
        await updateDoc(doc(db, "active_sessions", "CART-2006"), {
          items: itemsArray, 
          totalPrice: data.total || 0,
          timestamp: new Date().toISOString()
        });
      } catch (e) { 
        console.warn("Syncing with Trolley..."); 
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [hasAccepted, navigate, ESP32_IP, paymentSuccess]);

  const toggleFollowMode = async () => {
    try {
      const newStatus = !isFollowing;
      await fetch(`http://${ESP32_IP}/follow?status=${newStatus}`, { mode: 'no-cors' });
      setIsFollowing(newStatus);
    } catch (e) { 
      alert("Connection Error: Ensure you are on GMR_Mart_WiFi"); 
    }
  };

  const handlePayment = () => {
    localStorage.removeItem("cart_unlocked");
    localStorage.removeItem("rules_accepted");
    localStorage.removeItem("gmr_reminder_queue");
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
          onScroll={(e) => { const { scrollTop, scrollHeight, clientHeight } = e.target; if (scrollHeight - scrollTop <= clientHeight + 50) setHasScrolled(true); }} 
          style={{ flex: 1, overflowY: 'auto', padding: '25px', background: '#1e293b', lineHeight: '1.8', maxHeight: '75vh' }}
        >
          <ol style={{ fontSize: '1.1rem', color: '#e2e8f0', paddingLeft: '25px', margin: 0 }}>
            <li style={{ marginBottom: '15px' }}>1. Activation: Scan QR code to initiate session.</li>
            <li style={{ marginBottom: '15px' }}>2. Responsibility: You are responsible for all items in the cart.</li>
            <li style={{ marginBottom: '15px' }}>3. Scanning: Every item must be scanned before placement.</li>
            <li style={{ marginBottom: '15px' }}>4. Inventory Accuracy: Digital cart must match physical contents.</li>
            <li style={{ marginBottom: '15px' }}>5. Removal: Remove items from digital cart if returned to shelves.</li>
            <li style={{ marginBottom: '15px' }}>6. Anti-Misuse: No bypassing, tampering, or manipulating sensors.</li>
            <li style={{ marginBottom: '15px' }}>7. Hardware Protection: Do not block cameras or disconnect components.</li>
            <li style={{ marginBottom: '15px' }}>8. Security Monitoring: Session is monitored by AI retail systems.</li>
            <li style={{ marginBottom: '15px' }}>9. Network: Functionality depends on store Wi-Fi connectivity.</li>
            <li style={{ marginBottom: '15px' }}>10. Verification: Review digital summary before final checkout.</li>
            <li style={{ marginBottom: '15px' }}>11. Payment: Full payment required before exiting the store.</li>
            <li style={{ marginBottom: '15px' }}>12. Handling: Handle merchandise with care.</li>
            <li style={{ marginBottom: '15px' }}>13. Session Control: One session per scan; auto-terminates after checkout.</li>
            <li style={{ marginBottom: '15px' }}>14. Privacy: We collect limited operational data for security.</li>
            <li style={{ marginBottom: '15px' }}>15. Technical Support: Notify staff immediately of any system issues.</li>
            <li style={{ marginBottom: '15px' }}>16. Deactivation: We reserve the right to deactivate for policy violations.</li>
            <li style={{ marginBottom: '15px' }}>17. Store Compliance: Follow all GMR Mart staff instructions.</li>
            <li style={{ marginBottom: '15px' }}>18. Final Agreement: By accepting, you assume full liability for the cart.</li>
          </ol>
          {!hasScrolled && <div style={{ textAlign: 'center', color: '#22d3ee', marginTop: '10px' }}>▼ SCROLL TO SEE ALL RULES ▼</div>}
        </div>
        <div style={{ padding: '20px', background: '#0f172a', borderTop: '1px solid #334155', textAlign: 'center' }}>
          <button disabled={!hasScrolled} onClick={() => { localStorage.setItem("rules_accepted", "true"); setHasAccepted(true); }} style={{ width: '100%', padding: '20px', background: hasScrolled ? '#22d3ee' : '#475569', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.2rem', color: '#0f172a', transition: '0.3s ease' }}>
            {hasScrolled ? "I ACCEPT & START SHOPPING" : "SCROLL DOWN TO ACCEPT"}
          </button>
        </div>
      </div>
    );
  }

  // --- PAYMENT SUCCESS VIEW ---
  if (paymentSuccess) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff', textAlign: 'center', padding: '20px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
        <h1 style={{ color: '#22d3ee' }}>PAYMENT SUCCESSFUL</h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>Thank you for shopping in the GMR SMART MART!</p>
        <button onClick={() => navigate('/')} style={{ marginTop: '30px', padding: '15px 40px', borderRadius: '8px', border: 'none', background: '#22d3ee', fontWeight: 'bold', color: '#0f172a' }}>
          RETURN TO HOME
        </button>
      </div>
    );
  }

  // --- MAIN CART VIEW ---
  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', padding: '20px', color: '#fff', paddingBottom: '180px' }}>
      <header style={{ borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
        <h2 style={{ color: '#22d3ee', margin: 0, fontSize: '1.3rem' }}>LIVE TROLLEY: CART-2006</h2>
      </header>

      <button onClick={toggleFollowMode} style={{ width: '100%', padding: '18px', marginTop: '20px', background: isFollowing ? '#ef4444' : '#10b981', border: 'none', borderRadius: '12px', fontWeight: 'bold', color: '#fff' }}>
        {isFollowing ? "STOP FOLLOWING ⏹️" : "FOLLOW ME 🤖"}
      </button>

      {/* --- SECTION: SHOPPING REMINDERS (PENDING ITEMS) --- */}
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ fontSize: '0.8rem', color: '#94a3b8', letterSpacing: '1.5px', marginBottom: '15px' }}>
           {reminderList.length > 0 ? "STILL TO SCAN" : "SHOPPING LIST COMPLETE ✅"}
        </h3>
        {reminderList.length > 0 ? (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
            {reminderList.map((item, index) => (
              <div key={index} style={{ background: '#334155', padding: '10px 20px', borderRadius: '20px', whiteSpace: 'nowrap', fontSize: '0.9rem', border: '1px solid #475569', color: '#cbd5e1' }}>
                🔘 {item.name || "Item"}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 'bold' }}>All items from your list have been scanned!</p>
        )}
      </div>

      {/* --- SECTION: BILLING SUMMARY (SCANNED ITEMS) --- */}
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ fontSize: '0.9rem', color: '#22d3ee', letterSpacing: '1.5px', marginBottom: '15px' }}>BILLING SUMMARY</h3>
        {cart.length > 0 ? (
          cart.map((item, index) => (
            <div key={index} style={{ background: 'linear-gradient(90deg, #1e293b, #0f172a)', padding: '15px', borderRadius: '12px', marginBottom: '10px', borderLeft: '4px solid #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Weight: {item.weight}g | Qty: {item.quantity || 1}
                </div>
              </div>
              <div style={{ fontWeight: 'bold', color: '#10b981', fontSize: '1.1rem' }}>₹{item.price}</div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '30px', border: '2px dashed #334155', borderRadius: '15px', color: '#475569' }}>
            Trolley is empty. Scan items to begin billing.
          </div>
        )}
      </div>

      {/* --- FIXED FOOTER --- */}
      <div style={{ position: 'fixed', bottom: 20, left: 20, right: 20, background: '#064e3b', padding: '20px', borderRadius: '12px', border: '1px solid #10b981', zIndex: 100 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ color: '#a7f3d0' }}>TOTAL AMOUNT</span>
          <strong style={{ color: '#fff', fontSize: '1.2rem' }}>₹{summary.total}</strong>
        </div>
        <button onClick={handlePayment} style={{ width: '100%', padding: '18px', background: '#22d3ee', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '8px', fontSize: '1.1rem' }}>
          PROCEED TO PAY
        </button>
      </div>
    </div>
  );
}