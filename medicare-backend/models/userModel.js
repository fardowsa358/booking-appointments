import { db } from "../db.js";

// Get user by email
export const getUserByEmail = (email, callback) => {
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], callback);
};

// Create new user
export const createUser = (name, email, hashedPassword, callback) => {
  const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(query, [name, email, hashedPassword], callback);
};
