import express, { Router } from "express";
import {
  adminLogin,
  adminLogout,
  allChats,
  allMessages,
  allUsers,
  getAdminData,
  getDashboardStats,
} from "../controllers/admin.js";
import { adminLoginValidator, validateHandler } from "../lib/validators.js";
import { adminOnly } from "../middlewares/auth.js";

const router: Router = express.Router();

router.post("/verify", adminLoginValidator(), validateHandler, adminLogin);
router.get("/logout", adminLogout);

router.use(adminOnly); // Only admin can access these routes
router.get("/", getAdminData);
router.get("/users", allUsers);
router.get("/chats", allChats);
router.get("/messages", allMessages);
router.get("/stats", getDashboardStats);

export default router;
