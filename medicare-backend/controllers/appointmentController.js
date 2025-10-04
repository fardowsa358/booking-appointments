import { db } from "../db.js";

export const createAppointment = (req, res) => {
  const { patient_name, email, phone, doctor, date, time } = req.body;
  const query = "INSERT INTO appointments (patient_name, email, phone, doctor, date, time) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(query, [patient_name, email, phone, doctor, date, time], (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Appointment booked successfully" });
  });
};

export const getAppointments = (req, res) => {
  const query = "SELECT * FROM appointments ORDER BY date DESC";
  db.query(query, (err, results) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(results);
  });
};
