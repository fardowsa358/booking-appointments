import { db } from "../db.js";

// Create new appointment
export const createAppointment = (data, callback) => {
  const { patient_name, email, phone, doctor, date, time } = data;
  const query = "INSERT INTO appointments (patient_name, email, phone, doctor, date, time) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(query, [patient_name, email, phone, doctor, date, time], callback);
};

// Get all appointments
export const getAllAppointments = (callback) => {
  const query = "SELECT * FROM appointments ORDER BY date DESC";
  db.query(query, callback);
};
