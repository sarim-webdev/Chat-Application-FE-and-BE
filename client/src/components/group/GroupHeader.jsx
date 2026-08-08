import { useState } from "react";

import {
  FiInfo,
  FiMoreVertical,
  FiImage,
  FiEdit2,
  FiUserPlus,
  FiUserMinus,
  FiShield,
  FiTrash2,
  FiLogOut,
} from "react-icons/fi";

import useAuth from "../../hooks/useAuth";
import useGroup from "../../hooks/useGroup";

function GroupHeader() {
  const { user } = useAuth();

  const {
    selectedGroup,
    setGroupInfoOpen,
    setRenameModalOpen,
    setUpdateGroupImageModalOpen,
    setAddMemberModalOpen,
    setRemoveMemberModalOpen,
    setChangeAdminModalOpen,
    setLeaveGroupModalOpen,
    setDeleteGroupModalOpen,
  } = useGroup();

  const [menuOpen, setMenuOpen] = useState(false);

  if (!selectedGroup) return null;

  const isAdmin = selectedGroup.admin?._id === user?._id;

  return (
    <div className="relative flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-4 border-b border-white/10 bg-[#111827]">

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
        <img
          src={
            selectedGroup.groupImage ||
            `https://ui-avatars.com/api/?name=${selectedGroup.groupName}&size=64`
          }
          alt={selectedGroup.groupName}
          className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full object-cover border-2 border-white/20 flex-shrink-0"
        />

        <div className="min-w-0 flex-1">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-white truncate leading-tight">
            {selectedGroup.groupName}
          </h2>

          <p className="text-[10px] sm:text-xs md:text-sm text-gray-400">
            {selectedGroup.members?.length || 0} Members
          </p>
        </div>
      </div>

      <div className="relative flex items-center gap-1.5 sm:gap-2 flex-shrink-0">

        <button
          onClick={() => setGroupInfoOpen(true)}
          className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center transition shadow-lg shadow-black/20"
        >
          <FiInfo className="text-base sm:text-lg md:text-xl text-white" />
        </button>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center transition shadow-lg shadow-black/20"
        >
          <FiMoreVertical className="text-base sm:text-lg md:text-xl text-white" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-10 sm:top-11 md:top-12 w-48 sm:w-52 md:w-56 rounded-xl bg-[#1F2937] border border-white/10 shadow-2xl overflow-hidden z-50">

            {isAdmin ? (
              <>
                <MenuButton
                  icon={<FiImage />}
                  text="Change Group Image"
                  onClick={() => {
                    setUpdateGroupImageModalOpen(true);
                    setMenuOpen(false);
                  }}
                />

                <MenuButton
                  icon={<FiEdit2 />}
                  text="Rename Group"
                  onClick={() => {
                    setRenameModalOpen(true);
                    setMenuOpen(false);
                  }}
                />

                <MenuButton
                  icon={<FiUserPlus />}
                  text="Add Members"
                  onClick={() => {
                    setAddMemberModalOpen(true);
                    setMenuOpen(false);
                  }}
                />

                <MenuButton
                  icon={<FiUserMinus />}
                  text="Remove Members"
                  onClick={() => {
                    setRemoveMemberModalOpen(true);
                    setMenuOpen(false);
                  }}
                />

                <MenuButton
                  icon={<FiShield />}
                  text="Change Admin"
                  onClick={() => {
                    setChangeAdminModalOpen(true);
                    setMenuOpen(false);
                  }}
                />

                <MenuButton
                  danger
                  icon={<FiTrash2 />}
                  text="Delete Group"
                  onClick={() => {
                    setDeleteGroupModalOpen(true);
                    setMenuOpen(false);
                  }}
                />
              </>
            ) : (
              <MenuButton
                danger
                icon={<FiLogOut />}
                text="Leave Group"
                onClick={() => {
                  setLeaveGroupModalOpen(true);
                  setMenuOpen(false);
                }}
              />
            )}

          </div>
        )}

      </div>

    </div>
  );
}

function MenuButton({ icon, text, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-left transition text-sm sm:text-base
    ${danger
          ? "hover:bg-red-600/20 active:bg-red-600/30 text-red-400"
          : "hover:bg-white/10 active:bg-white/20 text-white"
        }`}
    >
      <span className="text-base sm:text-lg flex-shrink-0">{icon}</span>
      <span className="truncate">{text}</span>
    </button>
  );
}

export default GroupHeader;