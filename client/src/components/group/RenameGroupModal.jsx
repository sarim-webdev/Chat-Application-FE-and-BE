import { useEffect, useState } from "react";

import useGroup from "../../hooks/useGroup";
import useAuth from "../../hooks/useAuth";

function RenameGroupModal() {
  const { user } = useAuth();

  const {
    selectedGroup,

    renameGroup,

    loading,

    renameModalOpen,
    setRenameModalOpen,
  } = useGroup();

  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    if (renameModalOpen && selectedGroup) {
      setGroupName(selectedGroup.groupName);
    }
  }, [renameModalOpen, selectedGroup]);

  const handleRename = async () => {
    try {
      if (!groupName.trim()) return;

      await renameGroup(
        selectedGroup._id,
        groupName.trim()
      );

      setRenameModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setGroupName("");
    setRenameModalOpen(false);
  };

  if (!renameModalOpen || !selectedGroup) return null;

  if (selectedGroup.admin?._id !== user?._id) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md mx-2 sm:mx-3 md:mx-4 bg-[#111827] rounded-2xl border border-white/10 p-4 sm:p-5 md:p-6">

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-5">
          Rename Group
        </h2>

        <label className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2 font-medium">
          Group Name
        </label>

        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name..."
          className="w-full p-2.5 sm:p-3 rounded-xl bg-white/10 border border-white/10 outline-none text-sm sm:text-base focus:border-blue-500 transition focus:ring-2 focus:ring-blue-500/50"
          autoFocus
        />

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-5 sm:mt-6">
          <button
            onClick={handleClose}
            className="w-full sm:flex-1 py-2.5 sm:py-3 rounded-xl bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-sm sm:text-base font-medium transition"
          >
            Cancel
          </button>

          <button
            onClick={handleRename}
            disabled={loading || !groupName.trim()}
            className="w-full sm:flex-1 py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-sm sm:text-base font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

export default RenameGroupModal;