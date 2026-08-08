import { useEffect, useState, useRef } from "react";
import useAuth from "../../hooks/useAuth";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import API from "../../services/api";
import { useChat } from "../../context/ChatContext";
import { FaPhone } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { useCall } from "../../context/CallContext";

function ChatWindow({ chat, fetchContacts }) {
  const { user } = useAuth();
  const { socket } = useChat();
  const { startCall } = useCall();

  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);

  const [chatUser, setChatUser] = useState(chat?.contactUser || null);
  const bottomRef = useRef(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/message/${chat._id}`);

      const msgs = res.data.data;

      setMessages(Array.isArray(msgs) ? msgs : []);

      if (res.data.chatUser) {
        setChatUser(res.data.chatUser);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!socket || !chat?._id) return;

    socket.emit("join-chat", chat._id);

    return () => {
      socket.emit("leave-chat", chat._id);
    };
  }, [socket, chat?._id]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message) => {
      setMessages((prev) => {
        const alreadyExists = prev.some((msg) => msg._id === message._id);

        if (alreadyExists) {
          return prev;
        }

        return [...prev, message];
      });
    };

    socket.on("receive-message", handleMessage);

    return () => {
      socket.off("receive-message", handleMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleReaction = (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId
            ? {
              ...msg,
              reactions: data.reactions,
            }
            : msg,
        ),
      );
    };

    socket.on("message-reaction-updated", handleReaction);

    return () => {
      socket.off("message-reaction-updated", handleReaction);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleDeleteForMe = (data) => {
      if (data.userId !== user._id) return;

      setMessages((prev) => prev.filter((msg) => msg._id !== data.messageId));
    };

    socket.on("message-deleted-for-me", handleDeleteForMe);

    return () => {
      socket.off("message-deleted-for-me", handleDeleteForMe);
    };
  }, [socket, user]);

  useEffect(() => {
    if (!socket) return;

    const handleDelete = (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId
            ? {
              ...msg,
              deletedForEveryone: true,
              text: "",
            }
            : msg,
        ),
      );
    };

    socket.on("message-deleted", handleDelete);

    return () => {
      socket.off("message-deleted", handleDelete);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleEdit = (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg,
        ),
      );
    };

    socket.on("message-edited", handleEdit);

    return () => {
      socket.off("message-edited", handleEdit);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleSeen = (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg,
        ),
      );
    };

    socket.on("message-seen", handleSeen);

    return () => {
      socket.off("message-seen", handleSeen);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleTyping = (userName) => {
      setTypingUser(userName);

      setTimeout(() => {
        setTypingUser("");
      }, 1500);
    };

    socket.on("user-typing", handleTyping);

    return () => {
      socket.off("user-typing", handleTyping);
    };
  }, [socket]);

  useEffect(() => {
    if (!messages.length) return;

    const markSeen = async () => {
      try {
        const unseenMessages = messages.filter(
          (msg) =>
            msg.sender?._id !== user?._id && !msg.seenBy?.includes(user?._id),
        );

        if (!unseenMessages.length) return;

        await Promise.all(
          unseenMessages.map((msg) => API.put(`/message/seen/${msg._id}`)),
        );

        fetchContacts();
      } catch (err) {
        console.log(err);
      }
    };

    markSeen();
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (chat?._id) {
      fetchMessages();
    }
  }, [chat?._id]);

  return (
    <div className="h-screen flex flex-col bg-[#0B1120] text-white">
      <div className="px-2 py-2.5 sm:px-4 sm:py-3 md:p-4 border-b border-white/10 bg-white/5 flex items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <img
            src={
              chat.user?.profileImage ||
              `https://ui-avatars.com/api/?name=${chatUser?.userName || "User"}&size=64`
            }
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full object-cover border-2 border-white/20 flex-shrink-0"
            alt="profile"
          />

          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-[11px] sm:text-sm md:text-base truncate leading-tight">
              {chat.user?.userName || "Select Chat"}
            </h2>

            <p className="text-[9px] sm:text-xs md:text-sm text-green-400 flex items-center gap-1 sm:gap-1.5">
              <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full inline-block ${chat.user?.isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></span>
              {chat.user?.isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
          <button
            onClick={() => {
              if (chat?.user) {
                startCall(chat.user);
              }
            }}
            className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-green-600 hover:bg-green-700 active:bg-green-800 flex items-center justify-center transition-colors shadow-lg shadow-green-600/20"
            aria-label="Call"
          >
            <FaPhone className="text-white text-[10px] sm:text-xs md:text-sm" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 sm:px-3 sm:py-3 md:p-4">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 border-3 sm:border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"></div>
            </div>
            <p className="mt-3 sm:mt-4 md:mt-5 text-gray-300 tracking-wide text-[11px] sm:text-sm md:text-base">
              Loading Messages...
            </p>
          </div>
        ) : (
          <>
            <MessageList
              messages={messages}
              user={user}
              setMessages={setMessages}
              setReplyMessage={setReplyMessage}
            />

            {typingUser && (
              <TypingIndicator userName={typingUser} />
            )}

            <div ref={bottomRef} className="h-1"></div>
          </>
        )}
      </div>

      <div className="px-1.5 py-1.5 sm:px-3 sm:py-2 md:p-3 border-t border-white/10 bg-white/5">
        <MessageInput
          chat={chat?._id}
          setMessages={setMessages}
          setTyping={setTypingUser}
          replyMessage={replyMessage}
          setReplyMessage={setReplyMessage}
        />
      </div>
    </div>
  );
}

export default ChatWindow;
