// controllers/appointmentController.js
const db = require("../db");

// Create appointment (REGISTERED USERS ONLY)
const createAppointment = (req, res) => {
  // Only allow registered users to create appointments
  if (!req.user) {
    return res.status(401).json({ error: "Please login to book an appointment" });
  }

  const { doctor_id, date, time, reason, notes } = req.body;
  const userId = req.user.id;

  // Validate required fields
  if (!doctor_id || !date || !time) {
    return res.status(400).json({ error: "Doctor, date, and time are required" });
  }

  // First, get doctor details and user details
  const getDoctorQuery = "SELECT name, specialty FROM doctors WHERE id = ?";
  const getUserQuery = "SELECT name, email, phone FROM users WHERE id = ?";

  db.query(getDoctorQuery, [doctor_id], (err, doctorResults) => {
    if (err) return res.status(400).json({ error: err.message });
    if (doctorResults.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const doctor = doctorResults[0];

    db.query(getUserQuery, [userId], (err, userResults) => {
      if (err) return res.status(400).json({ error: err.message });
      if (userResults.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = userResults[0];

      // Insert appointment with ALL fields populated
      const insertQuery = `
        INSERT INTO appointments 
        (patient_name, email, phone, doctor, doctor_id, date, time, user_id, reason, notes, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      `;
      
      db.query(insertQuery, [
        user.name,           // patient_name from user account
        user.email,          // email from user account  
        user.phone,          // phone from user account
        doctor.name,         // doctor name from doctors table
        doctor_id,           // doctor ID
        date,                // appointment date
        time,                // appointment time
        userId,              // user ID
        reason || null,      // reason (optional)
        notes || null        // notes (optional)
      ], (err, result) => {
        if (err) return res.status(400).json({ error: err.message });
        
        res.json({ 
          message: "Appointment booked successfully",
          appointmentId: result.insertId 
        });
      });
    });
  });
};

// Get ALL appointments (ADMIN ONLY)
const getAppointments = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }
  
  const query = `
    SELECT a.*, d.name as doctor_name, d.specialty, d.email as doctor_email, d.phone as doctor_phone
    FROM appointments a 
    LEFT JOIN doctors d ON a.doctor_id = d.id 
    ORDER BY a.date DESC, a.time DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(results);
  });
};

// Get user's own appointments (USER SPECIFIC)
const getUserAppointments = (req, res) => {
  const userId = req.user.id;
  
  const query = `
    SELECT a.*, d.name as doctor_name, d.specialty, d.email as doctor_email, d.phone as doctor_phone
    FROM appointments a 
    LEFT JOIN doctors d ON a.doctor_id = d.id 
    WHERE a.user_id = ? 
    ORDER BY a.date DESC, a.time DESC
  `;
  
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(results);
  });  
};
// Update appointment
const updateAppointment = (req, res) => {
  const appointmentId = req.params.id;
  const { doctor_id, date, time, reason, notes, status } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  // First, check if appointment exists and user has permission
  const checkQuery = "SELECT * FROM appointments WHERE id = ?";
  db.query(checkQuery, [appointmentId], (err, results) => {
    if (err) return res.status(400).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const appointment = results[0];

    // Check permissions: User can only update their own appointments, admin can update any
    if (userRole !== 'admin' && appointment.user_id !== userId) {
      return res.status(403).json({ error: "Access denied. You can only update your own appointments." });
    }

    // If doctor_id is provided, get doctor details
    if (doctor_id) {
      const getDoctorQuery = "SELECT name FROM doctors WHERE id = ?";
      db.query(getDoctorQuery, [doctor_id], (err, doctorResults) => {
        if (err) return res.status(400).json({ error: err.message });
        if (doctorResults.length === 0) {
          return res.status(404).json({ error: "Doctor not found" });
        }

        const doctor = doctorResults[0];
        performUpdate(appointmentId, doctor.name, doctor_id, date, time, reason, notes, status, res);
      });
    } else {
      // Keep existing doctor if not changing
      performUpdate(appointmentId, appointment.doctor, appointment.doctor_id, date, time, reason, notes, status, res);
    }
  });
};

// Helper function to perform the update
const performUpdate = (appointmentId, doctorName, doctorId, date, time, reason, notes, status, res) => {
  const updateQuery = `
    UPDATE appointments 
    SET doctor = ?, doctor_id = ?, date = ?, time = ?, reason = ?, notes = ?, status = ?
    WHERE id = ?
  `;
  
  db.query(updateQuery, [
    doctorName,
    doctorId,
    date,
    time,
    reason,
    notes,
    status,
    appointmentId
  ], (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    
    res.json({ 
      success: true,
      message: "Appointment updated successfully" 
    });
  });
};

// Get single appointment by ID
const getAppointmentById = (req, res) => {
  const appointmentId = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;

  const query = `
    SELECT a.*, d.name as doctor_name, d.specialty, d.email as doctor_email, d.phone as doctor_phone
    FROM appointments a 
    LEFT JOIN doctors d ON a.doctor_id = d.id 
    WHERE a.id = ?
  `;
  
  db.query(query, [appointmentId], (err, results) => {
    if (err) return res.status(400).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const appointment = results[0];

    // Check permissions
    if (userRole !== 'admin' && appointment.user_id !== userId) {
      return res.status(403).json({ error: "Access denied." });
    }

    res.json(appointment);
  });
};

module.exports = {
  createAppointment,
  getAppointments,
  getUserAppointments,
  updateAppointment,      // ADD THIS
  getAppointmentById     // ADD THIS
};