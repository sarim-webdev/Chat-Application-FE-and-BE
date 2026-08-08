import express from "express";

import { verifyUser } from "../middleware/verifyUser.js";

import {
  startCall,
  acceptCall,
  rejectCall,
  endCall,
  getCallHistory,
} from "../controllers/callController.js";

const callRoutes = express.Router();

callRoutes.post("/start", verifyUser, startCall);
callRoutes.put("/:callId/accept", verifyUser, acceptCall);
callRoutes.put("/:callId/reject", verifyUser, rejectCall);
callRoutes.put("/:callId/end", verifyUser, endCall);
callRoutes.get("/", verifyUser, getCallHistory);

export { callRoutes };
