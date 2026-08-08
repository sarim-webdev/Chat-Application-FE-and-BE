import { User } from "../models/userSchema.js";
import { successResponse } from "../reponseHandler/successResponse.js";

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    successResponse(res, 200, "Users fetched successfully", {
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

const searchUsers = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      successResponse(res, 200, "No search query provided", {
        count: 0,
        users: [],
      });
    }

    const users = await User.find({
      $or: [
        {
          userName: {
            $regex: query,
            $options: "i",
          },
        },
        {
          email: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    }).select("-password");

    successResponse(res, 200, "Users fetched successfully", {
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      throw new Error("User not found!");
    }

    successResponse(res, 200, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { userName } = req.body;

    if (!userName) {
      throw new Error("Username is required");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { userName },
      { new: true },
    ).select("-password");

    return successResponse(
      res,
      200,
      true,
      "Profile updated successfully",
      updatedUser,
    );
  } catch (error) {
    next(error);
  }
};

const updateProfileImage = async (req, res) => {
  try {
    const { profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage },
      { new: true },
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getAllUsers,
  searchUsers,
  getUserById,
  updateUserProfile,
  updateProfileImage,
};