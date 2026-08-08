import formatDuration from "../../utils/formatDuration";

function RecordingTimer({ seconds = 0 }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-red-500 animate-pulse"></span>
      <span className="text-[11px] sm:text-xs md:text-sm font-medium text-white">
        Recording...
      </span>
      <span className="text-[11px] sm:text-xs md:text-sm font-mono text-red-400">
        {formatDuration(seconds)}
      </span>
    </div>
  );
}

export default RecordingTimer;