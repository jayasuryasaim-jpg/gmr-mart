import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, we allow any login to proceed to the home page
    console.log(isLogin ? "Logging in..." : "Registering...");
    navigate("/home"); 
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          <h3>{isLogin ? "Sign In" : "Register"}</h3>

          {!isLogin && (
            <div className="mb-3">
              <label>Full Name</label>
              <input type="text" className="form-control" placeholder="Enter full name" required />
            </div>
          )}

          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              {isLogin ? "Submit" : "Sign Up"}
            </button>
          </div>

          <p className="forgot-password text-right">
            {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
            <span className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Register here" : "Login here"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;