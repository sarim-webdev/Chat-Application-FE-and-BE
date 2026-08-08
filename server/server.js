import dotenv from "dotenv";
import http from "http";

import { connectDb } from "./src/db/db.js";
import { app } from "./src/app.js";
import { initSocket } from "./src/socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initSocket(server);

connectDb();

export default server;