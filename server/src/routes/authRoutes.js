import express from "express";
import upload from "../middleware/multer.js";
import { verifyUser } from "../middleware/verifyUser.js";
import { getMe, login, logout, signup } from "../controllers/authController.js";

const authRoutes = express.Router();

authRoutes.post("/signup", upload.single("profileImage"), signup);
authRoutes.post("/login", login);
authRoutes.post("/logout", verifyUser, logout);
authRoutes.get("/me", verifyUser, getMe);

export { authRoutes };
