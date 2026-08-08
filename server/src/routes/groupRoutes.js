import express from "express";

import { verifyUser } from "../middleware/verifyUser.js";

import {
  createGroup,
  getGroups,
  getGroupById,
  renameGroup,
  addMember,
  removeMember,
  leaveGroup,
  changeAdmin,
  updateGroupImage,
  deleteGroup,
} from "../controllers/groupController.js";

const groupRoutes = express.Router();

groupRoutes.post("/create", verifyUser, createGroup);
groupRoutes.get("/", verifyUser, getGroups);
groupRoutes.get("/:groupId", verifyUser, getGroupById);
groupRoutes.put("/rename/:groupId", verifyUser, renameGroup);
groupRoutes.put("/image/:groupId", verifyUser, updateGroupImage);
groupRoutes.put("/add-member/:groupId", verifyUser, addMember);
groupRoutes.put("/remove-member/:groupId", verifyUser, removeMember);
groupRoutes.put("/leave/:groupId", verifyUser, leaveGroup);
groupRoutes.put("/change-admin/:groupId", verifyUser, changeAdmin);
groupRoutes.delete("/:groupId", verifyUser, deleteGroup);

export { groupRoutes };
