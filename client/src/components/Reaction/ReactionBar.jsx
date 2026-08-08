function ReactionBar({ reactions = [] }) {
  if (!reactions.length) return null;

  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = 0;
    }

    acc[reaction.emoji]++;

    return acc;
  }, {});

  return (
    <div className="pt-1.5 sm:pt-2 md:pt-3">
      <div className="border-t border-gray-500/50 mb-1.5 sm:mb-2"></div>

      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 md:gap-2">
        {Object.entries(groupedReactions).map(([emoji, count]) => (
          <div
            key={emoji}
            className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-white/10 border border-white/10 text-[10px] sm:text-xs hover:bg-white/20 active:bg-white/30 transition"
          >
            <span className="text-[10px] sm:text-xs">{emoji}</span>
            <span className="text-[9px] sm:text-[10px] font-medium">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReactionBar;