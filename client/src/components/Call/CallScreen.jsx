import { useCall } from "../../context/CallContext";
import AudioVisualizer from "./AudioVisualizer";
import CallControls from "./CallControls";
import CallStatus from "./CallStatus";
import CallTimer from "./CallTimer";

function CallScreen() {
  const {
    incomingCall,
    isCalling,
    callAccepted,
    callEnded,
    localStream,
    endCall,
    callUser,
  } = useCall();

  const user = callUser || incomingCall?.caller;

  if (!incomingCall && !isCalling && !callAccepted) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">

      <div className="w-full max-w-[370px] mx-2 sm:mx-3 md:mx-4 rounded-[25px] sm:rounded-[30px] md:rounded-[35px] bg-[#1c1c1e] shadow-2xl border border-white/10 px-4 sm:px-6 md:px-8 py-6 sm:py-7 md:py-8">

        <div className="flex flex-col items-center">

          <div className="relative">
            {(isCalling || callAccepted || incomingCall) && (
              <span className="absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping"></span>
            )}

            <img
              src={
                user?.profileImage ||
                `https://ui-avatars.com/api/?name=${user?.userName || "User"}&size=128`
              }
              alt="caller"
              className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white shadow-2xl"
            />
          </div>

          <h2 className="mt-3 sm:mt-4 text-xl sm:text-2xl md:text-3xl font-bold text-white text-center truncate max-w-full px-2">
            {user?.userName || "Unknown User"}
          </h2>

          <div className="mt-1.5 sm:mt-2">
            <CallStatus
              incomingCall={incomingCall}
              isCalling={isCalling}
              callAccepted={callAccepted}
              callEnded={callEnded}
            />
          </div>

          {callAccepted && (
            <div className="mt-2 sm:mt-3">
              <CallTimer
                callAccepted={callAccepted}
                callEnded={callEnded}
              />
            </div>
          )}

          {callAccepted && (
            <div className="mt-0.5 sm:mt-1">
              <AudioVisualizer />
            </div>
          )}

          <div className="mt-2 sm:mt-3 w-full">
            <CallControls
              localStream={localStream}
              endCall={endCall}
            />
          </div>

        </div>

      </div>

    </div>
  );
}

export default CallScreen;