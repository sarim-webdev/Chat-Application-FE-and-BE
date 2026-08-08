import { useCallback } from "react";

import { useGroupContext } from "../context/GroupContext";

import {
  createGroup as createGroupAPI,
  getGroups as getGroupsAPI,
  getGroupById as getGroupByIdAPI,
  renameGroup as renameGroupAPI,
  updateGroupImage as updateGroupImageAPI,
  addMember as addMemberAPI,
  removeMember as removeMemberAPI,
  leaveGroup as leaveGroupAPI,
  changeAdmin as changeAdminAPI,
  deleteGroup as deleteGroupAPI,
} from "../services/groupService";

function useGroup() {
  const {
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
  } = useGroupContext();

  const fetchGroups = useCallback(async () => {
    setLoading(true);

    try {
      const res = await getGroupsAPI();

      setGroups(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGroupById = useCallback(
    async (groupId) => {
      try {
        setLoading(true);

        const res = await getGroupByIdAPI(groupId);

        setSelectedGroup(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [setSelectedGroup, setLoading],
  );

  const createGroup = async (groupData) => {
    try {
      setLoading(true);

      const res = await createGroupAPI(groupData);

      setGroups((prev) => [res.data, ...prev]);

      setCreateModalOpen(false);

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const renameGroup = async (groupId, groupName) => {
    try {
      setLoading(true);

      const res = await renameGroupAPI(groupId, groupName);

      setGroups((prev) =>
        prev.map((group) => (group._id === groupId ? res.data : group)),
      );

      setSelectedGroup(res.data);

      setRenameModalOpen(false);

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateGroupImage = async (groupId, groupImage) => {
    try {
      setLoading(true);

      const res = await updateGroupImageAPI(groupId, groupImage);

      setGroups((prev) =>
        prev.map((group) => (group._id === groupId ? res.data : group)),
      );

      setSelectedGroup(res.data);

      setUpdateGroupImageModalOpen(false);

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (groupId, userId) => {
    try {
      setLoading(true);

      const res = await addMemberAPI(groupId, userId);

      setGroups((prev) =>
        prev.map((group) => (group._id === groupId ? res.data : group)),
      );

      setSelectedGroup(res.data);

      setAddMemberModalOpen(false);

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (groupId, userId) => {
    try {
      setLoading(true);

      const res = await removeMemberAPI(groupId, userId);

      setGroups((prev) =>
        prev.map((group) => (group._id === groupId ? res.data : group)),
      );

      setSelectedGroup(res.data);

      setRemoveMemberModalOpen(false);

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const leaveGroup = async (groupId) => {
    try {
      setLoading(true);

      await leaveGroupAPI(groupId);

      setGroups((prev) => prev.filter((group) => group._id !== groupId));

      setSelectedGroup(null);

      setLeaveGroupModalOpen(false);

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changeAdmin = async (groupId, newAdminId) => {
    try {
      setLoading(true);

      const res = await changeAdminAPI(groupId, newAdminId);

      setGroups((prev) =>
        prev.map((group) => (group._id === groupId ? res.data : group)),
      );

      setSelectedGroup(res.data);

      setChangeAdminModalOpen(false);

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      setLoading(true);

      await deleteGroupAPI(groupId);

      setGroups((prev) => prev.filter((group) => group._id !== groupId));

      setSelectedGroup(null);

      setDeleteGroupModalOpen(false);

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    groups,
    selectedGroup,
    groupMessages,
    loading,
    search,

    createModalOpen,
    groupInfoOpen,
    renameModalOpen,
    addMemberModalOpen,
    removeMemberModalOpen,
    changeAdminModalOpen,
    deleteGroupModalOpen,
    leaveGroupModalOpen,
    updateGroupImageModalOpen,

    setGroups,
    setSelectedGroup,
    setGroupMessages,
    setSearch,

    setCreateModalOpen,
    setGroupInfoOpen,
    setRenameModalOpen,
    setAddMemberModalOpen,
    setRemoveMemberModalOpen,
    setChangeAdminModalOpen,
    setDeleteGroupModalOpen,
    setLeaveGroupModalOpen,
    setUpdateGroupImageModalOpen,

    fetchGroups,
    fetchGroupById,
    createGroup,
    renameGroup,
    updateGroupImage,
    addMember,
    removeMember,
    leaveGroup,
    changeAdmin,
    deleteGroup,
  };
}

export default useGroup;
