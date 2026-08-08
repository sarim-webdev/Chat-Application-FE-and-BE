import { useEffect, useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";

function CallTimer({ callAccepted, callEnded }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval;

    if (callAccepted && !callEnded) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [callAccepted, callEnded]);

  useEffect(() => {
    if (!callAccepted) {
      setSeconds(0);
    }
  }, [callAccepted]);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const formattedTime =
    hours > 0
      ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(secs).padStart(2, "0")}`
      : `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
        2,
        "0"
      )}`;

  return (
    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">

      <FaPhoneAlt className="text-green-400 text-[10px] sm:text-xs md:text-sm" />

      <span className="text-white font-mono text-base sm:text-lg md:text-xl tracking-[1.5px] sm:tracking-[2px] md:tracking-[3px] font-bold">
        {formattedTime}
      </span>
    </div>
  );
}

export default CallTimer;