// routes/doctors.js - COMPLETE VERSION
const express = require('express');
const { 
  getAllDoctors, 
  getDoctorById, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor,
  getDoctorAppointments 
} = require('../controllers/doctorController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes (no auth required)
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

// Protected routes (require auth)
router.post('/', verifyToken, createDoctor);
router.put('/:id', verifyToken, updateDoctor);
router.delete('/:id', verifyToken, deleteDoctor);
router.get('/:id/appointments', verifyToken, getDoctorAppointments);

module.exports = router;