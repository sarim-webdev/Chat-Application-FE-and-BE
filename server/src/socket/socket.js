import { Server } from "socket.io";
import { User } from "../models/userSchema.js";

let io;
const onlineUsers = new Map();
const activeChats = new Map();
const activeGroups = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://chat-application-fe-and-be.vercel.app",
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("user-online", async (userId) => {
      socket.userId = userId;

      onlineUsers.set(userId, socket.id);

      await User.findByIdAndUpdate(userId, {
        isOnline: true,
      });

      socket.broadcast.emit("user-status-change", {
        userId,
        isOnline: true,
      });
    });

    socket.on("join-chat", (chatId) => {
      socket.join(chatId);

      if (socket.userId) {
        activeChats.set(socket.userId, chatId);
      }
    });

    socket.on("leave-chat", (chatId) => {
      socket.leave(chatId);

      if (socket.userId) {
        activeChats.delete(socket.userId);
      }
    });

    socket.on("send-message", (messageData) => {
      const room = io.sockets.adapter.rooms.get(messageData.chat);

      io.to(messageData.chat).emit("receive-message", messageData);
    });

    socket.on("typing", (data) => {
      socket.to(data.chatId).emit("user-typing", data.userName);
    });

    socket.on("stop-typing", (chatId) => {
      socket.to(chatId).emit("stop-typing");
    });

    socket.on("edit-message", (message) => {
      io.to(message.chat._id).emit("message-edited", message);
    });

    socket.on("delete-message", (data) => {
      io.to(data.chatId).emit("message-deleted", data);
    });

    socket.on("delete-message-for-me", (data) => {
      io.to(data.chatId).emit("message-deleted-for-me", {
        messageId: data.messageId,
        userId: data.userId,
      });
    });

    socket.on("message-reaction", (data) => {
      io.to(data.chatId).emit("message-reaction-updated", {
        messageId: data.messageId,
        reactions: data.reactions,
      });
    });

    socket.on("join-group", (groupId) => {
      socket.join(groupId);

      if (socket.userId) {
        activeGroups.set(socket.userId, groupId);
      }
    });

    socket.on("leave-group", (groupId) => {
      socket.leave(groupId);

      if (socket.userId) {
        activeGroups.delete(socket.userId);
      }
    });

    socket.on("send-group-message", (messageData) => {
      io.to(messageData.group).emit("receive-group-message", messageData);
    });

    socket.on("group-typing", (data) => {
      socket.to(data.groupId).emit("group-user-typing", data.userName);
    });

    socket.on("group-stop-typing", (groupId) => {
      socket.to(groupId).emit("group-stop-typing");
    });

    socket.on("edit-group-message", (message) => {
      io.to(message.group._id).emit("group-message-edited", message);
    });

    socket.on("delete-group-message", (data) => {
      io.to(data.groupId).emit("group-message-deleted", data);
    });

    socket.on("group-message-seen", (message) => {
      io.to(message.group._id).emit("group-message-seen", message);
    });

    socket.on("call-user", ({ to, offer, caller }) => {
      const receiverSocket = onlineUsers.get(to);

      if (!receiverSocket) {
        io.to(socket.id).emit("user-offline");
        return;
      }

      io.to(receiverSocket).emit("incoming-call", {
        caller,
        offer,
      });
    });

    socket.on("answer-call", ({ to, answer }) => {
      const callerSocket = onlineUsers.get(to);

      if (callerSocket) {
        io.to(callerSocket).emit("call-answered", {
          answer,
        });
      }
    });

    socket.on("ice-candidate", ({ to, candidate }) => {
      const targetSocket = onlineUsers.get(to);

      if (targetSocket) {
        io.to(targetSocket).emit("ice-candidate", {
          candidate,
        });
      }
    });

    socket.on("reject-call", ({ to }) => {
      const callerSocket = onlineUsers.get(to);

      if (callerSocket) {
        io.to(callerSocket).emit("call-rejected");
      }

      socket.emit("call-ended");
    });

    socket.on("end-call", ({ to }) => {
      const targetSocket = onlineUsers.get(to);

      if (targetSocket) {
        io.to(targetSocket).emit("call-ended");
      }

      socket.emit("call-cleanup");
    });

    socket.on("disconnect", async () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        activeChats.delete(socket.userId);
        activeGroups.delete(socket.userId);
        await User.findByIdAndUpdate(socket.userId, {
          isOnline: false,
          lastSeen: new Date(),
        });

        socket.broadcast.emit("user-status-change", {
          userId: socket.userId,
          isOnline: false,
          lastSeen: new Date(),
        });
      }
    });
  });
  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

export { initSocket, getIO, onlineUsers, activeChats, activeGroups };
