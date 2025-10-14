import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header>
      <div className="container header-container">
        <div className="logo">
          <i className="fas fa-hospital"></i>
          <Link to="/">
            <h1>
              Medi<span>Care</span>
            </h1>
          </Link>
        </div>
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#doctors">Doctors</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          {isAuthenticated() ? (
            <div className="user-menu">
              <span>Welcome, {user?.name}</span>
              <Link 
                to={isAdmin() ? "/admin" : "/dashboard"} 
                className="btn btn-appointment"
              >
                {isAdmin() ? "Admin Panel" : "Dashboard"}
              </Link>
              <button onClick={handleLogout} className="btn btn-login">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-login">Login</Link>
              <a href="#appointment" className="btn btn-appointment">Book Appointment</a>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
