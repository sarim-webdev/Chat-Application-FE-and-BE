import { useState, useRef, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { BsCheck2, BsCheck2All } from "react-icons/bs";
import ReactionPicker from "../Reaction/ReactionPicker";
import ReactionBar from "../Reaction/ReactionBar";
import {
  editMessage,
  deleteForEveryone,
  deleteForMe,
} from "../../services/messageService";
import VoicePlayer from "../Voice/VoicePlayer";
import FileMessage from "../File/FileMessage";


function GroupMessage({ message, setReplyMessage }) {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [text, setText] = useState(message.text);
  const menuRef = useRef(null);

  const handleSave = async () => {
    try {
      await editMessage(message._id, text);

      setEditing(false);
      setShowMenu(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteEveryone = async () => {
    try {
      await deleteForEveryone(message._id);

      setShowMenu(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteForMe = async () => {
    try {
      await deleteForMe(message._id);

      setShowMenu(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReactionAdded = () => {
    setShowReactionPicker(false);
  };

  const isMe = message.sender?._id === user?._id;

  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, []);

  useEffect(() => {
    setText(message.text);
  }, [message.text]);

  return (
    <div className={`flex group ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[70%] rounded-2xl px-4 py-2 ${isMe ? "bg-blue-600 text-white" : "bg-[#1F2937] text-white"
          }`}
      >
        {!message.deletedForEveryone && (
          <div
            ref={menuRef}
            className={`absolute top-1 ${isMe ? "right-1" : "left-1"}`}
          >
            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();

                if (window.innerHeight - rect.bottom < 170) {
                  setOpenUp(true);
                } else {
                  setOpenUp(false);
                }

                setShowMenu(!showMenu);
              }}
              className={`block text-lg leading-none hover:opacity-100 transition`}
            >
              ⋮
            </button>

            <button
              onClick={() => setShowReactionPicker(!showReactionPicker)}
              className={`absolute ${isMe ? "-left-2" : "-right-2"
                } top-2 mt-2 hover:opacity-100 transition`}
            >
              😊
            </button>

            {showReactionPicker && (
              <ReactionPicker
                messageId={message._id}
                isMine={isMe}
                onReactionAdded={handleReactionAdded}
                onClose={() => setShowReactionPicker(false)}
              />
            )}

            {showMenu && (
              <div
                className={`absolute w-48 rounded-xl overflow-hidden bg-[#111827] border border-gray-700 shadow-2xl z-50 ${isMe ? "right-0" : "left-0"
                  } ${openUp ? "bottom-8" : "top-8"}`}
              >
                {isMe && (
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
                      onClick={handleDeleteEveryone}
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
                  onClick={handleDeleteForMe}
                  className="w-full text-left px-3 py-2 text-sm transition hover:bg-red-500"
                >
                  🚫 Delete For Me
                </button>
              </div>
            )}
          </div>
        )}

        {!isMe && (
          <p className="text-xs text-green-400 font-semibold mb-1">
            {message.sender?.userName}
          </p>
        )}


        {message.image && (
          <img
            src={message.image}
            alt=""
            className="rounded-xl mb-2 max-h-64 object-cover"
          />
        )}

        {!message.deletedForEveryone && message.voice && (
          <div className="mt-2">
            <VoicePlayer
              audioUrl={message.voice}
              duration={message.voiceDuration}
            />
          </div>
        )}

        {editing ? (
          <>
            <input
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
        ) : message.deletedForEveryone ? (
          <p className="italic text-gray-300">This message was deleted</p>
        ) : (
          <>

            {message.replyTo?.message && (
              <div className="mb-2 border-l-2 border-blue-400 pl-2">
                <p className="text-xs text-blue-300 font-semibold">
                  {message.replyTo.senderName}
                </p>

                {message.replyTo.type === "text" && (
                  <p className="text-xs text-gray-200 truncate">
                    {message.replyTo.text}
                  </p>
                )}

                {message.replyTo.type === "image" && (
                  <p className="text-xs text-gray-200">
                    📷 Image
                  </p>
                )}

                {message.replyTo.type === "file" && (
                  <p className="text-xs text-gray-200">
                    📎 File
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
              </div>
            )}
            {message.text && (
              <p className="break-words text-sm">{message.text}</p>
            )}

            {message.file?.url && (
              <FileMessage file={message.file} />
            )}

            {message.edited && (
              <span className="text-[10px] italic text-gray-300">edited</span>
            )}
          </>
        )}

        {message.reactions?.length > 0 && (
          <ReactionBar reactions={message.reactions} />
        )}
        <div className="flex items-center justify-end gap-1 mt-2">
          <span className="text-[10px] text-gray-300">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isMe &&
            !message.deletedForEveryone &&
            (message.seenBy?.length > 1 ? (
              <BsCheck2All size={15} className="text-sky-400" />
            ) : (
              <BsCheck2 size={15} className="text-slate-300" />
            ))}
        </div>
      </div>
    </div>
  );
}

export default GroupMessage;
