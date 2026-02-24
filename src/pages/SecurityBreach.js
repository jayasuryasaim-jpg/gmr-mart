import React from 'react';
// Changed import to Login.css since it is already in your pages folder
import './Login.css'; 

const SecurityBreach = () => {
  return (
    <div className="login-master" style={{ backgroundColor: '#1a0000', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="bg-scanline"></div>
      <div className="login-frame" style={{ border: '2px solid #ff3e3e', boxShadow: '0 0 20px #ff3e3e' }}>
        <h1 className="terminal-text" style={{ color: '#ff3e3e', textAlign: 'center', textShadow: '0 0 10px #ff3e3e' }}>
          ⚠️ SECURITY BREACH
        </h1>
        <div className="input-bar" style={{ backgroundColor: '#ff3e3e', height: '2px', margin: '20px 0' }}></div>
        
        <p className="auth-subtitle" style={{ color: '#ff7070', textAlign: 'center', marginBottom: '20px' }}>
          UNAUTHORIZED TERMINAL ACCESS DETECTED.
        </p>

        <div className="error-terminal" style={{ color: '#fff', fontSize: '0.9rem', lineHeight: '2' }}>
          <div><span className="txt-red">▶</span> TRACE_STATUS: <span className="txt-white">UPLINK_ESTABLISHED</span></div>
          <div><span className="txt-red">▶</span> IP_LOGGED: <span className="txt-white">157.50.157.187 (REPORTED)</span></div>
          <div><span className="txt-red">▶</span> ACTION: <span className="txt-white">PENDING_REPORT_TO_ISP</span></div>
        </div>

        <div className="auth-submit-btn" style={{ marginTop: '30px', backgroundColor: 'rgba(255, 62, 62, 0.2)', border: '1px solid #ff3e3e', color: '#ff3e3e', textAlign: 'center', cursor: 'default' }}>
          SYSTEM LOCKDOWN ACTIVE
        </div>
        
        <p className="security-tag" style={{ marginTop: '20px', textAlign: 'center', width: '100%' }}>
          ID_REF: {Math.random().toString(36).toUpperCase().substring(2, 12)}
        </p>
      </div>
    </div>
  );
};

export default SecurityBreach;