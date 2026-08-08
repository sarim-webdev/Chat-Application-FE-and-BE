import { Call } from "../models/callSchema.js";
import { successResponse } from "../reponseHandler/successResponse.js";

const startCall = async (req, res, next) => {
  try {
    const { receiver, chat, group, callType } = req.body;

    if (!receiver) {
      throw new Error("Receiver is required");
    }

    const call = await Call.create({
      caller: req.user.id,
      receiver,
      chat: chat || null,
      group: group || null,
      callType: callType || "audio",
      status: "ringing",
      startedAt: new Date(),
    });

    return successResponse(res, 201, true, "Call started successfully", call);
  } catch (error) {
    next(error);
  }
};

const acceptCall = async (req, res, next) => {
  try {
    const { callId } = req.params;

    const call = await Call.findByIdAndUpdate(
      callId,
      {
        status: "accepted",
      },
      {
        new: true,
      },
    )
      .populate("caller", "userName profileImage")
      .populate("receiver", "userName profileImage");

    if (!call) {
      throw new Error("Call not found");
    }

    return successResponse(res, 200, true, "Call accepted successfully", call);
  } catch (error) {
    next(error);
  }
};

const rejectCall = async (req, res, next) => {
  try {
    const { callId } = req.params;

    const call = await Call.findByIdAndUpdate(
      callId,
      {
        status: "rejected",
        endedAt: new Date(),
      },
      {
        new: true,
      },
    )
      .populate("caller", "userName profileImage")
      .populate("receiver", "userName profileImage");

    if (!call) {
      throw new Error("Call not found");
    }

    return successResponse(res, 200, true, "Call rejected successfully", call);
  } catch (error) {
    next(error);
  }
};

const endCall = async (req, res, next) => {
  try {
    const { callId } = req.params;

    const call = await Call.findById(callId);

    if (!call) {
      throw new Error("Call not found");
    }

    const endedAt = new Date();

    const duration = Math.floor(
      (endedAt.getTime() - new Date(call.startedAt).getTime()) / 1000,
    );

    call.status = "ended";
    call.endedAt = endedAt;
    call.duration = duration;

    await call.save();

    return successResponse(res, 200, true, "Call ended successfully", call);
  } catch (error) {
    next(error);
  }
};

const getCallHistory = async (req, res, next) => {
  try {
    const calls = await Call.find({
      $or: [{ caller: req.user.id }, { receiver: req.user.id }],
    })
      .populate("caller", "userName profileImage")
      .populate("receiver", "userName profileImage")
      .populate("chat")
      .populate("group")
      .sort({
        createdAt: -1,
      });

    return successResponse(
      res,
      200,
      true,
      "Call history fetched successfully",
      calls,
    );
  } catch (error) {
    next(error);
  }
};

export { startCall, acceptCall, rejectCall, endCall, getCallHistory };
