import express from "express";
import { login, newUser, getMyProfile, logout, searchUser, sendFriendRequest, acceptFriendRequest, getAllNotifications, getMyFriends, fetchUserDetails, editProfile, cancelFriendRequest, } from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { acceptRequestValidator, loginValidator, registerValidator, sendRequestValidator, validateHandler, } from "../lib/validators.js";
const router = express.Router();
router.post("/new", singleAvatar, registerValidator(), validateHandler, newUser);
router.post("/login", loginValidator(), validateHandler, login);
// User must be logged in to access below routes
router.use(isAuthenticated);
router.get("/me", getMyProfile);
router.get("/logout", logout);
router.get("/search", searchUser);
router.put("/sendrequest", sendRequestValidator(), validateHandler, sendFriendRequest);
router.put("/acceptrequest", acceptRequestValidator(), validateHandler, acceptFriendRequest);
router.put("/cancelrequest", sendRequestValidator(), validateHandler, cancelFriendRequest);
router.get("/notifications", getAllNotifications);
router.get("/friends", getMyFriends);
router.get("/fetch/:id", fetchUserDetails);
router.patch("/update", singleAvatar, editProfile);
export default router;
//# sourceMappingURL=user.js.map