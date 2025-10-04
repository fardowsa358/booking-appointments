import React from "react";

const Header = () => {
  return (
    <header>
      <div className="container header-container">
        <div className="logo">
          <i className="fas fa-hospital"></i>
          <h1>
            Medi<span>Care</span>
          </h1>
        </div>
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#doctors">Doctors</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#login">Login</a></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <a href="#login" className="btn btn-login">Login</a>
          <a href="#appointment" className="btn btn-appointment">Book Appointment</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
