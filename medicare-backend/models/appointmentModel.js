// models/appointmentModel.js
const db = require("../db");

// Create new appointment
const createAppointment = (data, callback) => {
  const { patient_name, email, phone, doctor, date, time } = data;
  const query = "INSERT INTO appointments (patient_name, email, phone, doctor, date, time) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(query, [patient_name, email, phone, doctor, date, time], callback);
};

// Get all appointments
const getAllAppointments = (callback) => {
  const query = "SELECT * FROM appointments ORDER BY date DESC";
  db.query(query, callback);
};

module.exports = {
  createAppointment,
  getAllAppointments
};