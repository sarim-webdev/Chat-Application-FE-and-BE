import express from "express";
import { verifyUser } from "../middleware/verifyUser.js";
import { addContact, getContacts } from "../controllers/contactController.js";

const contactRoutes = express.Router();

contactRoutes.post("/add", verifyUser, addContact);
contactRoutes.get("/", verifyUser, getContacts);

export { contactRoutes };
