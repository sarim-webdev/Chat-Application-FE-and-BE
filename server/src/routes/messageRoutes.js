import express from "express";
import { verifyUser } from "../middleware/verifyUser.js";
import {
  deleteForEveryone,
  deleteForMe,
  editMessage,
  getMessages,
  markMessageSeen,
  sendMessage,
  toggleReaction,
} from "../controllers/messageController.js";
import upload from "../middleware/multer.js";

const messageRoutes = express.Router();

messageRoutes.post(
  "/send",
  verifyUser,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "voice", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  sendMessage,
);
messageRoutes.get("/:chatId", verifyUser, getMessages);
messageRoutes.put("/seen/:messageId", verifyUser, markMessageSeen);
messageRoutes.put("/edit/:messageId", verifyUser, editMessage);
messageRoutes.put("/delete/everyone/:messageId", verifyUser, deleteForEveryone);
messageRoutes.put("/delete-for-me/:messageId", verifyUser, deleteForMe);
messageRoutes.put("/reaction/:messageId", verifyUser, toggleReaction);

export { messageRoutes };
