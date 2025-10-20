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

// Update user (name, email, phone) and optionally password and role
const bcrypt = require("bcryptjs");
const updateUserController = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const id = req.params.id;

    const fields = [];
    const params = [];

    if (name !== undefined) { fields.push('name = ?'); params.push(name); }
    if (email !== undefined) { fields.push('email = ?'); params.push(email); }
    if (phone !== undefined) { fields.push('phone = ?'); params.push(phone); }
    if (role !== undefined) { fields.push('role = ?'); params.push(role); }
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      fields.push('password = ?');
      params.push(hashed);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);

    db.query(query, params, (err, result) => {
      if (err) return res.status(400).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, message: 'User updated successfully' });
    });
  } catch (e) {
    res.status(500).json({ error: 'Server error updating user' });
  }
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