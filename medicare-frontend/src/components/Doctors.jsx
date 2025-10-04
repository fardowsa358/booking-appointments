import React from "react";

const doctorsData = [
  { name: "Dr. John Smith", role: "Cardiologist", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
  { name: "Dr. Sarah Johnson", role: "Pediatrician", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
  { name: "Dr. Michael Williams", role: "Orthopedic Surgeon", img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
  { name: "Dr. Emily Brown", role: "Neurologist", img: "https://www.ozelsaglikhastanesi.com/afis/91332622-82239-uzmdrcigdemozdemir.jpg" },
];

const Doctors = () => {
  return (
    <section className="doctors" id="doctors">
      <div className="container">
        <div className="section-title">
          <h2>Our Expert Doctors</h2>
          <p>Meet our team of highly qualified and experienced medical professionals.</p>
        </div>
        <div className="doctors-grid">
          {doctorsData.map((doc, index) => (
            <div className="doctor-card" key={index}>
              <div className="doctor-img">
                <img src={doc.img} alt={doc.name} />
              </div>
              <div className="doctor-info">
                <h3>{doc.name}</h3>
                <p>{doc.role}</p>
                <div className="doctor-social">
                  <a href="#"><i className="fab fa-facebook-f"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                  <a href="#"><i className="fab fa-linkedin-in"></i></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Doctors;
