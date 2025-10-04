// routes/doctors.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET all doctors
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, specialty, email, phone FROM doctors ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single doctor
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, name, specialty, email, phone FROM doctors WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Doctor not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new doctor (optional admin)
router.post('/', async (req, res) => {
  try {
    const { name, specialty, email, phone } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO doctors (name, specialty, email, phone) VALUES (?, ?, ?, ?)',
      [name, specialty, email || null, phone || null]
    );
    const inserted = { id: result.insertId, name, specialty, email, phone };
    res.status(201).json(inserted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
