import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { newGroupChat, getMyChats, getMyGroups, addMembers, removeMember, leaveGroup, sendAttachments, getChatDetails, renameGroup, deleteChat, getMessages, } from "../controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";
import { addMemberValidator, chatIdValidator, newGroupValidator, removeMemberValidator, renameValidator, sendAttachementsValidator, validateHandler, } from "../lib/validators.js";
const app = express.Router();
// User must be logged in to access below routes
app.use(isAuthenticated);
app.post("/new", newGroupValidator(), validateHandler, newGroupChat);
app.get("/my", getMyChats);
app.get("/my/groups", getMyGroups);
app.put("/addmembers", addMemberValidator(), validateHandler, addMembers);
app.put("/removemember", removeMemberValidator(), validateHandler, removeMember);
app.delete("/leave/:id", chatIdValidator(), validateHandler, leaveGroup);
app.post("/message", attachmentsMulter, sendAttachementsValidator(), validateHandler, sendAttachments); // Send Attachments
app.get("/message/:id", chatIdValidator(), validateHandler, getMessages); // Get Messages
app
    .route("/:id")
    .get(chatIdValidator(), validateHandler, getChatDetails)
    .put(renameValidator(), validateHandler, renameGroup)
    .delete(chatIdValidator(), validateHandler, deleteChat); // Get Chat details, Rename, Remove
export default app;
//# sourceMappingURL=chat.js.map