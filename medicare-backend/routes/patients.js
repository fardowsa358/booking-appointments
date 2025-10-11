// routes/patients.js
const express = require('express');
const db = require('../db');
const router = express.Router();

// POST create patient
router.post('/', (req, res) => {
  const { full_name, email, phone } = req.body;
  const query = 'INSERT INTO patients (full_name, email, phone) VALUES (?, ?, ?)';
  
  db.query(query, [full_name, email, phone], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.status(201).json({ 
      id: result.insertId, 
      full_name, 
      email, 
      phone 
    });
  });
});

// GET all patients
router.get('/', (req, res) => {
  const query = 'SELECT id, full_name, email, phone, created_at FROM patients ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results);
  });
});

module.exports = router;