import { createContext, useContext, useState } from "react";

const GroupContext = createContext();

function GroupProvider({ children }) {

  const [groups, setGroups] = useState([]);

  const [selectedGroup, setSelectedGroup] = useState(null);

  const [groupMessages, setGroupMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [groupInfoOpen, setGroupInfoOpen] = useState(false);

  const [renameModalOpen, setRenameModalOpen] = useState(false);

  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);

  const [removeMemberModalOpen, setRemoveMemberModalOpen] = useState(false);

  const [changeAdminModalOpen, setChangeAdminModalOpen] = useState(false);

  const [deleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false);

  const [leaveGroupModalOpen, setLeaveGroupModalOpen] = useState(false);

  const [updateGroupImageModalOpen, setUpdateGroupImageModalOpen] =
    useState(false);

  const [typingUser, setTypingUser] = useState("");

  const value = {
    groups,
    setGroups,

    selectedGroup,
    setSelectedGroup,

    groupMessages,
    setGroupMessages,

    loading,
    setLoading,

    search,
    setSearch,

    typingUser,
    setTypingUser,

    createModalOpen,
    setCreateModalOpen,

    groupInfoOpen,
    setGroupInfoOpen,

    renameModalOpen,
    setRenameModalOpen,

    addMemberModalOpen,
    setAddMemberModalOpen,

    removeMemberModalOpen,
    setRemoveMemberModalOpen,

    changeAdminModalOpen,
    setChangeAdminModalOpen,

    deleteGroupModalOpen,
    setDeleteGroupModalOpen,

    leaveGroupModalOpen,
    setLeaveGroupModalOpen,

    updateGroupImageModalOpen,
    setUpdateGroupImageModalOpen,
  };

  return (
    <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
  );
}

const useGroupContext = () => useContext(GroupContext);

export { GroupProvider, useGroupContext };
