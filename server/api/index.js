import dotenv from "dotenv";
import http from "http";

import { connectDb } from "../src/db/db.js";
import { app } from "../src/app.js";
import { initSocket } from "../src/socket/socket.js";

dotenv.config();

let dbConnected = false;
let ioInitialized = false;
let server;

export default async function handler(req, res) {
  try {
    // MongoDB connection
    if (!dbConnected) {
      await connectDb();
      dbConnected = true;
    }

    // Create HTTP server only once
    if (!server) {
      server = http.createServer(app);
    }

    // Initialize Socket.IO only once
    if (!ioInitialized) {
      initSocket(server);
      ioInitialized = true;
    }

    return app(req, res);
  } catch (error) {
    console.error("Serverless Function Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}