function CallStatus({
  incomingCall,
  isCalling,
  callEnded,
}) {
  let status = "";
  let color = "";

  if (incomingCall) {
    status = "Incoming Call";
    color = "text-green-400";
  } else if (isCalling) {
    status = "Calling...";
    color = "text-yellow-400";
  } else if (callEnded) {
    status = "Call Ended";
    color = "text-red-400";
  }

  return (
    <div className="flex justify-center">
      <p className={`text-lg sm:text-xl md:text-2xl font-semibold ${color}`}>
        {status}
      </p>
    </div>
  );
}

export default CallStatus;