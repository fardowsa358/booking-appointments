import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-container">
          <div className="footer-col">
            <h3>About Us</h3>
            <p>MediCare Hospital is a leading healthcare provider committed to delivering exceptional medical services with compassion and innovation.</p>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#doctors">Our Doctors</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#appointment">Book Appointment</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Services</h3>
            <ul>
              <li><a href="#">Cardiology</a></li>
              <li><a href="#">Pediatrics</a></li>
              <li><a href="#">Orthopedics</a></li>
              <li><a href="#">Neurology</a></li>
              <li><a href="#">Dentistry</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Contact Info</h3>
            <ul>
              <li><i className="fas fa-map-marker-alt"></i> 123 Healthcare Ave, Medical City</li>
              <li><i className="fas fa-phone"></i> +1 (555) 123-4567</li>
              <li><i className="fas fa-envelope"></i> info@medicare.com</li>
              <li><i className="fas fa-clock"></i> Mon-Fri: 8:00 AM - 6:00 PM</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2023 MediCare Hospital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
