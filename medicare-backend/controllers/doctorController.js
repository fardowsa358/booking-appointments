// controllers/doctorController.js
const db = require("../db");

// Get all doctors
const getAllDoctors = (req, res) => {
  const query = 'SELECT id, name, specialty, email, phone FROM doctors ORDER BY name';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results);
  });
};

// Get single doctor by ID
const getDoctorById = (req, res) => {
  const doctorId = req.params.id;
  const query = 'SELECT id, name, specialty, email, phone FROM doctors WHERE id = ?';
  db.query(query, [doctorId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    if (results.length === 0) return res.status(404).json({ error: 'Doctor not found' });
    res.json(results[0]);
  });
};

// Create new doctor (Admin only)
const createDoctor = (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  const { name, specialty, email, phone } = req.body;

  // Validate required fields
  if (!name || !specialty) {
    return res.status(400).json({ error: "Name and specialty are required" });
  }

  // Check if doctor already exists
  const checkQuery = 'SELECT id FROM doctors WHERE name = ? AND specialty = ?';
  db.query(checkQuery, [name, specialty], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'Doctor already exists' });
    }

    // Create new doctor
    const insertQuery = 'INSERT INTO doctors (name, specialty, email, phone) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [name, specialty, email, phone], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }

      // Return the created doctor
      const getDoctorQuery = 'SELECT id, name, specialty, email, phone FROM doctors WHERE id = ?';
      db.query(getDoctorQuery, [result.insertId], (err, doctorResults) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Server error' });
        }
        
        res.status(201).json(doctorResults[0]);
      });
    });
  });
};

// Update doctor (Admin only)
const updateDoctor = (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  const doctorId = req.params.id;
  const { name, specialty, email, phone } = req.body;

  // Validate required fields
  if (!name || !specialty) {
    return res.status(400).json({ error: "Name and specialty are required" });
  }

  // Check if doctor exists
  const checkQuery = 'SELECT id FROM doctors WHERE id = ?';
  db.query(checkQuery, [doctorId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Update doctor
    const updateQuery = 'UPDATE doctors SET name = ?, specialty = ?, email = ?, phone = ? WHERE id = ?';
    db.query(updateQuery, [name, specialty, email, phone, doctorId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }

      // Return updated doctor
      const getDoctorQuery = 'SELECT id, name, specialty, email, phone FROM doctors WHERE id = ?';
      db.query(getDoctorQuery, [doctorId], (err, doctorResults) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Server error' });
        }
        
        res.json({
          success: true,
          message: "Doctor updated successfully",
          doctor: doctorResults[0]
        });
      });
    });
  });
};

// Delete doctor (Admin only)
const deleteDoctor = (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  const doctorId = req.params.id;

  // Check if doctor exists
  const checkQuery = 'SELECT id FROM doctors WHERE id = ?';
  db.query(checkQuery, [doctorId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Check if doctor has appointments
    const checkAppointmentsQuery = 'SELECT id FROM appointments WHERE doctor_id = ?';
    db.query(checkAppointmentsQuery, [doctorId], (err, appointmentResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }

      if (appointmentResults.length > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete doctor with existing appointments. Please reassign appointments first.' 
        });
      }

      // Delete doctor
      const deleteQuery = 'DELETE FROM doctors WHERE id = ?';
      db.query(deleteQuery, [doctorId], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Server error' });
        }

        res.json({
          success: true,
          message: "Doctor deleted successfully"
        });
      });
    });
  });
};

// Get doctor's appointments (Admin only)
const getDoctorAppointments = (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  const doctorId = req.params.id;

  const query = `
    SELECT a.*, u.name as patient_name, u.email as patient_email, u.phone as patient_phone
    FROM appointments a 
    LEFT JOIN users u ON a.user_id = u.id 
    WHERE a.doctor_id = ? 
    ORDER BY a.date DESC, a.time DESC
  `;
  
  db.query(query, [doctorId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results);
  });
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorAppointments
};