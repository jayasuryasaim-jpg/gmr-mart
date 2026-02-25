import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SecurityBreach from './SecurityBreach'; 
import './Login.css';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ user: '', pass: '' });
  const [error, setError] = useState('');
  const [resetAlert, setResetAlert] = useState(false);
  const [isBreached, setIsBreached] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [userIp, setUserIp] = useState(''); // To help you debug
  const navigate = useNavigate();

  // Load environment variables
  const ADMIN_ID = process.env.REACT_APP_ADMIN_ID;
  const ADMIN_PASS = process.env.REACT_APP_ADMIN_PASS;
  const ALLOWED_IP_STRING = process.env.REACT_APP_ALLOWED_IP;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsChecking(true);

    // 1. INITIAL VALIDATION
    if (!ADMIN_ID || !ADMIN_PASS || !ALLOWED_IP_STRING) {
      setError('CRITICAL: SYSTEM ENVIRONMENT NOT INITIALIZED');
      setIsChecking(false);
      return;
    }

    try {
      // 2. IP VALIDATION: Fetching current visitor IP
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setUserIp(data.ip);
      
      // Support for multiple IPs (Comma separated in Vercel)
      const allowedIps = ALLOWED_IP_STRING.split(',').map(ip => ip.trim());
      
      if (!allowedIps.includes(data.ip)) {
        setIsBreached(true); // Trigger the Security Breach Screen
        return;
      }

      // 3. CREDENTIAL VALIDATION
      if (credentials.user === ADMIN_ID && credentials.pass === ADMIN_PASS) {
        setError('');
        onLogin(); 
        navigate('/admin-terminal');
      } else {
        setError('ACCESS DENIED: IDENTITY UNVERIFIED');
      }
    } catch (err) {
      setError('FIREWALL ERROR: UNABLE TO VERIFY LOCATION');
    } finally {
      setIsChecking(false);
    }
  };

  const triggerEmergencyReset = () => {
    setResetAlert(true);
    setTimeout(() => setResetAlert(false), 5000);
  };

  if (isBreached) return <SecurityBreach />;

  return (
    <div className="login-master">
      <div className="bg-scanline"></div>
      
      {resetAlert && (
        <div className="security-threat-overlay">
          <div className="alert-content">
            <div className="alert-icon">⚠️</div>
            <h3>PROTOCOL 404 ACTIVATED</h3>
            <p>SURVEILLANCE ENGAGED. TRACING TERMINAL IP: {userIp}</p>
          </div>
        </div>
      )}

      <div className="login-frame">
        <div className="auth-header">
          <div className="security-ring"></div>
          <div className="lock-symbol">🔒</div>
        </div>

        <h2 className="terminal-text">GMR <span className="cyan-txt">SECURE-LINK</span></h2>
        <p className="auth-subtitle">ENCRYPTED ADMINISTRATOR PORTAL</p>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="cyber-input-group">
            <input 
              type="text" 
              required 
              autoComplete="off"
              placeholder=" "
              onChange={(e) => setCredentials({...credentials, user: e.target.value})}
            />
            <label>ADMIN_IDENTIFICATION</label>
            <div className="input-bar"></div>
          </div>
          
          <div className="cyber-input-group">
            <input 
              type="password" 
              required 
              placeholder=" "
              onChange={(e) => setCredentials({...credentials, pass: e.target.value})}
            />
            <label>SECURE_PASSCODE</label>
            <div className="input-bar"></div>
          </div>

          {error && (
            <div className="error-terminal">
              <span className="blink">▶</span> {error}
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={isChecking}>
            {isChecking ? "SHIELDING..." : "VERIFY IDENTITY"}
            <div className="btn-glitch"></div>
          </button>
        </form>
        
        <div className="terminal-footer-links">
          <span className="reset-trigger" onClick={triggerEmergencyReset}>
            FORGOT_PASS? [EMERGENCY_RESET]
          </span>
          <div className="security-tag">AES_256_ACTIVE // YOUR_IP: {userIp}</div>
        </div>
      </div>
    </div>
  );
};

export default Login;