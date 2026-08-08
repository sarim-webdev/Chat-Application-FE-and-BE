import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    voice: {
      type: String,
      default: "",
    },

    voiceDuration: {
      type: Number,
      default: 0,
    },

    replyTo: {
      message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null,
      },

      text: {
        type: String,
        default: "",
      },

      image: {
        type: String,
        default: "",
      },

      voice: {
        type: String,
        default: "",
      },

      voiceDuration: {
        type: Number,
        default: 0,
      },

      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      senderName: {
        type: String,
        default: "",
      },

      type: {
        type: String,
        enum: ["text", "image", "voice", "file"],
        default: "text",
      },
      file: {
        url: {
          type: String,
          default: "",
        },

        originalName: {
          type: String,
          default: "",
        },

        mimeType: {
          type: String,
          default: "",
        },

        extension: {
          type: String,
          default: "",
        },
      },
    },

    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        emoji: {
          type: String,
          required: true,
        },
      },
    ],
    edited: {
      type: Boolean,
      default: false,
    },
    file: {
      url: {
        type: String,
        default: "",
      },

      originalName: {
        type: String,
        default: "",
      },

      fileName: {
        type: String,
        default: "",
      },

      mimeType: {
        type: String,
        default: "",
      },

      size: {
        type: Number,
        default: 0,
      },

      extension: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    deletedForEveryone: {
      type: Boolean,
      default: false,
    },
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model("Message", messageSchema);

export { Message };
