import { useEffect, useRef } from "react";
import GroupMessage from "./GroupMessage";

function GroupMessageList({
  messages = [],
  currentUser,
  loading,
  setReplyMessage,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="h-14 rounded-xl bg-white/10 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!messages?.length) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-6xl mb-4">👥</div>

          <h2 className="text-xl font-semibold">
            No Messages Yet
          </h2>

          <p className="text-sm mt-2">
            Send the first message to this group.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
      {messages.map((message) => (
        <GroupMessage
          key={message._id}
          message={message}
          currentUser={currentUser}
          setReplyMessage={setReplyMessage}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}

export default GroupMessageList;