import { User } from "../models/userSchema.js";
import { Chat } from "../models/chatSchema.js";
import { Contact } from "../models/contactSchema.js";
import { Message } from "../models/messageSchema.js";

const addContact = async (req, res, next) => {
  try {
    const { email } = req.body;
    const ownerId = req.user.id;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user._id.toString() === ownerId) {
      return res.status(400).json({
        success: false,
        message: "You cannot add yourself",
      });
    }

    const exists = await Contact.findOne({
      owner: ownerId,
      contactUser: user._id,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Contact already exists",
      });
    }

    const chat = await Chat.create({
      participants: [ownerId, user._id],
    });

    const contact1 = await Contact.create({
      owner: ownerId,
      contactUser: user._id,
      chatId: chat._id,
    });

    const contact2 = await Contact.create({
      owner: user._id,
      contactUser: ownerId,
      chatId: chat._id,
    });

    return res.status(201).json({
      success: true,
      message: "Contact added successfully",
      data: {
        contact1,
        contact2,
        chat,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({
      owner: req.user.id,
    })
      .populate("contactUser", "-password")
      .populate("chatId");

    const contactsWithData = await Promise.all(
      contacts.map(async (contact) => {
        const lastMessage = await Message.findOne({
          chat: contact.chatId._id,
        })
          .sort({ createdAt: -1 })
          .populate("sender", "userName");

        const unreadCount = await Message.countDocuments({
          chat: contact.chatId._id,
          sender: { $ne: req.user.id },
          seenBy: { $ne: req.user.id },
        });

        return {
          ...contact.toObject(),
          lastMessage,
          unreadCount,
        };
      }),
    );

    res.json({
      success: true,
      data: contactsWithData,
    });
  } catch (error) {
    next(error);
  }
};

export { addContact, getContacts };
