// routes/users.js
const express = require("express");
const {
  getAllUsers,
  getUserByIdController,
  updateUserController,
  deleteUserController
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all users (admin only)
router.get("/", verifyToken, getAllUsers);

// Get single user by ID
router.get("/:id", verifyToken, getUserByIdController);

// Update user
router.put("/:id", verifyToken, updateUserController);

// Delete user
router.delete("/:id", verifyToken, deleteUserController);

module.exports = router;