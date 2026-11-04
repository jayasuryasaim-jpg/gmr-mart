import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CartControl() {
  const [hasAccepted, setHasAccepted] = useState(localStorage.getItem("rules_accepted") === "true");
  const [hasScrolled, setHasScrolled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("cart_unlocked")) navigate("/scan-cart");
  }, [navigate]);

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
            <li>Activation: Trolley activation is unavailable until the authenticated device service is configured.</li>
            <li>Responsibility: You are responsible for all items in the cart.</li>
            <li>Scanning: Every item must be scanned before placement.</li>
            <li>Inventory Accuracy: Digital cart must match physical contents.</li>
            <li>Removal: Remove items from digital cart if returned.</li>
            <li>Anti-Misuse: No bypassing or tampering.</li>
            <li>Hardware Protection: Do not block cameras.</li>
            <li>Security Monitoring: live AI/cart monitoring is unavailable in this demo.</li>
            <li>Network: Requires store Wi-Fi.</li>
            <li>Verification: Cart contents cannot be verified in this demo.</li>
            <li>Payment: payment processing is not configured; this demo cannot complete purchases.</li>
            <li>Handling: Handle products carefully.</li>
            <li>Session Control: No trolley session is activated by this demo.</li>
            <li>Privacy: no live sensor or occupancy data is collected by this demo.</li>
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

  // --- MAIN UI ---
  return (
    <div style={{ background: '#f6f7f1', minHeight: '100vh', padding: '28px 5vw', color: '#24332a', paddingBottom: '180px' }}>
      <h2 style={{ color: '#226a45' }}>Your smart cart</h2>

      <p role="status" style={{ marginTop: '16px', padding: '12px', background: '#fffbeb', color: '#78350f', borderRadius: '8px' }}>
        Live cart data and trolley controls are unavailable because no authenticated device service is configured.
      </p>

      <button type="button" disabled style={{
        width: '100%',
        padding: '18px',
        marginTop: '20px',
        background: '#68766d',
        border: 'none',
        borderRadius: '12px',
        fontWeight: 'bold', color: '#fff', cursor: 'not-allowed'
      }}>
        Trolley controls unavailable
      </button>

      <div style={{ marginTop: '30px' }}>
        <h3>Cart items</h3>
        <p role="status">Unavailable: no live cart data is connected.</p>
      </div>

      <div style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        right: 20,
        background: '#226a45',
        padding: '20px',
        borderRadius: '12px'
      }}>
        <h3>Total: unavailable</h3>
        <p role="status" style={{ color: '#fff' }}>
          Payment is not configured. No charge has been made.
        </p>
        <button disabled style={{
          width: '100%',
          padding: '15px',
          background: '#fff', color: '#174b31',
          border: 'none',
          borderRadius: '8px',
          opacity: 0.65,
          cursor: 'not-allowed'
        }}>
          Checkout unavailable
        </button>
      </div>
    </div>
  );
}
