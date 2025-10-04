// routes/appointments.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

// Create appointment
router.post('/', async (req, res) => {
  try {
    const { patient_id, doctor_id, scheduled_at, duration_minutes = 30, reason, notes } = req.body;
    if (!patient_id || !doctor_id || !scheduled_at) {
      return res.status(400).json({ error: 'patient_id, doctor_id and scheduled_at required' });
    }

    // Simple conflict check: exact same datetime for same doctor (you can improve range check)
    const [conf] = await pool.execute(
      'SELECT id FROM appointments WHERE doctor_id = ? AND scheduled_at = ? AND status != ?',
      [doctor_id, scheduled_at, 'Cancelled']
    );
    if (conf.length > 0) {
      return res.status(409).json({ error: 'Doctor not available at that time' });
    }

    const [result] = await pool.execute(
      `INSERT INTO appointments
       (patient_id, doctor_id, scheduled_at, duration_minutes, status, reason, notes)
       VALUES (?, ?, ?, ?, 'Pending', ?, ?)`,
      [patient_id, doctor_id, scheduled_at, duration_minutes, reason || null, notes || null]
    );

    const [rows] = await pool.execute('SELECT * FROM appointments WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get appointments (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { patient_id, doctor_id } = req.query;
    let sql = 'SELECT a.*, p.full_name as patient_name, d.name as doctor_name FROM appointments a JOIN patients p ON a.patient_id=p.id JOIN doctors d ON a.doctor_id=d.id';
    const params = [];
    const conditions = [];
    if (patient_id) { conditions.push('a.patient_id = ?'); params.push(patient_id); }
    if (doctor_id) { conditions.push('a.doctor_id = ?'); params.push(doctor_id); }
    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY a.scheduled_at ASC';
    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single appointment
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT a.*, p.full_name as patient_name, d.name as doctor_name FROM appointments a JOIN patients p ON a.patient_id=p.id JOIN doctors d ON a.doctor_id=d.id WHERE a.id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
