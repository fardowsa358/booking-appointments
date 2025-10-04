import React, { useState } from "react";


const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Fake login credentials
    const validEmail = "admin@medicare.com";
    const validPassword = "12345";

    if (email === validEmail && password === validPassword) {
      alert("✅ Login Successful! Welcome to Medicare Dashboard");
      // Halkan waxaad ku dari kartaa navigate("/dashboard") haddii react-router-dom aad isticmaasho
    } else {
      setError("❌ Invalid email or password");
    }
  };

  return (
    <section id="login" style={{ padding: "4rem 0" }}>
      <div className="container">
        <div className="section-title">
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
            style={{
              width: "100%",
              padding: "10px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginForm;
