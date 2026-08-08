function TypingIndicator({ userName }) {
  if (!userName) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></span>
        <span
          className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
          style={{ animationDelay: "0.15s" }}
        ></span>
        <span
          className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
          style={{ animationDelay: "0.3s" }}
        ></span>
      </div>

      <span className="text-sm text-gray-400 italic">
        {userName} is typing...
      </span>
    </div>
  );
}

export default TypingIndicator;