import mongoose from "mongoose";

const callSchema = new mongoose.Schema(
  {
    caller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      default: null,
    },

    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },

    callType: {
      type: String,
      enum: ["audio", "video"],
      default: "audio",
    },

    status: {
      type: String,
      enum: ["initiated", "ringing", "accepted", "rejected", "missed", "ended"],
      default: "initiated",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    duration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Call = mongoose.model("Call", callSchema);

export { Call };
