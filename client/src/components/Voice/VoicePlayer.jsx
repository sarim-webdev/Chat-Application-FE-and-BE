import { useEffect, useRef, useState } from "react";
import { BsFillPlayFill, BsPauseFill } from "react-icons/bs";
import formatDuration from "../../utils/formatDuration";

function VoicePlayer({
  audioUrl,
  duration = 0,
}) {
  const audioRef = useRef(null);

  const [playing, setPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setPlaying(!playing);
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);

      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">

      <audio
        ref={audioRef}
        src={audioUrl}
      />

      <button
        onClick={togglePlay}
        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 flex items-center justify-center flex-shrink-0 transition shadow-lg shadow-blue-600/20"
      >
        {playing ? (
          <BsPauseFill size={18} className="sm:w-[20px] sm:h-[20px] md:w-6 md:h-6 text-white" />
        ) : (
          <BsFillPlayFill size={18} className="sm:w-[20px] sm:h-[20px] md:w-6 md:h-6 text-white" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <input
          type="range"
          min={0}
          max={duration || 1}
          value={currentTime}
          onChange={(e) => {
            audioRef.current.currentTime = Number(e.target.value);
            setCurrentTime(Number(e.target.value));
          }}
          className="w-full h-1 sm:h-1.5 accent-blue-500 cursor-pointer"
        />

        <div className="flex justify-between text-[10px] sm:text-[11px] text-gray-300 mt-0.5 sm:mt-1">
          <span className="font-mono">
            {formatDuration(Math.floor(currentTime))}
          </span>
          <span className="font-mono">
            {formatDuration(duration)}
          </span>
        </div>

      </div>

    </div>
  );
}

export default VoicePlayer;