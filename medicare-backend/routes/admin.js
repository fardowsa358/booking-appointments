// routes/admin.js
const express = require("express");
const { 
  getDashboardStats, 
  getRecentActivities, 
  bulkUpdateAppointments,
  searchAppointments 
} = require("../controllers/adminController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// All admin routes require authentication
router.use(verifyToken);

// Dashboard routes
router.get("/dashboard", getDashboardStats);
router.get("/recent-activities", getRecentActivities);

// Appointment management
router.patch("/appointments/bulk-update", bulkUpdateAppointments);
router.get("/appointments/search", searchAppointments);

module.exports = router;