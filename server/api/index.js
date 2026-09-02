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
    // Connect MongoDB
    if (!dbConnected) {
      await connectDb();
      dbConnected = true;
    }

    // Create HTTP server
    if (!server) {
      server = http.createServer(app);
    }

    // Initialize Socket.IO
    if (!ioInitialized) {
      initSocket(server);
      ioInitialized = true;
    }

    // Handle Express API request
    return app(req, res);
  } catch (error) {
    console.error("Serverless Function Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}