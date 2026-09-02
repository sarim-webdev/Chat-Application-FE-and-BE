import dotenv from "dotenv";

import { connectDb } from "../src/db/db.js";
import { app } from "../src/app.js";

dotenv.config();

let dbConnected = false;

export default async function handler(req, res) {
  try {
    if (!dbConnected) {
      await connectDb();
      dbConnected = true;
    }

    return app(req, res);
  } catch (error) {
    console.error("Serverless Function Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}