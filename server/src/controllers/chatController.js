import { Chat } from "../models/chatSchema.js";
import { successResponse } from "../reponseHandler/successResponse.js";

const createChat = async (req, res, next) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    const existingChat = await Chat.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    if (existingChat) {
      return successResponse(res, 200, "Chat already exists", existingChat);
    }

    const chat = await Chat.create({
      participants: [senderId, receiverId],
    });

    return successResponse(res, 201, "Chat created successfully", chat);
  } catch (error) {
    next(error);
  }
};

const getChats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    return successResponse(res, 200, "Chats fetched successfully", chats);
  } catch (error) {
    next(error);
  }
};

const getChatById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const chat = await Chat.findById(id)
      .populate("participants", "-password")
      .populate("lastMessage");

    if (!chat) {
      throw new Error("Chat not found");
    }

    return successResponse(res, 200, "Chat fetched successfully", chat);
  } catch (error) {
    next(error);
  }
};

export { createChat, getChats, getChatById };
