import React from "react";

function AudioWave({
  isActive = false,
  bars = 20,
  className = "",
}) {
  return (
    <div
      className={`flex items-end gap-[1.5px] sm:gap-[2px] h-6 sm:h-7 md:h-8 ${className}`}
    >
      {Array.from({ length: bars }).map((_, index) => (
        <span
          key={index}
          className={`w-[2px] sm:w-[2.5px] md:w-[3px] rounded-full ${isActive
              ? "bg-green-400 animate-pulse"
              : "bg-gray-500"
            }`}
          style={{
            height: `${8 + ((index * 17) % 20)}px`,
            animationDuration: `${0.5 + (index % 5) * 0.15}s`,
            animationDelay: `${index * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
}

export default AudioWave;