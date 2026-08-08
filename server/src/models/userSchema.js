import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    userName: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    profileImage: String,
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export { User };
