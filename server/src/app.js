import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { authRoutes } from "./routes/authRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
import { chatRoutes } from "./routes/chatRoutes.js";
import { messageRoutes } from "./routes/messageRoutes.js";
import { groupRoutes } from "./routes/groupRoutes.js";
import { contactRoutes } from "./routes/contactRoutes.js";
import { notificationRoutes } from "./routes/notificationRoutes.js";
import { callRoutes } from "./routes/callRoutes.js";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: "Too many requests!",
});

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(limiter);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/call", callRoutes)

app.use(errorMiddleware);

export { app };