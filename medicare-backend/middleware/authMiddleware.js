// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Access denied. No token provided." });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied. Invalid token." });

  try {
    // FIX: Use same fallback secret
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = {
  verifyToken
};