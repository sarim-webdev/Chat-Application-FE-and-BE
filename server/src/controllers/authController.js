import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { cloudinary } from "../config/cloudinary.js";
import { User } from "../models/userSchema.js";
import { successResponse } from "../reponseHandler/successResponse.js";

const isProduction = process.env.NODE_ENV === "production";

const signup = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;
    const profileImage = req.file;

    if (!userName || !email || !password)
      throw new Error("All fields are required!");

    if (!profileImage) throw new Error("Image is required!");

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "users" }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(profileImage.buffer);
    });

    bcrypt.hash(password, 12, async function (err, hash) {
      const user = await User.create({
        userName,
        email,
        password: hash,
        profileImage: uploadResult.secure_url,
      });
      successResponse(res, 200, true, "User Signup Successfully!", user);
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new Error("All fields are required!");

    const myUser = await User.findOne({ email });

    if (!myUser) throw new Error("User not found!");

    bcrypt.compare(password, myUser.password, async function (err, result) {
      try {
        if (result) {
          await User.findByIdAndUpdate(myUser._id, {
            isOnline: true,
          });
          const token = jwt.sign(
            { email: myUser.email, id: myUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" },
          );
          res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
          });
          successResponse(
            res,
            200,
            true,
            "User Logged In Successfully!",
            myUser,
          );
        } else {
          throw new Error("Invalid Credientials");
        }
      } catch (error) {
        next(error);
      }
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      isOnline: false,
      lastSeen: new Date(),
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    successResponse(res, 200, true, "User Logged Out Successfully!");
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    successResponse(res, 200, true, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

export { signup, login, logout, getMe };
