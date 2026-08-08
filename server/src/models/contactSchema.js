import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  contactUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Contact = mongoose.model("contacts", contactSchema);
