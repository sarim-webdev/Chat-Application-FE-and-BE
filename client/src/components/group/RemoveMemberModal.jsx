import { useMemo, useState } from "react";

import useGroup from "../../hooks/useGroup";
import useAuth from "../../hooks/useAuth";

function RemoveMemberModal() {
  const { user } = useAuth();

  const {
    selectedGroup,

    removeMember,

    loading,

    removeMemberModalOpen,
    setRemoveMemberModalOpen,
  } = useGroup();

  const [search, setSearch] = useState("");

  const [selectedUsers, setSelectedUsers] = useState([]);

  const filteredMembers = useMemo(() => {
    if (!selectedGroup) return [];

    return selectedGroup.members.filter((member) => {
      if (member._id === selectedGroup.admin._id) return false;

      if (member._id === user._id) return false;

      return (
        member.userName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        member.email
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [selectedGroup, search, user]);

  const toggleUser = (userId) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      }
      return [...prev, userId];
    });
  };

  const handleRemoveMembers = async () => {
    try {
      if (selectedUsers.length === 0) return;

      for (const userId of selectedUsers) {
        await removeMember(selectedGroup._id, userId);
      }

      setSelectedUsers([]);
      setSearch("");
      setRemoveMemberModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setSelectedUsers([]);
    setSearch("");
    setRemoveMemberModalOpen(false);
  };

  if (!removeMemberModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg mx-2 sm:mx-3 md:mx-4 bg-[#111827] rounded-2xl border border-white/10 p-4 sm:p-5 md:p-6 max-h-[90vh] flex flex-col">

        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">
          Remove Members
        </h2>

        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2.5 sm:p-3 rounded-xl bg-white/10 outline-none text-sm sm:text-base mb-3 sm:mb-4 focus:ring-2 focus:ring-blue-500/50 transition"
        />

        <div className="flex-1 min-h-0 space-y-2 overflow-y-auto">
          {filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-10">
              <p className="text-center text-gray-400 text-sm sm:text-base">
                No removable members found
              </p>
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 transition gap-2"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <img
                    src={
                      member.profileImage ||
                      `https://ui-avatars.com/api/?name=${member.userName}&size=64`
                    }
                    alt={member.userName}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-medium truncate">
                      {member.userName}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                      {member.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleUser(member._id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-sm font-medium transition flex-shrink-0 ${selectedUsers.includes(member._id)
                      ? "bg-red-600 hover:bg-red-700 active:bg-red-800"
                      : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                    }`}
                >
                  {selectedUsers.includes(member._id) ? "Selected" : "Select"}
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-white/10">
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-2 rounded-lg bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-sm sm:text-base font-medium transition"
          >
            Cancel
          </button>

          <button
            onClick={handleRemoveMembers}
            disabled={loading || selectedUsers.length === 0}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-2 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-sm sm:text-base font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Removing...
              </span>
            ) : (
              `Remove ${selectedUsers.length > 0 ? `(${selectedUsers.length})` : ""}`
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

export default RemoveMemberModal;