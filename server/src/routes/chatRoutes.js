import express from "express";
import { verifyUser } from "../middleware/verifyUser.js";
import {
  createChat,
  getChatById,
  getChats,
} from "../controllers/chatController.js";

const chatRoutes = express.Router();

chatRoutes.post("/createChat", verifyUser, createChat);
chatRoutes.get("/getChst", verifyUser, getChats);
chatRoutes.get("/:id", verifyUser, getChatById);

export { chatRoutes };
