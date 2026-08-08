import { useEffect, useRef, useState } from "react";
import {
  editMessage,
  deleteForEveryone,
  deleteForMe,
} from "../../services/messageService";
import { useChat } from "../../context/ChatContext";
import { BsCheck2, BsCheck2All } from "react-icons/bs";
import VoicePlayer from "../Voice/VoicePlayer";
import FileMessage from "../File/FileMessage";
import ReactionPicker from "../Reaction/ReactionPicker";
import ReactionBar from "../Reaction/ReactionBar";

function Message({ message, user, setMessages, setReplyMessage }) {

  const senderId =
    typeof message.sender === "object" ? message.sender._id : message.sender;

  const isMine = senderId === user?._id;
  const { socket } = useChat();

  const [editing, setEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [text, setText] = useState(message.text);

  const inputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();

      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length,
      );
    }
  }, [editing]);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSave = async () => {
    if (text.trim() === "") return;

    try {
      const res = await editMessage(message._id, text);

      setMessages((prev) =>
        prev.map((msg) => (msg._id === message._id ? res.data.data : msg)),
      );

      setEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteEveryone = async () => {
    const confirmDelete = window.confirm("Delete message for everyone?");

    if (!confirmDelete) return;

    try {
      await deleteForEveryone(message._id);

      socket.emit("delete-message", {
        messageId: message._id,
        chatId:
          typeof message.chat === "object" ? message.chat._id : message.chat,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === message._id
            ? {
              ...msg,
              deletedForEveryone: true,
              text: "",
            }
            : msg,
        ),
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteForMe = async () => {
    const confirmDelete = window.confirm("Delete message for you?");

    if (!confirmDelete) return;

    try {
      await deleteForMe(message._id);

      socket.emit("delete-message-for-me", {
        messageId: message._id,

        chatId:
          typeof message.chat === "object" ? message.chat._id : message.chat,

        userId: user._id,
      });

      setMessages((prev) => prev.filter((msg) => msg._id !== message._id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleReactionAdded = (updatedMessage) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === updatedMessage._id ? updatedMessage : msg,
      ),
    );

    socket.emit("message-reaction", {
      chatId:
        typeof updatedMessage.chat === "object"
          ? updatedMessage.chat._id
          : updatedMessage.chat,

      messageId: updatedMessage._id,
      reactions: updatedMessage.reactions,
    });
  };

  return (
    <>
      <div
        id={message._id}
        className={`flex group ${isMine ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`relative max-w-[70%] sm:max-w-[65%] rounded-2xl px-4 py-2
    ${isMine
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-white/10 text-white rounded-bl-sm"
            }`}
        >
          {!editing && !message.deletedForEveryone && (
            <div
              ref={menuRef}
              className={`absolute top-2 ${isMine ? "right-1" : "left-1"}`}
            >
              <button
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();

                  if (window.innerHeight - rect.bottom < 180) {
                    setOpenUp(true);
                  } else {
                    setOpenUp(false);
                  }

                  setShowMenu(!showMenu);
                }}
                className="block text-lg leading-none"
              >
                ⋮
              </button>

              <button
                onClick={() => setShowReactionPicker(!showReactionPicker)}
                className={`absolute ${isMine ? "-left-2" : "-right-2"
                  } top-2 opacity-100 transition mt-2`}
              >
                😊
              </button>

              {showReactionPicker && (
                <ReactionPicker
                  messageId={message._id}
                  isMine={isMine}
                  onReactionAdded={handleReactionAdded}
                  onClose={() => setShowReactionPicker(false)}
                />
              )}

              {showMenu && (
                <div
                  className={`absolute w-48 rounded-xl overflow-hidden bg-[#111827] border border-gray-700 shadow-2xl z-50 ${isMine ? "right-0" : "left-0"
                    } ${openUp ? "bottom-8" : "top-8"}`}
                >
                  {isMine && (
                    <>
                      <button
                        onClick={() => {
                          setEditing(true);
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm transition hover:bg-blue-600"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => {
                          setShowMenu(false);
                          handleDeleteEveryone();
                        }}
                        className="w-full text-left px-3 py-2 text-sm transition hover:bg-red-600"
                      >
                        🚫 Delete For Everyone
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      setReplyMessage(message);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm transition hover:bg-blue-600"
                  >
                    ↩️ Reply
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleDeleteForMe();
                    }}
                    className="w-full text-left px-3 py-2 text-sm transition hover:bg-red-500"
                  >
                    🚫 Delete For Me
                  </button>
                </div>
              )}
            </div>
          )}

          {!isMine && (
            <p className="text-xs text-gray-300 mb-1">
              {message.sender?.userName}
            </p>
          )}

          {editing ? (
            <>
              <input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded px-2 py-1 text-black outline-none"
              />

              <div className="flex justify-end gap-2 mt-2">
                <button onClick={handleSave} className="text-green-300 text-xs">
                  Save
                </button>

                <button
                  onClick={() => {
                    setEditing(false);
                    setText(message.text);
                  }}
                  className="text-red-300 text-xs"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              {message.deletedForEveryone ? (
                <p className="italic text-gray-300">This message was deleted</p>
              ) : (
                <>
                  {message.image && (
                    <img
                      src={message.image}
                      alt="message"
                      onClick={() => setShowImage(true)}
                      className="mt-2 rounded-lg cursor-pointer max-w-[220px] hover:opacity-90 transition"
                    />
                  )}

                  {message.replyTo && (
                    <div className="mb-2 border-l-2 border-blue-400 pl-2">
                      <p className="text-xs text-blue-300 font-semibold">
                        {message.replyTo.senderName}
                      </p>

                      {/* Text Reply */}
                      {message.replyTo.type === "text" && (
                        <p className="text-xs text-gray-200 truncate">
                          {message.replyTo.text}
                        </p>
                      )}

                      {/* Image Reply */}
                      {message.replyTo.type === "image" && (
                        <p className="text-xs text-gray-200">
                          📷 Image
                        </p>
                      )}

                      {/* Voice Reply */}
                      {message.replyTo.type === "voice" && (
                        <div className="flex items-center gap-2 text-xs text-gray-200">
                          <span>🎤 Voice</span>

                          <span className="text-[11px] text-gray-400">
                            {Math.floor(message.replyTo.voiceDuration / 60)}:
                            {(message.replyTo.voiceDuration % 60)
                              .toString()
                              .padStart(2, "0")}
                          </span>
                        </div>
                      )}

                      {message.replyTo.type === "file" && (
                        <p className="text-xs text-gray-200">
                          📎 File
                        </p>
                      )}
                    </div>
                  )}

                  {message.text && <p>{message.text}</p>}

                  {message.file?.url && (
                    <FileMessage file={message.file} />
                  )}

                  {!message.deletedForEveryone && message.voice && (
                    <div className="mt-2">
                      <VoicePlayer
                        audioUrl={message.voice}
                        duration={message.voiceDuration}
                      />
                    </div>
                  )}

                  {message.reactions?.length > 0 && (
                    <div className="relative overflow-visible">
                      <ReactionBar reactions={message.reactions} />
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-end items-center gap-1 mt-1">
                <span className="text-[10px] text-gray-300">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {isMine &&
                  !message.deletedForEveryone &&
                  (message.seenBy?.length > 0 ? (
                    <BsCheck2All size={15} className="text-sky-300" />
                  ) : (
                    <BsCheck2 size={15} className="text-slate-200" />
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
      {showImage && (
        <div
          onClick={() => setShowImage(false)}
          className="fixed inset-0 bg-black/90 flex justify-center items-center z-[9999]"
        >
          <img
            src={message.image}
            alt="Full"
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[90vh] rounded-lg"
          />

          <button
            onClick={() => setShowImage(false)}
            className="absolute top-5 right-5 text-white text-4xl"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}

export default Message;
