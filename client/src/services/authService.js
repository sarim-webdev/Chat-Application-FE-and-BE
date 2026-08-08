import API from "./api";

export const signupUser = async (formData) => {
  return API.post("/auth/signup", formData);
};

export const loginUser = async (data) => {
  return API.post("/auth/login", data);
};

export const logoutUser = async () => {
  return API.post("/auth/logout");
};

export const getCurrentUser = async () => {
  return API.get("/auth/me");
};