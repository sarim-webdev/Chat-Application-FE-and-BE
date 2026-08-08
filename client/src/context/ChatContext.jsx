import { createContext, useContext, useEffect } from "react";
import socket from "../socket/socket";
import useAuth from "../hooks/useAuth";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();

  useEffect(() => {
  if (!user?._id) return;

  socket.connect();

  socket.emit("user-online", user._id);

  return () => {
    socket.off("connect");
    socket.off("disconnect");
  };
}, [user]);

  return (
    <ChatContext.Provider value={{ socket }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);