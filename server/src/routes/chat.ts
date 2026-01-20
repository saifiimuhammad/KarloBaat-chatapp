import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroup,
  sendAttachments,
  getChatDetails,
  renameGroup,
  deleteChat,
  getMessages,
} from "../controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";
import {
  addMemberValidator,
  chatIdValidator,
  newGroupValidator,
  removeMemberValidator,
  renameValidator,
  sendAttachementsValidator,
  validateHandler,
} from "../lib/validators.js";

const router: Router = express.Router();

// User must be logged in to access below routes
router.use(isAuthenticated);

router.post("/new", newGroupValidator(), validateHandler, newGroupChat);
router.get("/my", getMyChats);
router.get("/my/groups", getMyGroups);
router.put("/addmembers", addMemberValidator(), validateHandler, addMembers);
router.put(
  "/removemember",
  removeMemberValidator(),
  validateHandler,
  removeMember
);
router.delete("/leave/:id", chatIdValidator(), validateHandler, leaveGroup);

router.post(
  "/message",
  attachmentsMulter,
  sendAttachementsValidator(),
  validateHandler,
  sendAttachments
); // Send Attachments
router.get("/message/:id", chatIdValidator(), validateHandler, getMessages); // Get Messages

router
  .route("/:id")
  .get(chatIdValidator(), validateHandler, getChatDetails)
  .put(renameValidator(), validateHandler, renameGroup)
  .delete(chatIdValidator(), validateHandler, deleteChat); // Get Chat details, Rename, Remove

export default router;
