import useGroup from "../../hooks/useGroup";
import useAuth from "../../hooks/useAuth";
import {
  FiImage,
  FiEdit2,
  FiUserPlus,
  FiUserMinus,
  FiShield,
  FiTrash2,
  FiLogOut,
} from "react-icons/fi";

function GroupInfoModal() {
  const { user } = useAuth();

  const {
    selectedGroup,

    groupInfoOpen,
    setGroupInfoOpen,

    setRenameModalOpen,
    setAddMemberModalOpen,
    setRemoveMemberModalOpen,
    setChangeAdminModalOpen,
    setDeleteGroupModalOpen,
    setLeaveGroupModalOpen,
    setUpdateGroupImageModalOpen,
  } = useGroup();

  const handleClose = () => {
    setGroupInfoOpen(false);
  };

  if (!groupInfoOpen || !selectedGroup) return null;

  const isAdmin = selectedGroup.admin?._id === user?._id;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-xl mx-2 sm:mx-3 md:mx-4 max-h-[90vh] overflow-y-auto bg-[#111827] rounded-2xl border border-white/10 p-4 sm:p-5 md:p-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">

        <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Group Information</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white active:text-white text-lg sm:text-xl p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col items-center">
          <img
            src={
              selectedGroup.groupImage ||
              `https://ui-avatars.com/api/?name=${selectedGroup.groupName}&size=128`
            }
            alt={selectedGroup.groupName}
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-blue-500 flex-shrink-0"
          />

          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-3 sm:mt-4 text-center truncate max-w-full px-2">
            {selectedGroup.groupName}
          </h3>

          <p className="text-gray-400 mt-1.5 sm:mt-2 text-center text-xs sm:text-sm px-2">
            {selectedGroup.description || "No description"}
          </p>

          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 sm:mt-2">
            {selectedGroup.members.length} Members
          </p>
        </div>

        <div className="mt-5 sm:mt-6 md:mt-8">
          <h3 className="font-semibold mb-2.5 sm:mb-3 text-sm sm:text-base">Group Admin</h3>

          <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-white/5">
            <img
              src={
                selectedGroup.admin.profileImage ||
                `https://ui-avatars.com/api/?name=${selectedGroup.admin.userName}&size=64`
              }
              alt={selectedGroup.admin.userName}
              className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
            />

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm sm:text-base truncate">{selectedGroup.admin.userName}</p>
              <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                {selectedGroup.admin.email}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 md:mt-8">
          <h3 className="font-semibold mb-2.5 sm:mb-3 text-sm sm:text-base">Members</h3>

          <div className="space-y-1.5 sm:space-y-2 max-h-40 sm:max-h-48 md:max-h-56 overflow-y-auto">
            {selectedGroup.members.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 transition"
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
                    <p className="font-medium text-sm sm:text-base truncate">{member.userName}</p>
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">{member.email}</p>
                  </div>
                </div>

                {member._id === selectedGroup.admin._id && (
                  <span className="text-[10px] sm:text-xs bg-blue-600 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                    Admin
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 sm:mt-8 md:mt-10">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 md:mb-5">
            Group Management
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 md:gap-4">

            {isAdmin ? (
              <>
                <button
                  onClick={() => {
                    setGroupInfoOpen(false);
                    setUpdateGroupImageModalOpen(true);
                  }}
                  className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white/5 hover:bg-indigo-500/20 active:bg-indigo-500/30 border border-white/10 hover:border-indigo-500 transition-all duration-300"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <FiImage size={18} className="sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" />
                  </div>

                  <div className="text-left min-w-0 flex-1">
                    <h4 className="font-semibold text-white text-sm sm:text-base truncate">
                      Group Image
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                      Change photo
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setGroupInfoOpen(false);
                    setRenameModalOpen(true);
                  }}
                  className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white/5 hover:bg-blue-500/20 active:bg-blue-500/30 border border-white/10 hover:border-blue-500 transition-all duration-300"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <FiEdit2 size={18} className="sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" />
                  </div>

                  <div className="text-left min-w-0 flex-1">
                    <h4 className="font-semibold text-white text-sm sm:text-base truncate">
                      Rename
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                      Change group name
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setGroupInfoOpen(false);
                    setAddMemberModalOpen(true);
                  }}
                  className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white/5 hover:bg-green-500/20 active:bg-green-500/30 border border-white/10 hover:border-green-500 transition-all duration-300"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">
                    <FiUserPlus size={18} className="sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" />
                  </div>

                  <div className="text-left min-w-0 flex-1">
                    <h4 className="font-semibold text-white text-sm sm:text-base truncate">
                      Add Member
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                      Invite new people
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setGroupInfoOpen(false);
                    setRemoveMemberModalOpen(true);
                  }}
                  className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white/5 hover:bg-orange-500/20 active:bg-orange-500/30 border border-white/10 hover:border-orange-500 transition-all duration-300"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 flex-shrink-0">
                    <FiUserMinus size={18} className="sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" />
                  </div>

                  <div className="text-left min-w-0 flex-1">
                    <h4 className="font-semibold text-white text-sm sm:text-base truncate">
                      Remove Member
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                      Remove participants
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setGroupInfoOpen(false);
                    setChangeAdminModalOpen(true);
                  }}
                  className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white/5 hover:bg-purple-500/20 active:bg-purple-500/30 border border-white/10 hover:border-purple-500 transition-all duration-300"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                    <FiShield size={18} className="sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" />
                  </div>

                  <div className="text-left min-w-0 flex-1">
                    <h4 className="font-semibold text-white text-sm sm:text-base truncate">
                      Change Admin
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                      Transfer ownership
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setGroupInfoOpen(false);
                    setDeleteGroupModalOpen(true);
                  }}
                  className="col-span-1 sm:col-span-2 group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 border border-red-500/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0">
                    <FiTrash2 size={18} className="sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" />
                  </div>

                  <div className="text-left min-w-0 flex-1">
                    <h4 className="font-semibold text-red-400 text-sm sm:text-base truncate">
                      Delete Group
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                      This action cannot be undone
                    </p>
                  </div>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setGroupInfoOpen(false);
                  setLeaveGroupModalOpen(true);
                }}
                className="col-span-1 sm:col-span-2 group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 border border-red-500/30 transition-all duration-300"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0">
                  <FiLogOut size={18} className="sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" />
                </div>

                <div className="text-left min-w-0 flex-1">
                  <h4 className="font-semibold text-red-400 text-sm sm:text-base truncate">
                    Leave Group
                  </h4>
                  <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                    Exit this conversation
                  </p>
                </div>
              </button>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default GroupInfoModal;
