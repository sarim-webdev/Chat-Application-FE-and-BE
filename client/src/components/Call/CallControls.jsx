import { FaPhoneSlash, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useState } from "react";
import { toggleMicrophone } from "../../utils/media";

function CallControls({
  localStream,
  endCall,
}) {
  const [micEnabled, setMicEnabled] = useState(true);

  const handleToggleMic = () => {
    if (!localStream) return;

    const enabled = toggleMicrophone(localStream);

    setMicEnabled(enabled);
  };

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 py-3 sm:py-4">

      {/* MICROPHONE */}
      <button
        onClick={handleToggleMic}
        className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition duration-200
        ${micEnabled
            ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
            : "bg-gray-600 hover:bg-gray-700 active:bg-gray-800"
          }`}
      >
        {micEnabled ? (
          <FaMicrophone
            size={14}
            className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-white"
          />
        ) : (
          <FaMicrophoneSlash
            size={14}
            className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-white"
          />
        )}
      </button>

      {/* END CALL */}
      <button
        onClick={endCall}
        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 flex items-center justify-center transition duration-200 shadow-lg shadow-red-600/30"
      >
        <FaPhoneSlash
          size={18}
          className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-white"
        />
      </button>

    </div>
  );
}

export default CallControls;