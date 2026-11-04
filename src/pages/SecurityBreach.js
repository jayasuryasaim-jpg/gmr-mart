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
          Demonstration screen only. This page does not detect, trace, or report security events.
        </p>

        <div className="error-terminal" style={{ color: '#fff', fontSize: '0.9rem', lineHeight: '2' }}>
          <div><span className="txt-red">▶</span> INCIDENT_STATUS: <span className="txt-white">NOT_VERIFIED</span></div>
          <div><span className="txt-red">▶</span> CLIENT_TRACE: <span className="txt-white">NOT_AVAILABLE</span></div>
          <div><span className="txt-red">▶</span> REPORTING: <span className="txt-white">NOT_CONFIGURED</span></div>
        </div>

        <div className="auth-submit-btn" style={{ marginTop: '30px', backgroundColor: 'rgba(255, 62, 62, 0.2)', border: '1px solid #ff3e3e', color: '#ff3e3e', textAlign: 'center', cursor: 'default' }}>
          NO LOCKDOWN HAS BEEN APPLIED
        </div>
      </div>
    </div>
  );
};

export default SecurityBreach;
