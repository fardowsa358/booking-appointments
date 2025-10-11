// routes/appointment.js - UPDATED VERSION
const express = require('express');
const { 
  createAppointment, 
  getAppointments, 
  getUserAppointments,
  updateAppointment,
  getAppointmentById
} = require('../controllers/appointmentController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Create appointment (REQUIRES LOGIN)
router.post('/', verifyToken, createAppointment);

// Get ALL appointments (ADMIN ONLY)
router.get('/', verifyToken, getAppointments);

// Get user's own appointments (USER SPECIFIC)  
router.get('/my-appointments', verifyToken, getUserAppointments);

// Get single appointment by ID
router.get('/:id', verifyToken, getAppointmentById);

// Update appointment
router.put('/:id', verifyToken, updateAppointment);

module.exports = router;