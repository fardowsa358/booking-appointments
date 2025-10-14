import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

// Departments inferred from specialties
const specialties = [
  "Cardiology", "Pediatrics", "Orthopedics", "Neurology", "Dentistry", "Dermatology", "General Medicine"
];

const AppointmentForm = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    department: "",
    doctor_id: "",
    date: "",
    time: "",
    reason: "",
  });
  const [doctors, setDoctors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const list = await api.getDoctorsPublic();
        setDoctors(list);
      } catch (e) {
        setDoctors([]);
      }
    };
    loadDoctors();
  }, []);

  const departmentOptions = useMemo(() => {
    const set = new Set();
    doctors.forEach(d => { if (d.specialty) set.add(d.specialty); });
    return Array.from(set);
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter(d => !formData.department || d.specialty === formData.department);
  }, [doctors, formData.department]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name || e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isAuthenticated()) {
      setError("Please login to book an appointment.");
      return;
    }

    if (!formData.doctor_id || !formData.date || !formData.time) {
      setError("Doctor, date and time are required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        doctor_id: Number(formData.doctor_id),
        date: formData.date,
        time: formData.time,
        reason: formData.reason || null,
        notes: null
      };
      const res = await api.createAppointment(payload, token);
      setSuccess("Appointment booked successfully.");
      setFormData({ department: "", doctor_id: "", date: "", time: "", reason: "" });
    } catch (err) {
      setError(err.message || "Failed to book appointment.");
    } finally {
      setSubmitting(false);
    }
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
              {error && <p style={{ color: 'red', marginBottom: 10 }}>{error}</p>}
              {success && <p style={{ color: 'green', marginBottom: 10 }}>{success}</p>}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <select id="department" name="department" value={formData.department} onChange={handleChange} className="form-control">
                    <option value="">Select Department</option>
                    {departmentOptions.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="doctor_id">Preferred Doctor</label>
                  <select id="doctor_id" name="doctor_id" value={formData.doctor_id} onChange={handleChange} className="form-control" required>
                    <option value="">Select Doctor</option>
                    {filteredDoctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialty})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="date">Preferred Date</label>
                  <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="form-control" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="time">Preferred Time</label>
                  <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} className="form-control" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="reason">Reason (Optional)</label>
                <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} className="form-control" rows="4" placeholder="Any specific requirements or notes"></textarea>
              </div>
              <button type="submit" className="btn btn-appointment" disabled={submitting} style={{ width: "100%" }}>
                {submitting ? 'Booking...' : 'Book Appointment'}
              </button>
            </form>
          </div>
          <div className="appointment-image"></div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentForm;
