import { useState } from "react";
import { toggleReaction } from "../../services/messageService";

const emojis = ["❤️", "😂", "👍", "😮", "😢", "🔥"];

function ReactionPicker({
  messageId,
  onReactionAdded,
  onClose,
  isMine,
}) {
  const [loading, setLoading] = useState(false);

  const handleReaction = async (emoji) => {
    try {
      setLoading(true);

      const res = await toggleReaction(messageId, emoji);

      if (onReactionAdded) {
        onReactionAdded(res.data);
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div
    className={`
      absolute
      bottom-full
      mb-1.5 sm:mb-2
      z-50
      flex
      items-center
      gap-0.5 sm:gap-1
      px-1.5 sm:px-2
      py-1.5 sm:py-2
      rounded-full
      bg-[#111827]
      border
      border-gray-700
      shadow-2xl
      backdrop-blur-md
      transition-all
      duration-200
      max-w-[180px] sm:max-w-[220px] md:max-w-[260px]

      ${isMine ? "right-0" : "left-0"}
    `}
  >
    {emojis.map((emoji) => (
      <button
        key={emoji}
        disabled={loading}
        onClick={() => handleReaction(emoji)}
        className={`
          w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10
          rounded-full
          flex
          items-center
          justify-center
          text-lg sm:text-xl md:text-2xl
          transition-all
          duration-200
          hover:scale-125
          hover:bg-white/10
          active:scale-95
          disabled:opacity-50
          disabled:cursor-not-allowed
        `}
      >
        {emoji}
      </button>
    ))}
  </div>
);
}

export default ReactionPicker;