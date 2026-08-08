import { Message } from "../models/messageSchema.js";
import { Chat } from "../models/chatSchema.js";
import { successResponse } from "../reponseHandler/successResponse.js";
import { Contact } from "../models/contactSchema.js";
import { User } from "../models/userSchema.js";
import { Group } from "../models/groupSchema.js";
import { Notification } from "../models/notificationSchema.js";
import {
  getIO,
  onlineUsers,
  activeChats,
  activeGroups,
} from "../socket/socket.js";
import { cloudinary } from "../config/cloudinary.js";

const sendMessage = async (req, res, next) => {
  try {
    const { chat, text, voiceDuration, replyTo } = req.body;

    let image = "";
    let voice = "";
    let file = {
      url: "",
      originalName: "",
      fileName: "",
      mimeType: "",
      size: 0,
      extension: "",
    };

    if (req.files?.image) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "chat-images",
            },
            (error, result) => {
              if (error) return reject(error);

              resolve(result);
            },
          )
          .end(req.files.image[0].buffer);
      });

      image = uploadResult.secure_url;
    }

    if (req.files?.voice) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "chat-voices",
              resource_type: "video",
            },

            (error, result) => {
              if (error) return reject(error);

              resolve(result);
            },
          )
          .end(req.files.voice[0].buffer);
      });

      voice = uploadResult.secure_url;
    }

    if (req.files?.file) {
      const uploadedFile = req.files.file[0];

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "chat-files",
              resource_type: "raw",
              public_id: Date.now() + "-" + uploadedFile.originalname,
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          )
          .end(uploadedFile.buffer);
      });

      file = {
        url: uploadResult.secure_url,
        originalName: uploadedFile.originalname,
        fileName: uploadResult.public_id,
        mimeType: uploadedFile.mimetype,
        size: uploadedFile.size,
        extension: uploadedFile.originalname.split(".").pop(),
        publicId: uploadResult.public_id,
      };
    }

    if (
      !text?.trim() &&
      !req.files?.image &&
      !req.files?.voice &&
      !req.files?.file
    ) {
      throw new Error("Message required");
    }

    const senderId = req.user.id;

    if (!chat) throw new Error("Chat ID required");

    const chatData = await Chat.findById(chat);

    const groupData = await Group.findById(chat);

    if (!chatData && !groupData) {
      throw new Error("Chat or Group not found");
    }

    const allChats = await Chat.find();

    const message = await Message.create({
      chat: chatData ? chat : null,
      group: groupData ? chat : null,
      sender: senderId,
      text,
      image,
      voice,
      file,
      replyTo: replyTo ? JSON.parse(replyTo) : null,
      voiceDuration: Number(voiceDuration) || 0,
    });

    if (chatData) {
      await Chat.findByIdAndUpdate(chat, {
        lastMessage: message._id,
      });
    }

    if (groupData) {
      groupData.lastMessage = message._id;

      groupData.members.forEach((memberId) => {
        if (memberId.toString() === senderId) return;

        const unread = groupData.unreadCounts.find(
          (u) => u.user.toString() === memberId.toString(),
        );

        if (unread) {
          unread.count += 1;
        } else {
          groupData.unreadCounts.push({
            user: memberId,
            count: 1,
          });
        }
      });

      await groupData.save();

      for (const memberId of groupData.members) {
        if (memberId.toString() === senderId) continue;

        const openedGroup = activeGroups.get(memberId.toString());

        if (openedGroup === groupData._id.toString()) {
          continue;
        }

        await Notification.create({
          receiver: memberId,
          sender: senderId,
          group: groupData._id,
          message: message._id,
          type: "group-message",
        });

        const socketId = onlineUsers.get(memberId.toString());

        if (socketId) {
          getIO().to(socketId).emit("new-notification");
        }
      }
      getIO().emit("groups-updated");
    }
    if (chatData) {
      const receiverId = chatData.participants.find(
        (id) => id.toString() !== senderId,
      );

      const receiverSocketId = onlineUsers.get(receiverId.toString());

      if (receiverSocketId) {
        getIO().to(receiverSocketId).emit("contacts-updated");
      }

      const senderContactExists = await Contact.findOne({
        owner: senderId,
        contactUser: receiverId,
      });

      if (!senderContactExists) {
        await Contact.create({
          owner: senderId,
          contactUser: receiverId,
        });
      }

      const receiverContactExists = await Contact.findOne({
        owner: receiverId,
        contactUser: senderId,
      });

      const openedChat = activeChats.get(receiverId.toString());

      if (openedChat !== chatData._id.toString()) {
        await Notification.create({
          receiver: receiverId,
          sender: senderId,
          chat: chatData._id,
          message: message._id,
          type: "private-message",
        });

        if (receiverSocketId) {
          getIO().to(receiverSocketId).emit("new-notification");
        }
      }

      if (!receiverContactExists) {
        await Contact.create({
          owner: receiverId,
          contactUser: senderId,
        });
      }
    }

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "-password")
      .populate("chat")
      .populate("group")
      .populate("replyTo.senderId", "userName profileImage");

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({
      $or: [{ chat: chatId }, { group: chatId }],
      deletedFor: {
        $ne: req.user.id,
      },
    })
      .populate("sender", "userName profileImage")
      .populate("replyTo.senderId", "userName profileImage")
      .sort({
        createdAt: 1,
      });

    return successResponse(
      res,
      200,
      true,
      "Messages fetched successfully",
      messages,
    );
  } catch (error) {
    next(error);
  }
};

