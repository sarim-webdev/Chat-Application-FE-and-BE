import mongoose from "mongoose";

const groupSchema = mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
      trim: true,
    },
    groupImage: {
      type: String,
      default: "",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    description: {
      type: String,
      default: "",
    },

    isGroup: {
      type: Boolean,
      default: true,
    },
    unreadCounts: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        count: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true },
);

const Group = mongoose.model("Group", groupSchema);

export { Group };
