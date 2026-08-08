import { Group } from "../models/groupSchema.js";
import { successResponse } from "../reponseHandler/successResponse.js";

const createGroup = async (req, res, next) => {
  try {
    const { groupName, members, groupImage, description } = req.body;

    if (!groupName || groupName.trim() === "") {
      throw new Error("Group name is required");
    }

    if (!members || !Array.isArray(members) || members.length < 1) {
      throw new Error("Please select at least one member");
    }

    const uniqueMembers = [...new Set([...members, req.user.id])];

    const group = await Group.create({
      groupName: groupName.trim(),
      groupImage: groupImage || "",
      description: description || "",
      admin: req.user.id,
      members: uniqueMembers,
    });

    const populatedGroup = await Group.findById(group._id)
      .populate("admin", "-password")
      .populate("members", "-password")
      .populate("lastMessage");

    return successResponse(
      res,
      201,
      true,
      "Group created successfully",
      populatedGroup,
    );
  } catch (error) {
    next(error);
  }
};

const getGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({
      members: req.user.id,
    })
      .populate("admin", "-password")
      .populate("members", "-password")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "userName profileImage",
        },
      })
      .sort({ updatedAt: -1 });

    const updatedGroups = groups.map((group) => {
      const unreadCount =
        group.unreadCounts.find((item) => item.user.toString() === req.user.id)
          ?.count || 0;

      return {
        ...group.toObject(),
        unreadCount,
      };
    });

    return successResponse(
      res,
      200,
      true,
      "Groups fetched successfully",
      updatedGroups,
    );
  } catch (error) {
    next(error);
  }
};

const getGroupById = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate("admin", "-password")
      .populate("members", "-password")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "userName profileImage",
        },
      });

    if (!group) {
      throw new Error("Group not found");
    }

    // Check if current user is member
    const isMember = group.members.some(
      (member) => member._id.toString() === req.user.id,
    );

    if (!isMember) {
      throw new Error("You are not a member of this group");
    }

    const unreadCount =
      group.unreadCounts.find((item) => item.user.toString() === req.user.id)
        ?.count || 0;

    const updatedGroup = {
      ...group.toObject(),
      unreadCount,
    };

    return successResponse(
      res,
      200,
      true,
      "Group fetched successfully",
      updatedGroup,
    );
  } catch (error) {
    next(error);
  }
};

const renameGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { groupName } = req.body;

    if (!groupName || groupName.trim() === "") {
      throw new Error("Group name is required");
    }

    const group = await Group.findById(groupId);

    if (!group) {
      throw new Error("Group not found");
    }

    // Only admin can rename
    if (group.admin.toString() !== req.user.id) {
      throw new Error("Only group admin can rename the group");
    }

    group.groupName = groupName.trim();

    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate("admin", "-password")
      .populate("members", "-password")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "userName profileImage",
        },
      });

    return successResponse(
      res,
      200,
      true,
      "Group renamed successfully",
      updatedGroup,
    );
  } catch (error) {
    next(error);
  }
};

const updateGroupImage = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { groupImage } = req.body;

    if (!groupImage) {
      throw new Error("Group image is required");
    }

    const group = await Group.findById(groupId);

    if (!group) {
      throw new Error("Group not found");
    }

    if (group.admin.toString() !== req.user.id) {
      throw new Error("Only group admin can update group image");
    }

    group.groupImage = groupImage;

    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate("admin", "-password")
      .populate("members", "-password")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "userName profileImage",
        },
      });

    return successResponse(
      res,
      200,
      true,
      "Group image updated successfully",
      updatedGroup,
    );
  } catch (error) {
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      throw new Error("User ID is required");
    }

    const group = await Group.findById(groupId);

    if (!group) {
      throw new Error("Group not found");
    }

    if (group.admin.toString() !== req.user.id) {
      throw new Error("Only group admin can add members");
    }

    const alreadyMember = group.members.some(
      (member) => member.toString() === userId,
    );

    if (alreadyMember) {
      throw new Error("User is already a member of this group");
    }

    group.members.push(userId);

    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate("admin", "-password")
      .populate("members", "-password")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "userName profileImage",
        },
      });

    return successResponse(
      res,
      200,
      true,
      "Member added successfully",
      updatedGroup,
    );
  } catch (error) {
    next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      throw new Error("User ID is required");
    }

    const group = await Group.findById(groupId);

    if (!group) {
      throw new Error("Group not found");
    }

    if (group.admin.toString() !== req.user.id) {
      throw new Error("Only group admin can remove members");
    }

    if (group.admin.toString() === userId) {
      throw new Error("Admin cannot remove himself");
    }

    const isMember = group.members.some(
      (member) => member.toString() === userId,
    );

    if (!isMember) {
      throw new Error("User is not a member of this group");
    }

    group.members = group.members.filter(
      (member) => member.toString() !== userId,
    );

    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate("admin", "-password")
      .populate("members", "-password")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "userName profileImage",
        },
      });

    return successResponse(
      res,
      200,
      true,
      "Member removed successfully",
      updatedGroup,
    );
  } catch (error) {
    next(error);
  }
};

const leaveGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      throw new Error("Group not found");
    }

    const isMember = group.members.some(
      (member) => member.toString() === req.user.id,
    );

    if (!isMember) {
      throw new Error("You are not a member of this group");
    }

    if (group.admin.toString() === req.user.id) {
      throw new Error(
        "Admin must transfer admin rights before leaving the group",
      );
    }

    group.members = group.members.filter(
      (member) => member.toString() !== req.user.id,
    );

    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate("admin", "-password")
      .populate("members", "-password")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "userName profileImage",
        },
      });

    return successResponse(
      res,
      200,
      true,
      "You left the group successfully",
      updatedGroup,
    );
  } catch (error) {
    next(error);
  }
};

const changeAdmin = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      throw new Error("User ID is required");
    }

    const group = await Group.findById(groupId);

    if (!group) {
      throw new Error("Group not found");
    }

    if (group.admin.toString() !== req.user.id) {
      throw new Error("Only group admin can change admin");
    }

    const isMember = group.members.some(
      (member) => member.toString() === userId,
    );

    if (!isMember) {
      throw new Error("Selected user is not a group member");
    }

    if (group.admin.toString() === userId) {
      throw new Error("User is already the group admin");
    }

    group.admin = userId;

    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate("admin", "-password")
      .populate("members", "-password")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "userName profileImage",
        },
      });

    return successResponse(
      res,
      200,
      true,
      "Group admin changed successfully",
      updatedGroup,
    );
  } catch (error) {
    next(error);
  }
};

const deleteGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      throw new Error("Group not found");
    }

    if (group.admin.toString() !== req.user.id) {
      throw new Error("Only group admin can delete this group");
    }

    await Group.findByIdAndDelete(groupId);

    return successResponse(res, 200, true, "Group deleted successfully", null);
  } catch (error) {
    next(error);
  }
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
