import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [view, setView] = useState('login'); // 'login' | 'register' | 'admin'
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    dob: '',
    gender: '',
    pass: ''
  });
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const triggerOtp = () => {
    const target = formData.mobile;
    if (!target) return setError("▶ ENTER MOBILE NUMBER FOR OTP");
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    alert(`[GMR SECURITY] Your registration OTP is: ${otp}`);
  };

  const handleVerifyOtp = () => {
    if (userOtp === generatedOtp && generatedOtp !== '') {
      setIsOtpVerified(true);
      setError('');
      alert("OTP VERIFIED SUCCESSFUL");
    } else {
      setError("▶ INVALID OTP");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!isOtpVerified) return setError("▶ VERIFY OTP FIRST");
    
    const users = JSON.parse(localStorage.getItem('gmr_users_database')) || [];
    const newUser = { 
      ...formData, 
      id: `GMR-C${1000 + users.length + 1}`,
      regDate: new Date().toLocaleDateString() 
    };
    
    localStorage.setItem('gmr_users_database', JSON.stringify([...users, newUser]));
    alert("REGISTRATION SUCCESSFUL");
    setView('login');
    setIsOtpVerified(false);
    setUserOtp('');
    setGeneratedOtp('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('gmr_users_database')) || [];
    
    if (view === 'admin') {
      if (formData.loginId === "GMR_ADMIN" && formData.pass === "GMR_2026") {
        onLogin({ type: 'admin', userData: { name: 'System Admin', id: 'ADM-001' } });
      } else { 
        setError("▶ ADMIN ACCESS DENIED"); 
      }
    } else {
      const user = users.find(u => (u.email === formData.loginId || u.mobile === formData.loginId) && u.pass === formData.pass);
      if (user) {
        onLogin({ type: 'customer', userData: user });
      } else { 
        setError("▶ IDENTITY NOT FOUND"); 
      }
    }
  };

  return (
    <div className="login-master">
      <div className="login-frame">
        <div className="logo-header">
          <h2 className="terminal-text">GMR <span className="cyan-txt">MART</span></h2>
          <p className="subtitle-text">
            {view === 'admin' ? 'ADMIN ACCESS CONTROL' : view === 'register' ? 'NEW ENROLLMENT' : 'SECURE GATEWAY'}
          </p>
        </div>

        {error && <div className="error-banner">{error}</div>}
        
        <form onSubmit={view === 'register' ? handleRegister : handleLogin} className="cyber-form">
          {view === 'register' ? (
            <div className="compact-register-grid">
              <div className="cyber-input-group">
                <label>FULL NAME</label>
                <input type="text" name="name" required onChange={handleChange} placeholder="John Doe" />
              </div>

              <div className="cyber-input-group">
                <label>MOBILE NUMBER</label>
                <input type="text" name="mobile" required onChange={handleChange} placeholder="Enter 10-digit number" />
              </div>

              <div className="cyber-input-group">
                <label>EMAIL ID</label>
                <input type="email" name="email" required onChange={handleChange} placeholder="name@domain.com" />
              </div>

              <div className="grid-split">
                <div className="cyber-input-group">
                  <label>DATE OF BIRTH</label>
                  <input type="date" name="dob" required onChange={handleChange} />
                </div>
                <div className="cyber-input-group">
                  <label>GENDER</label>
                  <select name="gender" required onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="cyber-input-group">
                <label>CREATE PASSWORD</label>
                <input type="password" name="pass" required onChange={handleChange} placeholder="••••••••" />
              </div>

              <div className="otp-container">
                <label>MOBILE VERIFICATION</label>
                <div className="otp-row">
                  <input type="text" placeholder="Enter OTP" onChange={(e) => setUserOtp(e.target.value)} />
                  <button type="button" className="otp-btn send" onClick={triggerOtp}>SEND</button>
                  <button type="button" className={`otp-btn verify ${isOtpVerified ? 'verified' : ''}`} onClick={handleVerifyOtp}>
                    {isOtpVerified ? 'VERIFIED' : 'VERIFY'}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit-btn margin-top-lg">REGISTER</button>
            </div>
          ) : (
            <div className="login-fields">
              <div className="cyber-input-group">
                <label>{view === 'admin' ? 'ADMIN IDENTIFIER' : 'IDENTITY (EMAIL/MOBILE)'}</label>
                <input type="text" name="loginId" required onChange={handleChange} placeholder={view === 'admin' ? 'GMR_ADMIN' : 'Enter email or mobile'} />
              </div>
              <div className="cyber-input-group">
                <label>PASSWORD</label>
                <input type="password" name="pass" required onChange={handleChange} placeholder="••••••••" />
              </div>
              <button type="submit" className="auth-submit-btn">
                {view === 'admin' ? 'AUTHENTICATE_ADMIN' : 'VERIFY_IDENTITY'}
              </button>
            </div>
          )}
        </form>

        <div className="auth-footer">
          {view === 'login' ? (
            <div className="footer-links">
              <span onClick={() => setView('register')} className="footer-link">▶ NEW USER? ENROLL</span>
              <span onClick={() => setView('admin')} className="admin-link">ADMIN_LOGIN</span>
            </div>
          ) : (
            <span onClick={() => { setView('login'); setError(''); }} className="footer-link">◀ BACK TO LOGIN</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;