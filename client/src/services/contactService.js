import API from "./api";

export const addContact = async (email) => {
  const res = await API.post("/contact/add", {
    email,
  });

  return res.data;
};

export const getContacts = async () => {
  const res = await API.get("/contact");

  return res.data;
};