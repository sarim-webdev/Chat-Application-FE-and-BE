import { BsMicFill, BsTrashFill, BsSendFill } from "react-icons/bs";
import { FaStop } from "react-icons/fa";
import useVoiceRecorder from "../../hooks/useVoiceRecorder";
import { sendMessage } from "../../services/messageService";
import RecordingTimer from "./RecordingTimer";
import { useState } from "react";

function VoiceRecorder({ chat, onVoiceSent, replyMessage, setReplyMessage }) {
  const {
    isRecording,
    audioFile,
    audioURL,
    duration,
    startRecording,
    stopRecording,
    resetRecording,
  } = useVoiceRecorder();

  const [sending, setSending] = useState(false);

  const handleSendVoice = async () => {
    if (!audioFile) return;

    try {
      setSending(true);
      const res = await sendMessage(
        chat,
        "",
        null,
        audioFile,
        duration,
        replyMessage?._id
      );

      if (setReplyMessage) {
        setReplyMessage(null);
      }

      if (onVoiceSent) {
        onVoiceSent(res.data);
      }

      resetRecording();
    } catch (error) {
      console.log(error);
      alert("Failed to send voice message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full rounded-xl bg-white/10 p-2.5 sm:p-3 space-y-2.5 sm:space-y-3">

      {isRecording && (
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-red-500 animate-pulse flex-shrink-0"></span>
            <RecordingTimer seconds={duration} />
          </div>

          <button
            onClick={stopRecording}
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 p-2 sm:p-2.5 md:p-3 rounded-full flex-shrink-0 transition shadow-lg shadow-red-600/20"
          >
            <FaStop className="text-white text-xs sm:text-sm md:text-base" />
          </button>
        </div>
      )}

      {!isRecording && audioURL && (
        <div className="space-y-2.5 sm:space-y-3">
          <audio
            controls
            src={audioURL}
            className="w-full h-8 sm:h-10 md:h-12"
          />

          <div className="flex justify-end gap-2 sm:gap-3">
            <button
              onClick={resetRecording}
              className="bg-red-600 hover:bg-red-700 active:bg-red-800 p-2 sm:p-2.5 md:p-3 rounded-full transition shadow-lg shadow-red-600/20"
            >
              <BsTrashFill className="text-white text-xs sm:text-sm md:text-base" />
            </button>

            <button
              onClick={handleSendVoice}
              disabled={sending}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 p-2 sm:p-2.5 md:p-3 rounded-full transition shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <BsSendFill className="text-white text-xs sm:text-sm md:text-base" />
              )}
            </button>
          </div>
        </div>
      )}

      {!isRecording && !audioURL && (
        <div className="flex justify-center">
          <button
            onClick={startRecording}
            className="bg-green-600 hover:bg-green-700 active:bg-green-800 transition-all w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg shadow-green-600/20"
          >
            <BsMicFill
              size={20}
              className="sm:w-[24px] sm:h-[24px] md:w-7 md:h-7 text-white"
            />
          </button>
        </div>
      )}

    </div>
  );
}

export default VoiceRecorder;