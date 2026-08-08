function GroupTypingIndicator({ userName }) {
  if (!userName) return null;

  return (
    <div className="px-4 py-2 text-sm text-gray-400 italic animate-pulse">
      {userName} is typing...
    </div>
  );
}

export default GroupTypingIndicator;