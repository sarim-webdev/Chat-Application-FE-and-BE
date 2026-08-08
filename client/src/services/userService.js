import API from "./api";

export const updateProfile = (data) => {
  return API.put("/user/update-profile", data);
};

export const updateProfileImage = async (profileImage) => {
  return API.put("/user/profile-image", {
    profileImage,
  });
};