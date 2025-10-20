import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const LoginPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  // Redirect if already logged in
  if (isAuthenticated()) {
    return <Navigate to={isAdmin() ? "/admin" : "/dashboard"} replace />;
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-tabs">
            <button 
              className={`tab-button ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button 
              className={`tab-button ${activeTab === "register" ? "active" : ""}`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
          </div>
          
          <div className="auth-content">
            {activeTab === "login" ? <LoginForm /> : <RegisterForm setActiveTab={setActiveTab} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
