import useGroup from "../../hooks/useGroup";
import useAuth from "../../hooks/useAuth";

function LeaveGroupModal() {
  const { user } = useAuth();

  const {
    selectedGroup,

    leaveGroup,

    loading,

    leaveGroupModalOpen,
    setLeaveGroupModalOpen,

    setSelectedGroup,
  } = useGroup();

  const handleLeaveGroup = async () => {
    try {
      await leaveGroup(selectedGroup._id);

      setSelectedGroup(null);

      setLeaveGroupModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };


  const handleClose = () => {
    setLeaveGroupModalOpen(false);
  };

  if (!leaveGroupModalOpen || !selectedGroup) return null;

  if (selectedGroup.admin?._id === user?._id) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md mx-2 sm:mx-3 md:mx-4 bg-[#111827] rounded-2xl border border-white/10 p-4 sm:p-5 md:p-6">

        <div className="text-center">
          <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🚪</div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400">
            Leave Group
          </h2>

          <p className="text-gray-400 mt-2 sm:mt-3 text-sm sm:text-base">
            Are you sure you want to leave
          </p>

          <p className="font-semibold text-white mt-1.5 sm:mt-2 text-sm sm:text-base md:text-lg truncate px-2">
            "{selectedGroup.groupName}"
          </p>

          <p className="text-xs sm:text-sm text-red-400 mt-3 sm:mt-4 font-medium">
            You will stop receiving messages from this group.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-5 sm:mt-6 md:mt-8">
          <button
            onClick={handleClose}
            className="w-full sm:flex-1 py-2.5 sm:py-3 rounded-xl bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-sm sm:text-base font-medium transition"
          >
            Cancel
          </button>

          <button
            onClick={handleLeaveGroup}
            disabled={loading}
            className="w-full sm:flex-1 py-2.5 sm:py-3 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-sm sm:text-base font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Leaving...
              </span>
            ) : (
              "Leave Group"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

export default LeaveGroupModal;