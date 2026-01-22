import jwt from "jsonwebtoken";
import { adminSecretKey } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat, IChat, IChatWithId } from "../models/chat.js";
import { Message, IMessage, IMessageWithId } from "../models/message.js";
import { User, IUser } from "../models/user.js";
import { cookieOptions } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { Request, Response, NextFunction } from "express";
import { IUserWithId } from "../lib/helper.js";

// --- ADMIN LOGIN ---
const adminLogin = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { secretKey } = req.body as { secretKey: string };

    if (secretKey !== adminSecretKey) {
      return next(new ErrorHandler("Invalid Admin Key", 401));
    }

    const token = jwt.sign({ secretKey }, process.env.JWT_SECRET!);

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
  },
);

// --- ADMIN LOGOUT ---
const adminLogout = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies["karlobaat-admin-token"]) {
      return next(new ErrorHandler("Already Logged Out", 400));
    }

    return res
      .status(200)
      .cookie("karlobaat-admin-token", "", { ...cookieOptions, maxAge: 0 })
      .json({
        success: true,
        message: "Logged Out Successfully",
      });
  },
);

// --- GET ADMIN DATA ---
const getAdminData = TryCatch(async (_req: Request, res: Response) => {
  res.status(200).json({ admin: true });
});

// --- GET ALL USERS ---
const allUsers = TryCatch(async (_req: Request, res: Response) => {
  const allUsers = await User.find({}).lean<IUserWithId[]>();

  const transformedUsers = await Promise.all(
    allUsers.map(async (user) => {
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
    }),
  );

  res.status(200).json({ success: true, users: transformedUsers });
});

// --- GET ALL CHATS ---
const allChats = TryCatch(async (_req: Request, res: Response) => {
  const allChats = await Chat.find({})
    .populate("members creator", "name avatar")
    .lean<
      (IChatWithId & { members: IUserWithId[]; creator?: IUserWithId })[]
    >();

  const transformedChats = await Promise.all(
    allChats.map(async (chat) => {
      const totalMessages = await Message.countDocuments({ chat: chat._id });
      const members = chat.members as IUserWithId[];

      return {
        ...chat,
        avatar: members.slice(0, 3).map((member) => member.avatar?.url),
        members: members.map((member) => ({
          ...member,
          avatar: member.avatar?.url,
        })),
        creator: {
          name: chat.creator?.name || "None",
          avatar: chat.creator?.avatar?.url || "",
        },
        totalMembers: chat.members.length,
        totalMessages,
      };
    }),
  );

  res.status(200).json({ success: true, chats: transformedChats });
});

// --- GET ALL MESSAGES ---
const allMessages = TryCatch(async (_req: Request, res: Response) => {
  const allMessages = await Message.find({})
    .populate("sender", "name avatar")
    .populate("chat", "groupChat")
    .lean<
      (IMessageWithId & {
        sender: IUserWithId;
        chat: IChatWithId;
        createdAt: Date;
      })[]
    >();

  const transformedMessages = allMessages.map((msg) => ({
    _id: msg._id,
    content: msg.content,
    attachments: msg.attachments,
    sender: {
      _id: msg.sender._id,
      name: msg.sender.name,
      avatar: msg.sender.avatar?.url,
    },
    chat: msg.chat._id,
    groupChat: msg.chat.groupChat,
    createdAt: msg.createdAt,
  }));

  res.status(200).json({ success: true, messages: transformedMessages });
});

// --- DASHBOARD STATS ---
const getDashboardStats = TryCatch(async (_req: Request, res: Response) => {
  const [groupsCount, usersCount, messagesCount, totalChatsCount] =
    await Promise.all([
      Chat.countDocuments({ groupChat: true }),
      User.countDocuments(),
      Message.countDocuments(),
      Chat.countDocuments(),
    ]);

  const singleChatsCount = totalChatsCount - groupsCount;

  const today = new Date();
  const last7Days = new Date();
  last7Days.setDate(today.getDate() - 7);

  const last7DaysMessages = await Message.find<
    Pick<IMessageWithId, never> & { createdAt: Date }
  >({
    createdAt: { $gte: last7Days, $lte: today },
  }).select("createdAt");

  const messagesChart = new Array(7).fill(0);
  const dayMs = 1000 * 60 * 60 * 24;

  last7DaysMessages.forEach((msg) => {
    const index = Math.floor(
      (today.getTime() - msg.createdAt.getTime()) / dayMs,
    );
    messagesChart[6 - index]++;
  });

  res.status(200).json({
    success: true,
    stats: {
      singleChatsCount,
      groupsCount,
      totalChatsCount,
      usersCount,
      messagesCount,
      messagesChart,
    },
  });
});

export {
  adminLogin,
  adminLogout,
  allUsers,
  allChats,
  allMessages,
  getAdminData,
  getDashboardStats,
};
