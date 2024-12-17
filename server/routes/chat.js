import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroup,
  sendAttachements,
  getChatDetails,
  renameGroup,
  deleteChat,
  getMessages,
} from "../controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";

const app = express.Router();

// User must be logged in to access below routes

app.use(isAuthenticated);

app.post("/new", newGroupChat);
app.get("/my", getMyChats);
app.get("/my/groups", getMyGroups);
app.put("/addmembers", addMembers);
app.put("/remove", removeMember);
app.delete("/leave/:id", leaveGroup);
app.post("/message", attachmentsMulter, sendAttachements);                      // Send Attachments
app.get("/message/:id", getMessages);                                           // Get Messages
app.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat);      // Get Chat details, Rename, Remove

export default app;
