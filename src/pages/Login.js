import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [view, setView] = useState('login'); // login, register, admin, forgot
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (view === 'admin') {
      if (formData.adminId === "GMR_ADMIN" && formData.pass === "GMR_2026") {
        onLogin({ type: 'admin', role: formData.role });
      } else {
        setError("▶ ACCESS_DENIED: UNAUTHORIZED_ID");
      }
    } else if (view === 'register') {
      if (formData.pass !== formData.confirmPass) return setError("▶ PASSWORDS_MISMATCH");
      localStorage.setItem('gmr_user', JSON.stringify(formData));
      alert("ACCOUNT CREATED: SYNCING DATA...");
      setView('login');
    } else if (view === 'forgot') {
      alert("▶ RECOVERY_SENT: CHECK YOUR EMAIL/MOBILE");
      setView('login');
    } else {
      const savedUser = JSON.parse(localStorage.getItem('gmr_user'));
      if (savedUser && formData.email === savedUser.email && formData.pass === savedUser.pass) {
        onLogin({ type: 'customer' });
      } else {
        setError("▶ IDENTITY_NOT_FOUND");
      }
    }
  };

  return (
    <div className="login-master">
      <div className="bg-scanline"></div>
      
      <div className={`login-frame ${view === 'register' ? 'wide-frame' : ''}`}>
        <div className="frame-corner top-left"></div>
        <div className="frame-corner bottom-right"></div>

        <h2 className="terminal-text">GMR <span className="cyan-txt">MART {view === 'admin' && 'ADMIN'}</span></h2>
        <p className="security-tag">
          {view === 'admin' ? "CORE_CONTROL_DASHBOARD_V4" : 
           view === 'register' ? "USER_ENROLLMENT_PROTOCOL" : 
           view === 'forgot' ? "SECURITY_RECOVERY_MODE" : "SECURE_RETAIL_ACCESS"}
        </p>

        <form onSubmit={handleSubmit} className="cyber-form">
          {view === 'admin' ? (
            <>
              <div className="cyber-input-group"><label>ADMIN_ID</label><input type="text" name="adminId" required onChange={handleChange} placeholder="ENTER_UID" /></div>
              <div className="cyber-input-group"><label>ROLE_AUTHORITY</label>
                <select name="role" required onChange={handleChange} className="cyber-select">
                  <option value="">SELECT_ROLE</option>
                  <option value="super">Super Admin</option>
                  <option value="inventory">Inventory Manager</option>
                  <option value="billing">Billing Manager</option>
                  <option value="support">Customer Support</option>
                  <option value="device">Smart Cart Manager</option>
                </select>
              </div>
            </>
          ) : view === 'register' ? (
            <div className="grid-inputs">
              <div className="cyber-input-group"><label>FULL_NAME</label><input type="text" name="name" required onChange={handleChange} /></div>
              <div className="cyber-input-group"><label>MOBILE</label><input type="text" name="mobile" required onChange={handleChange} /></div>
              <div className="cyber-input-group"><label>EMAIL</label><input type="email" name="email" required onChange={handleChange} /></div>
              <div className="cyber-input-group"><label>CITY</label><input type="text" name="city" required onChange={handleChange} /></div>
              <div className="cyber-input-group"><label>PINCODE</label><input type="text" name="pincode" required onChange={handleChange} /></div>
              <div className="cyber-input-group"><label>ADDRESS</label><input type="text" name="address" required onChange={handleChange} /></div>
              <div className="cyber-input-group"><label>PASSWORD</label><input type={showPass ? "text" : "password"} name="pass" required onChange={handleChange} /></div>
              <div className="cyber-input-group"><label>CONFIRM_PASS</label><input type="password" name="confirmPass" required onChange={handleChange} /></div>
            </div>
          ) : view === 'forgot' ? (
            <div className="cyber-input-group">
              <label>ENTER_EMAIL_OR_MOBILE</label>
              <input type="text" name="recovery" required onChange={handleChange} placeholder="IDENTITY_LINK" />
            </div>
          ) : (
            <div className="cyber-input-group"><label>EMAIL / MOBILE</label><input type="text" name="email" required onChange={handleChange} /></div>
          )}

          {view !== 'register' && (
            <div className="cyber-input-group pass-wrap">
              <label>PASSCODE</label>
              <div className="input-with-icon">
                <input type={showPass ? "text" : "password"} name="pass" required onChange={handleChange} />
                <span className="eye-icon" onClick={() => setShowPass(!showPass)}>{showPass ? '🔓' : '🔒'}</span>
              </div>
            </div>
          )}

          {error && <div className="error-terminal">{error}</div>}

          <button type="submit" className="auth-submit-btn">
            {view === 'admin' ? "AUTHORIZE_ADMIN" : view === 'register' ? "CREATE_ACCOUNT" : view === 'forgot' ? "REGENERATE_PASS" : "VERIFY_IDENTITY"}
          </button>
        </form>

        <div className="auth-footer-toggle">
          {view === 'login' && (
            <>
              <p onClick={() => setView('register')}>▶ NEW_CUSTOMER? CREATE_ACCOUNT</p>
              <p onClick={() => setView('forgot')}>▶ FORGOT_PASSWORD? RECOVER</p>
              <p onClick={() => setView('admin')} className="admin-link">▶ SYSTEM_ADMIN_LOGIN</p>
            </>
          )}
          {view !== 'login' && <p onClick={() => setView('login')}>◀ RETURN_TO_LOGIN</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;