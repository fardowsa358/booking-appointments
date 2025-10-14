// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
require('dotenv').config();

const registerUser = async (req, res) => {
  const { name, email, password,phone } = req.body;
  // console.log(phone)
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?,?)";
    db.query(query, [name, email, hashedPassword,phone], (err, result) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "User registered successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during registration" });
  }
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(400).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "User not found" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // FIX: Add fallback JWT secret
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';
    
    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, {
      expiresIn: "1h",
    });
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone,
        role: user.role 
      } 
    });
  });
};

module.exports = {
  registerUser,
  loginUser
};