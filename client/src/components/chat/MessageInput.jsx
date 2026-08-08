import { useRef, useState } from "react";
import API from "../../services/api";
import { useChat } from "../../context/ChatContext";
import VoiceRecorder from "../Voice/VoiceRecorder";
import FileUploader from "../File/FileUploader";
import FilePreview from "../File/FilePreview";
import useAuth from "../../hooks/useAuth";

import EmojiPicker from "emoji-picker-react";

import {
  BsEmojiSmile,
  BsImage,
  BsMicFill,
} from "react-icons/bs";

import { FaPaperPlane } from "react-icons/fa";

function MessageInput({ chat, replyMessage, setReplyMessage }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sending, setSending] = useState(false);
  const fileRef = useRef(null);

  const { socket } = useChat();
  const { user } = useAuth();

  const sendMessage = async () => {
    if (!text.trim() && !image && !file) return;

    setSending(true);

    try {
      const formData = new FormData();

      formData.append("chat", chat);
      formData.append("text", text);

      if (replyMessage) {
        formData.append(
          "replyTo",
          JSON.stringify({
            message: replyMessage._id,
            text: replyMessage.text,
            image: replyMessage.image || "",
            voice: replyMessage.voice || "",
            voiceDuration: replyMessage.voiceDuration || 0,
            senderId: replyMessage.sender._id,
            senderName: replyMessage.sender.userName,
            file: replyMessage.file || {},
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

      socket.emit("send-message", {
        ...newMessage,
        chat:
          typeof newMessage.chat === "object"
            ? newMessage.chat._id
            : newMessage.chat,
      });

      setText("");
      setImage(null);
      setFile(null);
      setPreview("");
      setReplyMessage(null);
      setShowVoiceRecorder(false);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);

    socket.emit("typing", {
      chatId: chat,
      userName: user.userName,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="border-t border-white/10 bg-[#111827] p-2 sm:p-3 md:p-4 lg:p-5">

      {preview && (
        <div className="mb-3 sm:mb-4 md:mb-5 relative inline-block">
          <img
            src={preview}
            alt="preview"
            className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-xl sm:rounded-2xl object-cover border border-white/10"
          />
          <button
            onClick={() => {
              setImage(null);
              setPreview("");
              if (fileRef.current) {
                fileRef.current.value = "";
              }
            }}
            className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-red-600 hover:bg-red-700 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full text-white text-xs sm:text-sm flex items-center justify-center shadow-lg shadow-red-600/20"
          >
            ×
          </button>
        </div>
      )}

      {showVoiceRecorder && (
        <div className="mb-3 sm:mb-4 md:mb-5">
          <VoiceRecorder
            chat={chat}
            replyMessage={replyMessage}
            setReplyMessage={setReplyMessage}
            onClose={() => setShowVoiceRecorder(false)}
            onVoiceSent={(newMessage) => {
              socket.emit("send-message", {
                ...newMessage,
                chat:
                  typeof newMessage.chat === "object"
                    ? newMessage.chat._id
                    : newMessage.chat,
              });

              setReplyMessage(null);
              setShowVoiceRecorder(false);
            }}
          />
        </div>
      )}

      {replyMessage && (
        <div className="mb-3 p-3 bg-gray-800 rounded-xl flex justify-between items-center">

          <div>
            <p className="text-sm text-blue-400">
              Replying to {replyMessage.sender?.userName}
            </p>

            <p className="text-gray-300 text-sm">
              {replyMessage.text ||
                (replyMessage.image && "📷 Image") ||
                (replyMessage.voice && "🎤 Voice")}
            </p>
          </div>


          <button
            onClick={() => setReplyMessage(null)}
            className="text-red-400"
          >
            ✕
          </button>

        </div>
      )}

      {file && (
        <div className="mb-3">
          <FilePreview
            file={file}
            onRemove={() => {
              setFile(null);

              if (fileRef.current) {
                fileRef.current.value = "";
              }
            }}
          />
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">

        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition text-lg sm:text-xl md:text-2xl text-gray-300"
          >
            <BsEmojiSmile />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-12 sm:bottom-14 left-0 z-50">
              <div className="scale-75 sm:scale-90 md:scale-100 origin-bottom-left">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            </div>
          )}
        </div>

        <input
          hidden
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleImage}
        />

        <button
          onClick={() => fileRef.current?.click()}
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition text-lg sm:text-xl md:text-2xl text-gray-300 flex-shrink-0"
        >
          <BsImage />
        </button>

        <FileUploader
          onFileSelect={setFile}
        />

        {!showVoiceRecorder && (
          <button
            onClick={() => setShowVoiceRecorder(true)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition text-lg sm:text-xl md:text-2xl text-gray-300 hover:text-green-400 flex-shrink-0"
          >
            <BsMicFill />
          </button>
        )}

        <input
          value={text}
          onChange={handleTyping}
          disabled={showVoiceRecorder}
          placeholder={showVoiceRecorder ? "Recording..." : "Type a message..."}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          className={`flex-1 min-w-[60px] h-10 sm:h-12 md:h-13 lg:h-14 px-3 sm:px-4 md:px-5 lg:px-6 rounded-full border border-white/10 outline-none text-[13px] sm:text-[14px] md:text-[15px] transition-all duration-300 ${showVoiceRecorder
            ? "bg-white/5 cursor-not-allowed text-gray-400"
            : "bg-[#1F2937] focus:border-blue-500"
            }`}
        />

        <button
          onClick={sendMessage}
          disabled={showVoiceRecorder || sending}
          className={`w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${showVoiceRecorder || sending
            ? "bg-gray-600 cursor-not-allowed opacity-70"
            : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20"
            }`}
        >
          {sending ? (
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FaPaperPlane className="text-xs sm:text-sm md:text-base lg:text-lg text-white" />
          )}
        </button>

      </div>
    </div>
  );
}

export default MessageInput;