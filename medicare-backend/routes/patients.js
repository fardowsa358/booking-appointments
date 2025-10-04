// routes/patients.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

// POST create patient
router.post('/', async (req, res) => {
  try {
    const { full_name, email, phone } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO patients (full_name, email, phone) VALUES (?, ?, ?)',
      [full_name, email || null, phone || null]
    );
    res.status(201).json({ id: result.insertId, full_name, email, phone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all patients (basic)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, full_name, email, phone, created_at FROM patients ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
