import { useMemo, useState } from "react";

import useGroup from "../../hooks/useGroup";
import useAuth from "../../hooks/useAuth";

function ChangeAdminModal() {
  const { user } = useAuth();

  const {
    selectedGroup,

    changeAdmin,

    loading,

    changeAdminModalOpen,
    setChangeAdminModalOpen,
  } = useGroup();

  const [search, setSearch] = useState("");

  const [selectedAdmin, setSelectedAdmin] = useState("");

  const filteredMembers = useMemo(() => {
    if (!selectedGroup) return [];

    return selectedGroup.members.filter((member) => {
      if (member._id === selectedGroup.admin._id) return false;

      return (
        member.userName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        member.email
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [selectedGroup, search]);

  const handleChangeAdmin = async () => {
    try {
      if (!selectedAdmin) return;

      await changeAdmin(
        selectedGroup._id,
        selectedAdmin
      );

      setSelectedAdmin("");
      setSearch("");
      setChangeAdminModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setSelectedAdmin("");
    setSearch("");
    setChangeAdminModalOpen(false);
  };

  if (!changeAdminModalOpen) return null;

  if (selectedGroup?.admin?._id !== user?._id) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg mx-2 sm:mx-3 md:mx-4 bg-[#111827] rounded-2xl border border-white/10 p-4 sm:p-5 md:p-6 max-h-[90vh] flex flex-col">

        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">
          Change Group Admin
        </h2>

        <input
          type="text"
          placeholder="Search member..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2.5 sm:p-3 rounded-xl bg-white/10 outline-none text-sm sm:text-base mb-3 sm:mb-4 focus:ring-2 focus:ring-blue-500/50 transition"
        />

        <div className="flex-1 min-h-0 space-y-2 overflow-y-auto">
          {filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-10">
              <p className="text-center text-gray-400 text-sm sm:text-base">
                No members found
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
                  onClick={() => setSelectedAdmin(member._id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-sm font-medium transition flex-shrink-0 ${selectedAdmin === member._id
                      ? "bg-green-600 hover:bg-green-700 active:bg-green-800"
                      : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                    }`}
                >
                  {selectedAdmin === member._id ? "Selected" : "Select"}
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
            onClick={handleChangeAdmin}
            disabled={loading || !selectedAdmin}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-sm sm:text-base font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
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
              "Change Admin"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ChangeAdminModal;