import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RegisterForm = ({setActiveTab}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    // Phone validation
    if (!formData.phone || formData.phone.trim() === '') {
      setError("Phone number is required");
      return;
    }
    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password, formData.phone);

    if (result.success) {
      alert("Registration successful! Please login with your credentials.");
      setActiveTab("login");
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div className="section-title" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h2>Create Account</h2>
        <p>Join MediCare to book appointments</p>
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
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your full name"
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
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your phone number"
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
              name="password"
              value={formData.password}
              onChange={handleChange}
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

          <div className="form-group" style={{ marginBottom: 15 }}>
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-control"
              placeholder="Confirm your password"
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
              background: loading ? "#ccc" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p style={{ textAlign: "center", marginTop: "1rem" }}>
            Already have an account?{" "}
            <a href="#login" style={{ color: "#007bff", textDecoration: "none" }}>
              Login here
            </a>
          </p>
        </form>
    </div>
  );
};

export default RegisterForm;
