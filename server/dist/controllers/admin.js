import jwt from "jsonwebtoken";
import { adminSecretKey } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { cookieOptions } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
const adminLogin = TryCatch(async (req, res, next) => {
    const { secretKey } = req.body;
    const isMatched = secretKey === adminSecretKey;
    if (!isMatched)
        return next(new ErrorHandler("Invalid Admin Key", 401));
    const token = jwt.sign({ secretKey }, process.env.JWT_SECRET);
    return res
        .status(200)
        .cookie("karlobaat-admin-token", token, {
        ...cookieOptions,
        maxAge: 1000 * 60 * 15,
    })
        .json({
        success: true,
        message: "Authenticated Successfully, Welcome Sir",
    });
});
const adminLogout = TryCatch(async (req, res, next) => {
    if (!req.cookies["karlobaat-admin-token"])
        return next(new ErrorHandler("Already Logged Out", 400));
    return res
        .status(200)
        .cookie("karlobaat-admin-token", "", {
        ...cookieOptions,
        maxAge: 0,
    })
        .json({
        success: true,
        message: "Logged Out Successfully",
    });
});
const getAdminData = TryCatch(async (req, res, next) => {
    return res.status(200).json({
        admin: true,
    });
});
const allUsers = TryCatch(async (req, res, next) => {
    const allUsers = await User.find({}).lean();
    const transformedUsers = await Promise.all(allUsers?.map(async (user) => {
        const [groups, friends] = await Promise.all([
            Chat.countDocuments({ groupChat: true, members: user._id }),
            Chat.countDocuments({ groupChat: false, members: user._id }),
        ]);
        return {
            ...user,
            avatar: user.avatar?.url,
            groups,
            friends,
        };
    }));
    return res.status(200).json({
        success: true,
        users: transformedUsers,
    });
});
const allChats = TryCatch(async (req, res, next) => {
    const allChats = await Chat.find({})
        .populate("members", "name avatar")
        .populate("creator", "name avatar")
        .lean();
    const transformedChats = await Promise.all(allChats?.map(async (chat) => {
        const totalMessages = await Message.countDocuments({ chat: chat._id });
        return {
            ...chat,
            avatar: chat.members.slice(0, 3).map((member) => member.avatar.url),
            members: chat.members.map((member) => ({
                ...member,
                avatar: member.avatar.url,
            })),
            creator: {
                name: chat?.creator?.name || "None",
                avatar: chat?.creator?.avatar?.url || "",
            },
            totalMembers: chat.members.length,
            totalMessages,
        };
    }));
    return res.status(200).json({
        success: true,
        chats: transformedChats,
    });
});
const allMessages = TryCatch(async (req, res, next) => {
    const allMessages = await Message.find({})
        .populate("sender", "name avatar")
        .populate("chat", "groupChat")
        .lean();
    const transformedMessages = allMessages.map(({ _id, content, attachments, sender, chat, createdAt }) => {
        return {
            _id,
            content,
            attachments,
            sender: {
                _id: sender._id,
                name: sender.name,
                avatar: sender.avatar.url,
            },
            chat: chat._id,
            groupChat: chat.groupChat,
            createdAt,
        };
    });
    return res.status(200).json({
        success: true,
        messages: transformedMessages,
    });
});
const getDashboardStats = TryCatch(async (req, res, next) => {
    const [groupsCount, usersCount, messagesCount, totalChatsCount] = await Promise.all([
        Chat.countDocuments({ groupChat: true }),
        User.countDocuments(),
        Message.countDocuments(),
        Chat.countDocuments(),
    ]);
    const singleChatsCount = totalChatsCount - groupsCount;
    const today = new Date();
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const last7DaysMessages = await Message.find({
        createdAt: {
            $gte: last7Days,
            $lte: today,
        },
    }).select("createdAt");
    const messages = new Array(7).fill(0);
    const daysInMiliseconds = 1000 * 60 * 60 * 24;
    last7DaysMessages.forEach((message) => {
        const indexApprox = (today.getTime() - message.createdAt.getTime()) / daysInMiliseconds;
        const index = Math.floor(indexApprox);
        messages[6 - index]++;
    });
    const stats = {
        singleChatsCount,
        groupsCount,
        totalChatsCount,
        usersCount,
        messagesCount,
        messagesChart: messages,
    };
    return res.status(200).json({
        success: true,
        stats,
    });
});
export { adminLogin, adminLogout, allChats, allMessages, allUsers, getAdminData, getDashboardStats, };
//# sourceMappingURL=admin.js.map