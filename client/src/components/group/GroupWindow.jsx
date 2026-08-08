import { useEffect, useRef, useState } from "react";
import API from "../../services/api";
import useAuth from "../../hooks/useAuth";
import useGroup from "../../hooks/useGroup";
import { useChat } from "../../context/ChatContext";
import { markMessageSeen } from "../../services/messageService";
import GroupHeader from "./GroupHeader";
import GroupMessageList from "./GroupMessageList";
import GroupMessageInput from "./GroupMessageInput";
import GroupTypingIndicator from "./GroupTypingIndicator";

function GroupWindow() {
  const { user } = useAuth();

  const { socket } = useChat();

  const {
    selectedGroup,
    groupMessages,
    setGroupMessages,
  } = useGroup();

  const [loading, setLoading] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);

  const [typingUser, setTypingUser] = useState("");

  const bottomRef = useRef(null);

  const fetchMessages = async () => {

    try {
      if (!selectedGroup?._id) {
        console.log("2. selectedGroup missing");
        return;
      }

      setLoading(true);
      setGroupMessages([]);

      const res = await API.get(`/message/${selectedGroup._id}`);

      setGroupMessages(res.data.data || []);

      socket?.emit("groups-updated");

      const unseenMessages = res.data.data.filter(
        (msg) =>
          msg.sender._id !== user._id &&
          !msg.seenBy?.includes(user._id)
      );

      for (const msg of unseenMessages) {
        await markMessageSeen(msg._id);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!socket || !selectedGroup?._id) return;

    socket.emit("join-group", selectedGroup._id);

    return () => {
      socket.emit("leave-group", selectedGroup._id);
    };
  }, [socket, selectedGroup]);


  useEffect(() => {
    if (!socket) return;

    const handleReceive = async (message) => {
      setGroupMessages((prev) => {
        const exists = prev.some((m) => m._id === message._id);

        if (exists) return prev;

        return [...prev, message];
      });

      if (message.sender._id !== user._id) {
        await markMessageSeen(message._id);
      }
    };

    socket.on("receive-group-message", handleReceive);

    return () => {
      socket.off("receive-group-message", handleReceive);
    };
  }, [socket]);


  useEffect(() => {
    fetchMessages();
  }, [selectedGroup]);

  useEffect(() => {
    if (!socket) return;

    const handleSeen = (updatedMessage) => {
      setGroupMessages((prev) =>
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

    const handleMessageEdited = (updatedMessage) => {
      setGroupMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg,
        ),
      );
    };

    socket.on("message-edited", handleMessageEdited);

    return () => {
      socket.off("message-edited", handleMessageEdited);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleDeleteEveryone = ({ messageId }) => {
      setGroupMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? {
              ...msg,
              deletedForEveryone: true,
            }
            : msg,
        ),
      );
    };

    socket.on("message-deleted", handleDeleteEveryone);

    return () => {
      socket.off("message-deleted", handleDeleteEveryone);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleDeleteForMe = ({ messageId, userId }) => {
      if (userId !== user._id) return;

      setGroupMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    };

    socket.on("message-deleted-for-me", handleDeleteForMe);

    return () => {
      socket.off("message-deleted-for-me", handleDeleteForMe);
    };
  }, [socket, user]);

  useEffect(() => {
    if (!socket) return;

    const handleReactionUpdated = ({ messageId, reactions }) => {
      setGroupMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? {
              ...msg,
              reactions,
            }
            : msg,
        ),
      );
    };

    socket.on("message-reaction-updated", handleReactionUpdated);

    return () => {
      socket.off("message-reaction-updated", handleReactionUpdated);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleGroupsUpdated = () => {
      // Home.jsx dubara groups fetch karega
    };

    socket.on("groups-updated", handleGroupsUpdated);

    return () => {
      socket.off("groups-updated", handleGroupsUpdated);
    };
  }, [socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [groupMessages]);

  if (!selectedGroup) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a group to start chatting
      </div>
    );
  }

  const handleSendMessage = async ({ text, image, file, replyMessage }) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("chat", selectedGroup._id);
      formData.append("text", text);

      if (replyMessage) {
        formData.append(
          "replyTo",
          JSON.stringify({
            message: replyMessage._id,
            text: replyMessage.text,
            image: replyMessage.image || "",
            file: replyMessage.file || {},
            voice: replyMessage.voice || "",
            voiceDuration: replyMessage.voiceDuration || 0,
            senderId: replyMessage.sender._id,
            senderName: replyMessage.sender.userName,
            type: replyMessage.image
              ? "image"
              : replyMessage.voice
                ? "voice"
                : replyMessage.file?.url
                  ? "file"
                  : "text",
          })
        );
      }

      if (image) {
        formData.append("image", image);
      }

      if (file) {
        formData.append("file", file);
      }

      const res = await API.post("/message/send", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newMessage = res.data.data;

      setGroupMessages((prev) => [...prev, newMessage]);

      socket.emit("send-group-message", {
        ...newMessage,
        group:
          typeof newMessage.group === "object"
            ? newMessage.group._id
            : newMessage.group,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0B1120]">
      <GroupHeader />

      <div className="flex-1 overflow-y-auto px-2 py-2 sm:px-3 sm:py-3 md:p-4">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border-3 sm:border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"></div>
              </div>
              <p className="mt-3 sm:mt-4 md:mt-5 text-gray-300 tracking-wide text-[11px] sm:text-sm md:text-base">
                Loading Messages...
              </p>
            </div>
          </div>
        ) : (
          <GroupMessageList
            messages={groupMessages}
            currentUser={user}
            setReplyMessage={setReplyMessage}
          />
        )}
      </div>

      {typingUser && <GroupTypingIndicator userName={typingUser} />}

      <div className="px-1.5 py-1.5 sm:px-3 sm:py-2 md:p-3 border-t border-white/10 bg-white/5">
        <GroupMessageInput
          groupId={selectedGroup._id}
          onSend={handleSendMessage}
          loading={loading}
          replyMessage={replyMessage}
          setReplyMessage={setReplyMessage}
          onSendVoice={(voiceMessage) => {
            setGroupMessages((prev) => [...prev, voiceMessage]);
            socket.emit("send-group-message", {
              ...voiceMessage,
              group:
                typeof voiceMessage.group === "object"
                  ? voiceMessage.group._id
                  : voiceMessage.group,
            });
          }}
        />
      </div>
    </div>
  );
}

export default GroupWindow;
