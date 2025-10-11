// controllers/userController.js - FIXED VERSION
const db = require("../db");

// Get all users (for admin)
const getAllUsers = (req, res) => {
  const query = "SELECT id, name, email, phone, role FROM users";
  db.query(query, (err, results) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true, users: results });
  });
};

// Get single user by ID
const getUserByIdController = (req, res) => {
  const id = req.params.id;
  const query = "SELECT id, name, email, phone, role FROM users WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(400).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user: results[0] });
  });
};

// Update user - FIXED VERSION
const updateUserController = (req, res) => {
  const { name, email, phone } = req.body; // ADDED PHONE HERE
  const id = req.params.id;
  
  const query = "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?"; // ADDED PHONE
  console.log(phone);
  db.query(query, [name, email, phone, id], (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    
    // Check if any rows were actually updated
    console.log(result);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.json({ success: true, message: "User updated successfully" });
  });
};

// Delete user
const deleteUserController = (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.json({ success: true, message: "User deleted successfully" });
  });
};

module.exports = {
  getAllUsers,
  getUserByIdController,
  updateUserController,
  deleteUserController
};