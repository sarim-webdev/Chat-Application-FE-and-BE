import express from "express";
import { verifyUser } from "../middleware/verifyUser.js";
import {
  getAllUsers,
  getUserById,
  searchUsers,
  updateProfileImage,
  updateUserProfile,
} from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.get("/", verifyUser, getAllUsers);
userRoutes.get("/search", verifyUser, searchUsers);
userRoutes.get("/:id", verifyUser, getUserById);
userRoutes.put("/update-profile", verifyUser, updateUserProfile);
userRoutes.put("/profile-image", verifyUser, updateProfileImage);

export { userRoutes };
