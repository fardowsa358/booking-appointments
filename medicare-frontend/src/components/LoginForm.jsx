import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log('Attempting login with:', { email, password });
    const result = await login(email, password);
    console.log('Login result:', result);

    if (result.success) {
      // Redirect based on user role
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('Redirecting user:', user);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div className="section-title" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h2>Login</h2>
        <p>Access your account</p>
      </div>

      <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: 480,
            margin: "0 auto",
            background: "#fff",
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}
        >
          {error && (
            <p style={{ color: "red", textAlign: "center", marginBottom: 10 }}>
              {error}
            </p>
          )}

          <div className="form-group" style={{ marginBottom: 15 }}>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter your email"
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "5px"
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 15 }}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter your password"
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "5px"
              }}
            />
          </div>

          <button
            type="submit"
            className="btn"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              background: loading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => navigate("/")}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "10px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}>Back to Home</button>
          
        </form>
    </div>
  );
};

export default LoginForm;
