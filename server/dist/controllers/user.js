import bcrypt from "bcryptjs";
import { NEW_REQUEST, REFETCH_CHATS, CANCEL_REQUEST, } from "../constants/events.js";
import { getOtherMembers } from "../lib/helper.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Request as FriendRequest } from "../models/request.js";
import { User } from "../models/user.js";
import { cookieOptions, emitEvent, sendOtpHandler, sendToken, uploadFilesToCloudinary, } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import validator from "validator";
// --- NEW USER ---
const newUser = TryCatch(async (req, res, next) => {
    const { name, username, email, password, bio } = req.body;
    const file = req.file;
    if (!file)
        return next(new ErrorHandler("Please upload avatar", 400));
    const result = await uploadFilesToCloudinary([file]);
    if (!result[0])
        return next(new ErrorHandler("Avatar upload failed", 500));
    const avatar = {
        public_id: result[0].public_id,
        url: result[0].url,
    };
    await User.create({
        name,
        username,
        email,
        password,
        bio,
        avatar,
    });
    // sendToken(
    //   res,
    //   { ...user.toObject(), _id: user._id.toString() },
    //   201,
    //   "User Created!",
    // );
    res.status(201).json({
        success: true,
        message: "User Created! Please verify your email.",
    });
});
// --- SEND OTP ---
const sendOtp = TryCatch(async (req, res, next) => {
    const { email, type } = req.body;
    if (!["email", "password"].includes(type)) {
        return next(new ErrorHandler("Invalid OTP type", 400));
    }
    const user = await User.findOne({ email });
    if (!user)
        return next(new ErrorHandler("User not found", 404));
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 12);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    // Decide config dynamically
    const otpConfig = type === "email"
        ? {
            verifField: "emailVerif",
            subject: "KarloBaat OTP - Email Verification",
        }
        : {
            verifField: "passwordVerif",
            subject: "KarloBaat OTP - Password Reset",
        };
    // Send OTP
    await sendOtpHandler(email, otp, otpConfig.subject);
    // Update correct verification object
    user[otpConfig.verifField] = {
        otpHash,
        expiresAt,
        attempts: (user[otpConfig.verifField]?.attempts || 0) + 1,
    };
    await user.save();
    res.status(200).json({
        success: true,
        message: `OTP sent for ${type} verification`,
    });
});
// --- VERIFY OTP ---
const verifyOtp = TryCatch(async (req, res, next) => {
    const { email, otp } = req.body;
    console.log(email);
    const user = await User.findOne({ email });
    if (!user)
        return next(new ErrorHandler("User not found", 404));
    if (user.emailVerif.otpHash &&
        user.emailVerif.expiresAt &&
        user.emailVerif.expiresAt < new Date()) {
        return next(new ErrorHandler("OTP expired", 400));
    }
    const isMatch = await bcrypt.compare(otp, user.emailVerif.otpHash);
    if (!isMatch)
        return next(new ErrorHandler("Invalid OTP", 400));
    user.isEmailVerified = true;
    user.emailVerif = {
        ...user.emailVerif,
        otpHash: undefined,
        expiresAt: undefined,
        attempts: 0,
    };
    await user.save();
    sendToken(res, { ...user.toObject(), _id: user._id.toString() }, 200, "Email verified successfully");
});
// --- VERIFY PASSWORD OTP ---
const verifyPasswordOtp = TryCatch(async (req, res, next) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user)
        return next(new ErrorHandler("User not found", 404));
    if (user.passwordVerif.otpHash &&
        user.passwordVerif.expiresAt &&
        user.passwordVerif.expiresAt < new Date()) {
        return next(new ErrorHandler("OTP expired", 400));
    }
    const isMatch = await bcrypt.compare(otp, user.passwordVerif.otpHash);
    if (!isMatch)
        return next(new ErrorHandler("Invalid OTP", 400));
    user.otpPasswordVerified = true;
    user.passwordVerif = {
        ...user.passwordVerif,
        otpHash: undefined,
        expiresAt: undefined,
        attempts: 0,
    };
    await user.save();
    res.status(200).json({
        success: true,
        message: "OTP verified successfully. You can now reset your password.",
    });
});
// --- CHANGE PASSWORD ---
const changePassword = TryCatch(async (req, res, next) => {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user)
        return next(new ErrorHandler("User not found", 404));
    if (!user.otpPasswordVerified) {
        return next(new ErrorHandler("OTP not verified. Cannot change password.", 400));
    }
    // Update password
    user.password = newPassword;
    user.otpPasswordVerified = false;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Password changed successfully",
    });
});
// --- LOGIN ---
const login = TryCatch(async (req, res, next) => {
    const { identifier, password } = req.body;
    // Determine if input is email
    const query = validator.isEmail(identifier)
        ? { email: identifier }
        : { username: identifier };
    const user = await User.findOne(query).select("+password");
    if (!user)
        return next(new ErrorHandler("Invalid Username or Password", 404));
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        return next(new ErrorHandler("Invalid Username or Password", 404));
    // check if email is verified
    if (!user.isEmailVerified) {
        // send OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otp, 12);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        user.emailVerif = {
            otpHash,
            expiresAt,
            attempts: (user.emailVerif?.attempts || 0) + 1,
        };
        await user.save();
        await sendOtpHandler(user.email, otp, "KarloBaat OTP - Email Verification");
        return res.status(200).json({
            success: true,
            email: user.email,
            redirect: "/verify-email",
            message: "Email not verified. OTP sent.",
        });
    }
    // if verified, send token
    sendToken(res, { ...user.toObject(), _id: user._id.toString() }, 200, `Welcome back, ${user.name}`);
});
// --- GET PROFILE ---
const getMyProfile = TryCatch(async (req, res, next) => {
    const user = await User.findById(req.user);
    if (!user)
        return next(new ErrorHandler("User not found", 404));
    res.status(200).json({ success: true, user });
});
// --- LOGOUT ---
const logout = TryCatch(async (req, res) => {
    res
        .status(200)
        .cookie("karlobaat-token", "", { ...cookieOptions, maxAge: 0 })
        .json({ success: true, message: "Logged out successfully" });
});
// --- SEARCH USERS ---
const searchUser = TryCatch(async (req, res) => {
    const name = req.query.name || "";
    const myId = req.user;
    // 1. Users already in 1-1 chats (friends)
    const myChats = await Chat.find({
        groupChat: false,
        members: myId,
    }).select("members");
    const friendIds = new Set(myChats.flatMap((chat) => chat.members.map((m) => m.toString())));
    // 2. Users I already sent friend requests to
    const sentRequests = await FriendRequest.find({
        sender: myId,
        status: "pending",
    }).select("reciever");
    const requestedIds = new Set(sentRequests.map((r) => r.reciever.toString()));
    // 3. Search users (exclude me + friends)
    const users = await User.find({
        _id: { $ne: myId, $nin: [...friendIds] },
        name: { $regex: name, $options: "i" },
    }).select("name avatar");
    // 4. Attach request status
    const result = users.map((user) => ({
        _id: user._id.toString(),
        name: user.name,
        avatar: user.avatar?.url,
        requestSent: requestedIds.has(user._id.toString()),
    }));
    res.status(200).json({
        success: true,
        users: result,
    });
});
// --- SEND FRIEND REQUEST ---
const sendFriendRequest = TryCatch(async (req, res, next) => {
    const { userId } = req.body;
    const request = await FriendRequest.findOne({
        $or: [
            { sender: req.user, reciever: userId },
            { sender: userId, reciever: req.user },
        ],
    });
    if (request)
        return next(new ErrorHandler("Request already sent", 400));
    await FriendRequest.create({
        sender: req.user,
        reciever: userId,
    });
    emitEvent(req, NEW_REQUEST, [userId], null);
    res.status(200).json({ success: true, message: "Friend Request Sent" });
});
// --- CANCEL FRIEND REQUEST ---
const cancelFriendRequest = TryCatch(async (req, res, next) => {
    const { userId } = req.body;
    const myId = req.user;
    const request = await FriendRequest.findOne({
        sender: myId,
        reciever: userId,
        status: "pending",
    });
    if (!request)
        return next(new ErrorHandler("No pending request found", 404));
    await request.deleteOne();
    emitEvent(req, CANCEL_REQUEST, [userId], null);
    res.status(200).json({
        success: true,
        message: "Friend request cancelled",
    });
});
// --- ACCEPT FRIEND REQUEST ---
const acceptFriendRequest = TryCatch(async (req, res, next) => {
    const { requestId, accept } = req.body;
    const request = await FriendRequest.findById(requestId)
        .populate("sender", "name")
        .populate("reciever", "name");
    if (!request)
        return next(new ErrorHandler("Request not found", 404));
    if (request.reciever._id.toString() !== req.user)
        return next(new ErrorHandler("Not authorized to accept this request", 401));
    if (!accept) {
        await request.deleteOne();
        return res
            .status(200)
            .json({ success: true, message: "Friend Request Rejected" });
    }
    const members = [
        request.sender._id.toString(),
        request.reciever._id.toString(),
    ];
    await Promise.all([
        Chat.create([
            {
                members,
                name: `${request.sender.name}-${request.reciever.name}`,
            },
        ]),
        request.deleteOne(),
    ]);
    emitEvent(req, REFETCH_CHATS, members, null);
    res.status(200).json({
        success: true,
        message: "Friend Request Accepted",
        senderId: request.sender._id,
    });
});
// --- GET NOTIFICATIONS ---
const getAllNotifications = TryCatch(async (req, res) => {
    const requests = await FriendRequest.find({
        reciever: req.user,
    }).populate("sender", "name avatar");
    const allRequests = requests.map(({ _id, sender }) => ({
        _id: _id.toString(),
        sender: {
            _id: sender._id.toString(),
            name: sender.name,
            avatar: sender.avatar?.url,
        },
    }));
    res.status(200).json({ success: true, requests: allRequests });
});
// --- GET FRIENDS ---
const getMyFriends = TryCatch(async (req, res, next) => {
    const chatId = req.query.chatId;
    const chats = await Chat.find({
        members: req.user,
        groupChat: false,
    }).populate("members", "name avatar");
    const friends = chats
        .map(({ members }) => {
        const otherUser = getOtherMembers(members, req.user);
        if (!otherUser)
            return null;
        return {
            _id: otherUser._id,
            name: otherUser.name,
            avatar: otherUser.avatar?.url,
        };
    })
        .filter(Boolean);
    if (!friends.length)
        return next(new ErrorHandler("No friends found", 404));
    if (chatId) {
        const chat = await Chat.findById(chatId).populate("members", "name avatar");
        const availableFriends = friends.filter((friend) => !chat?.members.some((m) => m._id.toString() === friend?._id));
        return res.status(200).json({ success: true, friends: availableFriends });
    }
    res.status(200).json({ success: true, friends });
});
// --- FETCH USER DETAILS ---
const fetchUserDetails = TryCatch(async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user)
        return next(new ErrorHandler("User not found", 404));
    res.status(200).json({ success: true, user });
});
// --- EDIT PROFILE ---
const editProfile = TryCatch(async (req, res, next) => {
    const userId = req.user;
    const { name, username, password, bio } = req.body;
    const updateData = {};
    if (name)
        updateData.name = name.trim();
    if (username)
        updateData.username = username.trim().toLowerCase();
    if (bio)
        updateData.bio = bio.trim();
    if (password)
        updateData.password = await bcrypt.hash(password, 12);
    if (req.file) {
        const result = await uploadFilesToCloudinary([
            req.file,
        ]);
        if (result[0])
            updateData.avatar = {
                public_id: result[0].public_id,
                url: result[0].url,
            };
    }
    if (!Object.keys(updateData).length)
        return next(new ErrorHandler("Nothing to update", 400));
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
        select: "-password",
    });
    if (!updatedUser)
        return next(new ErrorHandler("User not found", 404));
    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
    });
});
export { acceptFriendRequest, editProfile, fetchUserDetails, getAllNotifications, getMyFriends, getMyProfile, login, logout, newUser, searchUser, sendFriendRequest, cancelFriendRequest, sendOtp, verifyOtp, verifyPasswordOtp, changePassword, };
//# sourceMappingURL=user.js.map