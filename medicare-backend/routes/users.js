import express from "express";
import {
  getAllUsers,
  getUserByIdController,
  updateUserController,
  deleteUserController
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all users (admin only)
router.get("/", verifyToken, getAllUsers);

// Get single user by ID
router.get("/:id", verifyToken, getUserByIdController);

// Update user
router.put("/:id", verifyToken, updateUserController);

// Delete user
router.delete("/:id", verifyToken, deleteUserController);

export default router;
