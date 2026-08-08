import express from "express";

import { verifyUser } from "../middleware/verifyUser.js";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteConversationNotifications,
} from "../controllers/notificationController.js";

const notificationRoutes = express.Router();

notificationRoutes.get("/", verifyUser, getNotifications);
notificationRoutes.put(
  "/:notificationId/read",
  verifyUser,
  markNotificationRead,
);
notificationRoutes.put("/read-all", verifyUser, markAllNotificationsRead);
notificationRoutes.delete(
  "/conversation",
  verifyUser,
  deleteConversationNotifications,
);
notificationRoutes.delete("/:notificationId", verifyUser, deleteNotification);

export { notificationRoutes };