const markMessageSeen = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findByIdAndUpdate(
      messageId,
      {
        $addToSet: {
          seenBy: userId,
        },
      },
      {
        new: true,
      },
    )
      .populate("sender", "-password")
      .populate("chat")
      .populate("group");

    if (message.group) {
      const group = await Group.findById(message.group);

      const unread = group.unreadCounts.find(
        (u) => u.user.toString() === userId,
      );

      if (unread) {
        unread.count = 0;
        await group.save();
      }
    }

    const roomId = message.chat?._id || message.group?._id;

    getIO().to(roomId.toString()).emit("message-seen", message);

    getIO().emit("groups-updated");

    return successResponse(res, 200, "Message marked as seen", message);
  } catch (error) {
    next(error);
  }
};

const editMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    message.text = text;
    message.edited = true;

    await message.save();

    const updatedMessage = await Message.findById(message._id).populate(
      "sender",
      "userName profileImage",
    );

    const io = getIO();

    const roomId = updatedMessage.chat || updatedMessage.group;

    io.to(roomId.toString()).emit("message-edited", updatedMessage);

    return res.status(200).json({
      success: true,
      message: "Message updated",
      data: updatedMessage,
    });
  } catch (err) {
    next(err);
  }
};

const deleteForEveryone = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    const userId = req.user.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    message.deletedForEveryone = true;

    await message.save();

    const roomId = message.chat || message.group;

    getIO().to(roomId.toString()).emit("message-deleted", {
      messageId: message._id,
    });

    return successResponse(res, 200, "Deleted", message);
  } catch (error) {
    next(error);
  }
};

const deleteForMe = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    const userId = req.user.id;

    const message = await Message.findByIdAndUpdate(
      messageId,
      {
        $addToSet: {
          deletedFor: userId,
        },
      },
      {
        new: true,
      },
    );

    const roomId = message.chat || message.group;

    getIO().to(roomId.toString()).emit("message-deleted-for-me", {
      messageId: message._id,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Message deleted for you",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

const toggleReaction = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;

    const userId = req.user.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    const existingReaction = message.reactions.find(
      (reaction) => reaction.user.toString() === userId,
    );

    if (existingReaction) {
      if (existingReaction.emoji === emoji) {
        message.reactions = message.reactions.filter(
          (reaction) => reaction.user.toString() !== userId,
        );
      } else {
        existingReaction.emoji = emoji;
      }
    } else {
      message.reactions.push({
        user: userId,
        emoji,
      });
    }

    await message.save();

    const updatedMessage = await Message.findById(message._id)
      .populate("sender", "userName profileImage")
      .populate("reactions.user", "userName profileImage");

    const roomId = message.chat || message.group;

    getIO().to(roomId.toString()).emit("message-reaction-updated", {
      messageId: message._id,
      reactions: updatedMessage.reactions,
    });

    return res.status(200).json({
      success: true,
      message: "Reaction updated",
      data: updatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

export {
  sendMessage,
  getMessages,
  markMessageSeen,
  editMessage,
  deleteForEveryone,
  deleteForMe,
  toggleReaction,
};
