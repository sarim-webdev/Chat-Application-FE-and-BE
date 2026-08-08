import { FaPhoneSlash } from "react-icons/fa";
import { useCall } from "../../context/CallContext";

function OutgoingCallModal() {
  const {
    isCalling,
    endCall,
    callUser,
  } = useCall();

  if (!isCalling || !callUser) return null;

  return (
    <div className="w-full max-w-[370px] mx-2 sm:mx-3 md:mx-4 rounded-[25px] sm:rounded-[30px] md:rounded-[35px] bg-[#1c1c1e] shadow-2xl border border-white/10 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">

      <div className="flex flex-col items-center">

        <div className="relative">
          <span className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-60"></span>

          <img
            src={
              callUser.profileImage ||
              `https://ui-avatars.com/api/?name=${callUser.userName}&size=128`
            }
            alt="receiver"
            className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white animate-pulse"
          />
        </div>

        <h2 className="mt-4 sm:mt-5 md:mt-6 text-xl sm:text-2xl md:text-3xl font-bold text-white text-center truncate max-w-full px-2">
          {callUser?.userName || "Unknown User"}
        </h2>

        <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-400 tracking-wide text-center">
          Outgoing Audio Call...
        </p>

        <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs md:text-sm text-gray-500 text-center">
          Waiting for answer
        </p>

      </div>

      <div className="flex justify-center mt-8 sm:mt-10 md:mt-12 lg:mt-14">

        <div className="flex flex-col items-center">
          <button
            onClick={endCall}
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 transition flex items-center justify-center shadow-xl shadow-red-600/30 active:scale-95"
          >
            <FaPhoneSlash className="text-white text-base sm:text-lg md:text-xl lg:text-[28px]" size={28} />
          </button>

          <p className="text-white text-[10px] sm:text-xs md:text-sm mt-2 sm:mt-3">
            Cancel
          </p>
        </div>
      </div>
    </div>
  );
}

export default OutgoingCallModal;