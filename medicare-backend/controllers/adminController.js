// controllers/adminController.js
const db = require("../db");

// Admin Dashboard Statistics
const getDashboardStats = (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  const statsQueries = {
    totalUsers: 'SELECT COUNT(*) as count FROM users WHERE role = "patient"',
    totalAdmins: 'SELECT COUNT(*) as count FROM users WHERE role = "admin"',
    totalDoctors: 'SELECT COUNT(*) as count FROM doctors',
    totalAppointments: 'SELECT COUNT(*) as count FROM appointments',
    pendingAppointments: 'SELECT COUNT(*) as count FROM appointments WHERE status = "pending"',
    confirmedAppointments: 'SELECT COUNT(*) as count FROM appointments WHERE status = "confirmed"',
    todayAppointments: 'SELECT COUNT(*) as count FROM appointments WHERE date = CURDATE()'
  };

  const results = {};
  let completedQueries = 0;
  const totalQueries = Object.keys(statsQueries).length;

  Object.keys(statsQueries).forEach(key => {
    db.query(statsQueries[key], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
      
      results[key] = result[0].count;
      completedQueries++;
      
      if (completedQueries === totalQueries) {
        res.json({
          success: true,
          stats: results,
          message: "Dashboard stats retrieved successfully"
        });
      }
    });
  });
};

// Get recent activities
const getRecentActivities = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  const query = `
    (SELECT 'appointment' as type, id, patient_name as title, created_at 
     FROM appointments 
     ORDER BY created_at DESC LIMIT 10)
    UNION ALL
    (SELECT 'user' as type, id, name as title, created_at 
     FROM users 
     ORDER BY created_at DESC LIMIT 10)
    UNION ALL
    (SELECT 'doctor' as type, id, name as title, created_at 
     FROM doctors 
     ORDER BY created_at DESC LIMIT 10)
    ORDER BY created_at DESC 
    LIMIT 20
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json({
      success: true,
      activities: results
    });
  });
};

// Bulk update appointment statuses
const bulkUpdateAppointments = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  const { appointmentIds, status } = req.body;

  if (!appointmentIds || !status || !Array.isArray(appointmentIds)) {
    return res.status(400).json({ error: "appointmentIds array and status are required" });
  }

  if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const query = 'UPDATE appointments SET status = ? WHERE id IN (?)';
  db.query(query, [status, appointmentIds], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }

    res.json({
      success: true,
      message: `${result.affectedRows} appointments updated to ${status}`,
      affectedRows: result.affectedRows
    });
  });
};

// Search appointments with filters
const searchAppointments = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  const { patient_name, doctor_id, status, date_from, date_to } = req.query;
  
  let query = `
    SELECT a.*, d.name as doctor_name, d.specialty, u.name as patient_user_name
    FROM appointments a 
    LEFT JOIN doctors d ON a.doctor_id = d.id 
    LEFT JOIN users u ON a.user_id = u.id 
    WHERE 1=1
  `;
  const params = [];

  if (patient_name) {
    query += ' AND (a.patient_name LIKE ? OR u.name LIKE ?)';
    params.push(`%${patient_name}%`, `%${patient_name}%`);
  }

  if (doctor_id) {
    query += ' AND a.doctor_id = ?';
    params.push(doctor_id);
  }

  if (status) {
    query += ' AND a.status = ?';
    params.push(status);
  }

  if (date_from) {
    query += ' AND a.date >= ?';
    params.push(date_from);
  }

  if (date_to) {
    query += ' AND a.date <= ?';
    params.push(date_to);
  }

  query += ' ORDER BY a.date DESC, a.time DESC';

  db.query(query, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results);
  });
};

module.exports = {
  getDashboardStats,
  getRecentActivities,
  bulkUpdateAppointments,
  searchAppointments
};