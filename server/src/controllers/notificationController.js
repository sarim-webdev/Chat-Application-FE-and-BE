import { Notification } from "../models/notificationSchema.js";
import { successResponse } from "../reponseHandler/successResponse.js";

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      receiver: req.user.id,
    })
      .populate("sender", "userName profileImage")
      .populate("chat")
      .populate("group")
      .populate("message")
      .sort({ createdAt: -1 });

    return successResponse(
      res,
      200,
      true,
      "Notifications fetched successfully",
      notifications,
    );
  } catch (error) {
    next(error);
  }
};

const markNotificationRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        receiver: req.user.id,
      },
      {
        isRead: true,
      },
      {
        new: true,
      },
    )
      .populate("sender", "userName profileImage")
      .populate("chat")
      .populate("group")
      .populate("message");

    return successResponse(
      res,
      200,
      true,
      "Notification marked as read",
      notification,
    );
  } catch (error) {
    next(error);
  }
};

const markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      {
        receiver: req.user.id,
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    return successResponse(
      res,
      200,
      true,
      "All notifications marked as read",
      {},
    );
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    await Notification.findOneAndDelete({
      _id: notificationId,
      receiver: req.user.id,
    });

    return successResponse(
      res,
      200,
      true,
      "Notification deleted successfully",
      {},
    );
  } catch (error) {
    next(error);
  }
};

const deleteConversationNotifications = async (req, res, next) => {
  try {
    const { chatId, groupId } = req.body;

    const query = {
      receiver: req.user.id,
    };

    if (chatId) {
      query.chat = chatId;
    }

    if (groupId) {
      query.group = groupId;
    }

    await Notification.deleteMany(query);

    return successResponse(
      res,
      200,
      true,
      "Conversation notifications deleted successfully",
      {},
    );
  } catch (error) {
    next(error);
  }
};

export {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteConversationNotifications,
};
