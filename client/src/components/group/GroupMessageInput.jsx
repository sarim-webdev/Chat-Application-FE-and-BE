import { useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";

import {
  BsEmojiSmile,
  BsImage,
  BsMicFill,
} from "react-icons/bs";

import { FaPaperPlane } from "react-icons/fa";
import VoiceRecorder from "../Voice/VoiceRecorder";
import FileUploader from "../File/FileUploader";
import FilePreview from "../File/FilePreview";

function GroupMessageInput({
  groupId,
  onSend,
  onSendVoice,
  replyMessage,
  setReplyMessage,
  loading = false,
}) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

  const fileRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim() && !image && !file) return;

    onSend({
      text,
      image,
      file,
      replyMessage
    });

    setText("");
    setImage(null);
    setFile(null);
    setPreview("");
    setReplyMessage(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
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
    <form
      onSubmit={handleSubmit}
      className="border-t border-white/10 bg-[#111827] p-2 sm:p-3 md:p-4 lg:p-5"
    >
      {preview && (
        <div className="mb-3 sm:mb-4 md:mb-5 relative inline-block">
          <img
            src={preview}
            alt="preview"
            className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-xl sm:rounded-2xl object-cover border border-white/10"
          />
          <button
            type="button"
            onClick={() => {
              setImage(null);
              setPreview("");
              if (fileRef.current) {
                fileRef.current.value = "";
              }
            }}
            className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-red-600 hover:bg-red-700 active:bg-red-800 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full text-white text-xs sm:text-sm flex items-center justify-center shadow-lg shadow-red-600/20"
          >
            ×
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

      {showVoiceRecorder && (
        <div className="mb-3 sm:mb-4">
          <VoiceRecorder
            chat={groupId}
            replyMessage={replyMessage}
            setReplyMessage={setReplyMessage}
            onVoiceSent={(message) => {
              if (onSendVoice) {
                onSendVoice(message);
              }
              setShowVoiceRecorder(false);
              setReplyMessage(null);
            }}
          />
        </div>
      )}

      {replyMessage && (
        <div className="mb-3 flex items-center justify-between bg-[#1F2937] p-2 rounded-lg">
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
            type="button"
            onClick={() => setReplyMessage(null)}
            className="text-red-400"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">

        <div className="relative flex-shrink-0">
          <button
            type="button"
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
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition text-lg sm:text-xl md:text-2xl text-gray-300 flex-shrink-0"
        >
          <BsImage />
        </button>

        <FileUploader
          onFileSelect={setFile}
        />

        <button
          type="button"
          onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
          className={`w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition text-lg sm:text-xl md:text-2xl flex-shrink-0 ${showVoiceRecorder
            ? "bg-green-600 text-white hover:bg-green-700 active:bg-green-800"
            : "hover:bg-white/10 active:bg-white/20 text-gray-300 hover:text-green-400"
            }`}
        >
          <BsMicFill />
        </button>

        <input
          type="text"
          value={text}
          placeholder={showVoiceRecorder ? "Recording..." : "Type a message..."}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          className={`flex-1 min-w-[60px] h-10 sm:h-12 md:h-13 lg:h-14 px-3 sm:px-4 md:px-5 lg:px-6 rounded-full border border-white/10 outline-none text-[13px] sm:text-[14px] md:text-[15px] transition-all duration-300 ${showVoiceRecorder
            ? "bg-white/5 cursor-not-allowed text-gray-400"
            : "bg-[#1F2937] focus:border-blue-500"
            }`}
          disabled={showVoiceRecorder}
        />

        <button
          type="submit"
          disabled={loading || showVoiceRecorder}
          className={`w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${loading || showVoiceRecorder
            ? "bg-gray-600 cursor-not-allowed opacity-50"
            : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20"
            }`}
        >
          {loading ? (
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <FaPaperPlane className="text-xs sm:text-sm md:text-base lg:text-lg text-white" />
          )}
        </button>

      </div>
    </form>
  );
}

export default GroupMessageInput;