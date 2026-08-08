import API from "./api";

const createGroup = async (groupData) => {
  const res = await API.post("/group/create", groupData);

  return res.data;
};

const getGroups = async () => {
  const res = await API.get("/group");

  return res.data;
};

const getGroupById = async (groupId) => {
  const res = await API.get(`/group/${groupId}`);

  return res.data;
};

const renameGroup = async (groupId, groupName) => {
  const res = await API.put(`/group/rename/${groupId}`, {
    groupName,
  });

  return res.data;
};

const updateGroupImage = async (groupId, groupImage) => {
  const res = await API.put(`/group/image/${groupId}`, {
    groupImage,
  });

  return res.data;
};

const addMember = async (groupId, userId) => {
  const res = await API.put(`/group/add-member/${groupId}`, {
    userId,
  });


  return res.data;
};

const removeMember = async (groupId, userId) => {
  const res = await API.put(`/group/remove-member/${groupId}`, {
    userId,
  });

  return res.data;
};

const leaveGroup = async (groupId) => {
  const res = await API.put(`/group/leave/${groupId}`);

  return res.data;
};

const changeAdmin = async (groupId, userId) => {
  const res = await API.put(`/group/change-admin/${groupId}`, {
    userId,
  });

  return res.data;
};

const deleteGroup = async (groupId) => {
  const res = await API.delete(`/group/${groupId}`);

  return res.data;
};

export {
  createGroup,
  getGroups,
  getGroupById,
  renameGroup,
  updateGroupImage,
  addMember,
  removeMember,
  leaveGroup,
  changeAdmin,
  deleteGroup,
};
