import React from "react";

const Contact = () => {
  return (
    <section id="contact">
      <div className="container">
        <div className="section-title">
          <h2>Contact Us</h2>
          <p>Get in touch with us for any queries</p>
        </div>
        <div className="contact-content">
          <p><i className="fas fa-map-marker-alt"></i> 123 Healthcare Ave, City</p>
          <p><i className="fas fa-phone"></i> +1 (123) 456-7890</p>
          <p><i className="fas fa-envelope"></i> info@medicare.com</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
