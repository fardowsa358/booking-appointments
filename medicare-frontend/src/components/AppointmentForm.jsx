import React, { useState } from "react";

const doctorOptions = {
  cardiology: [
    { name: "Dr. John Smith", value: "dr-smith" },
    { name: "Dr. Robert Taylor", value: "dr-taylor" }
  ],
  pediatrics: [
    { name: "Dr. Sarah Johnson", value: "dr-johnson" },
    { name: "Dr. Lisa Anderson", value: "dr-anderson" }
  ],
  orthopedics: [
    { name: "Dr. Michael Williams", value: "dr-williams" },
    { name: "Dr. James Miller", value: "dr-miller" }
  ],
  neurology: [
    { name: "Dr. Emily Brown", value: "dr-brown" },
    { name: "Dr. Patricia Davis", value: "dr-davis" }
  ],
  dentistry: [
    { name: "Dr. David Wilson", value: "dr-wilson" },
    { name: "Dr. Jennifer Moore", value: "dr-moore" }
  ]
};

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    doctor: "",
    date: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${formData.fullName}! Your appointment request has been submitted. We will contact you at ${formData.email} to confirm your appointment in the ${formData.department} department.`);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      department: "",
      doctor: "",
      date: "",
      message: ""
    });
  };

  return (
    <section className="appointment" id="appointment">
      <div className="container">
        <div className="section-title">
          <h2>Book an Appointment</h2>
          <p>Fill out the form below to schedule your appointment with our specialists.</p>
        </div>
        <div className="appointment-container">
          <div className="appointment-form">
            <h2>Schedule Your Visit</h2>
            <p>We'll contact you to confirm your appointment.</p>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input type="text" id="fullName" value={formData.fullName} onChange={handleChange} className="form-control" placeholder="Enter your full name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="Enter your email" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="form-control" placeholder="Enter your phone number" required />
                </div>
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <select id="department" value={formData.department} onChange={handleChange} className="form-control" required>
                    <option value="">Select Department</option>
                    {Object.keys(doctorOptions).map(dep => <option key={dep} value={dep}>{dep.charAt(0).toUpperCase() + dep.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="doctor">Preferred Doctor</label>
                  <select id="doctor" value={formData.doctor} onChange={handleChange} className="form-control" required>
                    <option value="">Select Doctor</option>
                    {formData.department && doctorOptions[formData.department].map(doc => (
                      <option key={doc.value} value={doc.value}>{doc.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="date">Preferred Date</label>
                  <input type="date" id="date" value={formData.date} onChange={handleChange} className="form-control" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="message">Additional Message (Optional)</label>
                <textarea id="message" value={formData.message} onChange={handleChange} className="form-control" rows="4" placeholder="Any specific requirements or notes"></textarea>
              </div>
              <button type="submit" className="btn btn-appointment" style={{ width: "100%" }}>Book Appointment</button>
            </form>
          </div>
          <div className="appointment-image"></div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentForm;
