import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { errorMiddleware } from "./middlewares/error.js";
import adminRoutes from "./routes/admin.js";
import chatRoutes from "./routes/chat.js";
import userRoutes from "./routes/user.js";
import { connectDb } from "./utils/features.js";
import { v4 as uuid } from "uuid";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";
import cors from "cors";

dotenv.config({
  path: "./.env",
});

const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "itsmesaif786";
const userSocketIDs = new Map();

connectDb(mongoURI);

const app = express();
const server = createServer(app);
const io = new Server(server, {});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  })
);

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

io.use((socket, next) => {});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const user = {
    _id: "sfdsadasd",
    name: "Namgo",
  };
  userSocketIDs.set(user._id.toString(), socket.id);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealtime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };
    const messageForDb = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(NEW_MESSAGE, messageForRealtime, {
      chatId,
      message: messageForDb,
    });
    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });

    try {
      await Message.create(messageForDb);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    userSocketIDs.delete(user._id.toString());
  });
});

app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${envMode} mode`);
});

export { adminSecretKey, envMode, userSocketIDs };
