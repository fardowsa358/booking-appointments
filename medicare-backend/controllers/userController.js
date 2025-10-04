import { getUserById, createUser, updateUser, deleteUser } from "../models/user.js";
import bcrypt from "bcryptjs";

// Get all users (for admin)
export const getAllUsers = (req, res, next) => {
  const query = "SELECT id, name, email FROM users";
  req.db.query(query, (err, result) => {
    if (err) return next(err);
    res.json({ success: true, users: result });
  });
};

// Get single user by ID
export const getUserByIdController = (req, res, next) => {
  const id = req.params.id;
  getUserById(id, (err, result) => {
    if (err) return next(err);
    if (result.length === 0) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user: result[0] });
  });
};

// Update user
export const updateUserController = (req, res, next) => {
  const { name, email } = req.body;
  const id = req.params.id;
  updateUser(id, name, email, (err, result) => {
    if (err) return next(err);
    res.json({ success: true, message: "User updated successfully" });
  });
};

// Delete user
export const deleteUserController = (req, res, next) => {
  const id = req.params.id;
  deleteUser(id, (err, result) => {
    if (err) return next(err);
    res.json({ success: true, message: "User deleted successfully" });
  });
};
