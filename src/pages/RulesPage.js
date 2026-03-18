import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RulesPage() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleScroll = (e) => {
    // Detect if user has scrolled to the bottom
    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50;
    if (bottom) setHasScrolled(true);
  };

  return (
    <div style={{ padding: '20px', background: '#0f172a', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ color: '#22d3ee', marginBottom: '20px' }}>GMR MART: Smart Cart Policies</h1>
      
      <div 
        onScroll={handleScroll} 
        style={{ height: '350px', width: '90%', maxWidth: '600px', overflowY: 'scroll', background: '#1e293b', padding: '20px', borderRadius: '10px', border: '1px solid #334155' }}
      >
        <ol style={{ lineHeight: '1.8', textAlign: 'left' }}>
          <li><strong>Activation:</strong> Scan QR code to initiate session.</li>
          <li><strong>Responsibility:</strong> You are responsible for all items in the cart.</li>
          <li><strong>Scanning:</strong> Every item must be scanned before placement.</li>
          <li><strong>Inventory Accuracy:</strong> Digital cart must match physical contents.</li>
          <li><strong>Removal:</strong> Remove items from digital cart if returned to shelves.</li>
          <li><strong>Anti-Misuse:</strong> No bypassing, tampering, or manipulating sensors.</li>
          <li><strong>Hardware Protection:</strong> Do not block cameras or disconnect components.</li>
          <li><strong>Security Monitoring:</strong> Session is monitored by AI retail systems.</li>
          <li><strong>Network:</strong> Functionality depends on store Wi-Fi connectivity.</li>
          <li><strong>Verification:</strong> Review digital summary before final checkout.</li>
          <li><strong>Payment:</strong> Full payment required before exiting the store.</li>
          <li><strong>Handling:</strong> Handle merchandise with care.</li>
          <li><strong>Session Control:</strong> One session per scan; auto-terminates after checkout.</li>
          <li><strong>Privacy:</strong> We collect limited operational data for security.</li>
          <li><strong>Technical Support:</strong> Notify staff immediately of any system issues.</li>
          <li><strong>Deactivation:</strong> We reserve the right to deactivate for policy violations.</li>
          <li><strong>Store Compliance:</strong> Follow all GMR Mart staff instructions.</li>
          <li><strong>Final Agreement:</strong> By accepting, you assume full liability for the cart.</li>
        </ol>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: hasScrolled ? 'pointer' : 'not-allowed' }}>
          <input 
            type="checkbox" 
            disabled={!hasScrolled} 
            onChange={(e) => setAgreed(e.target.checked)} 
            style={{ transform: 'scale(1.5)' }}
          />
          I have read and agree to the GMR Mart Smart Cart Rules & Policies
        </label>
      </div>

      <button 
        disabled={!agreed} 
        onClick={() => { 
          localStorage.setItem("rules_accepted", "true"); 
          navigate("/control-cart"); 
        }} 
        style={{ 
          width: '90%', maxWidth: '400px', padding: '15px', marginTop: '20px', 
          background: agreed ? '#22d3ee' : '#475569', 
          border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem',
          cursor: agreed ? 'pointer' : 'not-allowed', color: '#0f172a'
        }}
      >
        ACCEPT & CONTINUE
      </button>
    </div>
  );
}