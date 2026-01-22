import bcrypt from "bcryptjs";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMembers } from "../lib/helper.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Request as FriendRequest } from "../models/request.js";
import { User } from "../models/user.js";
import { cookieOptions, emitEvent, sendToken, uploadFilesToCloudinary, } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
// --- NEW USER ---
const newUser = TryCatch(async (req, res, next) => {
    const { name, username, password, bio } = req.body;
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
    const user = await User.create({ name, username, password, bio, avatar });
    sendToken(res, { ...user.toObject(), _id: user._id.toString() }, 201, "User Created!");
});
// --- LOGIN ---
const login = TryCatch(async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select("+password");
    if (!user)
        return next(new ErrorHandler("Invalid Username or Password", 404));
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        return next(new ErrorHandler("Invalid Username or Password", 404));
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
    const myChats = await Chat.find({
        groupChat: false,
        members: req.user,
    });
    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members.map((m) => m.toString()));
    const allUsersExceptMeAndFriends = await User.find({
        _id: { $nin: allUsersFromMyChats },
        name: { $regex: name, $options: "i" },
    });
    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
        _id: _id.toString(),
        name,
        avatar: avatar?.url,
    }));
    res.status(200).json({ success: true, users });
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
export { acceptFriendRequest, editProfile, fetchUserDetails, getAllNotifications, getMyFriends, getMyProfile, login, logout, newUser, searchUser, sendFriendRequest, };
//# sourceMappingURL=user.js.map