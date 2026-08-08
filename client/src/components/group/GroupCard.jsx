import React from "react";

function GroupCard({
  group,
  selectedGroup,
  setSelectedGroup,
}) {
  const isActive = selectedGroup?._id === group._id;

  return (
    <div
      onClick={() => setSelectedGroup(group)}
      className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl cursor-pointer transition-all duration-200
    ${isActive
          ? "bg-blue-600/20 border border-blue-500"
          : "hover:bg-white/5 active:bg-white/10"
        }`}
    >
      <div className="relative flex-shrink-0">
        {group.groupImage ? (
          <img
            src={group.groupImage}
            alt={group.groupName}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-white/10"
          />
        ) : (
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-blue-600 flex items-center justify-center text-sm sm:text-base md:text-xl font-bold uppercase border-2 border-white/10">
            {group.groupName?.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 overflow-hidden">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold truncate">
          {group.groupName}
        </h3>

        <p className="text-[10px] sm:text-xs text-gray-400 truncate mt-0.5 sm:mt-1">
          {group.lastMessage?.text
            ? group.lastMessage.text
            : "No messages yet"}
        </p>

        <span className="text-[9px] sm:text-[10px] md:text-[11px] text-gray-500">
          {group.members?.length || 0} Members
        </span>
      </div>
    </div>
  );
}

export default GroupCard;