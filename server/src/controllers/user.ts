import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import {
  NEW_REQUEST,
  REFETCH_CHATS,
  CANCEL_REQUEST,
} from "../constants/events.js";
import { getOtherMembers, IUserWithId } from "../lib/helper.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Request as FriendRequest } from "../models/request.js";
import { IUser, User } from "../models/user.js";
import {
  cookieOptions,
  emitEvent,
  sendToken,
  uploadFilesToCloudinary,
} from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";

// Extend Express Request with user
export interface AuthenticatedRequest extends Request {
  user: string;
  file?: Express.Multer.File;
}

// --- NEW USER ---
const newUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, username, password, bio } = req.body;
    const file = (req as AuthenticatedRequest).file;
    if (!file) return next(new ErrorHandler("Please upload avatar", 400));

    const result = await uploadFilesToCloudinary([file]);
    if (!result[0]) return next(new ErrorHandler("Avatar upload failed", 500));

    const avatar = {
      public_id: result[0].public_id,
      url: result[0].url,
    };

    const user = await User.create({ name, username, password, bio, avatar });

    sendToken(
      res,
      { ...user.toObject(), _id: user._id.toString() },
      201,
      "User Created!",
    );
  },
);

// --- LOGIN ---
const login = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select("+password");
    if (!user)
      return next(new ErrorHandler("Invalid Username or Password", 404));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return next(new ErrorHandler("Invalid Username or Password", 404));

    sendToken(
      res,
      { ...user.toObject(), _id: user._id.toString() },
      200,
      `Welcome back, ${user.name}`,
    );
  },
);

// --- GET PROFILE ---
const getMyProfile = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById((req as AuthenticatedRequest).user);
    if (!user) return next(new ErrorHandler("User not found", 404));
    res.status(200).json({ success: true, user });
  },
);

// --- LOGOUT ---
const logout = TryCatch(async (req: Request, res: Response) => {
  res
    .status(200)
    .cookie("karlobaat-token", "", { ...cookieOptions, maxAge: 0 })
    .json({ success: true, message: "Logged out successfully" });
});

// --- SEARCH USERS ---
const searchUser = TryCatch(async (req: Request, res: Response) => {
  const name = (req.query.name as string) || "";
  const myId = (req as AuthenticatedRequest).user;

  // 1. Users already in 1-1 chats (friends)
  const myChats = await Chat.find({
    groupChat: false,
    members: myId,
  }).select("members");

  const friendIds = new Set(
    myChats.flatMap((chat) => chat.members.map((m) => m.toString())),
  );

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
const sendFriendRequest = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;

    const request = await FriendRequest.findOne({
      $or: [
        { sender: (req as AuthenticatedRequest).user, reciever: userId },
        { sender: userId, reciever: (req as AuthenticatedRequest).user },
      ],
    });

    if (request) return next(new ErrorHandler("Request already sent", 400));

    await FriendRequest.create({
      sender: (req as AuthenticatedRequest).user,
      reciever: userId,
    });

    emitEvent(req, NEW_REQUEST, [userId], null);

    res.status(200).json({ success: true, message: "Friend Request Sent" });
  },
);

// --- CANCEL FRIEND REQUEST ---
const cancelFriendRequest = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;
    const myId = (req as AuthenticatedRequest).user;

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
  },
);

// --- ACCEPT FRIEND REQUEST ---
const acceptFriendRequest = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { requestId, accept } = req.body;

    const request = await FriendRequest.findById(requestId)
      .populate<{ sender: IUserWithId }>("sender", "name")
      .populate<{ reciever: IUserWithId }>("reciever", "name");

    if (!request) return next(new ErrorHandler("Request not found", 404));
    if (request.reciever._id.toString() !== (req as AuthenticatedRequest).user)
      return next(
        new ErrorHandler("Not authorized to accept this request", 401),
      );

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
  },
);

// --- GET NOTIFICATIONS ---
const getAllNotifications = TryCatch(async (req: Request, res: Response) => {
  const requests = await FriendRequest.find({
    reciever: (req as AuthenticatedRequest).user,
  }).populate<{ sender: IUserWithId }>("sender", "name avatar");

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
const getMyFriends = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.query.chatId as string;
    const chats = await Chat.find({
      members: (req as AuthenticatedRequest).user,
      groupChat: false,
    }).populate<{ members: IUserWithId[] }>("members", "name avatar");

    const friends = chats
      .map(({ members }) => {
        const otherUser = getOtherMembers(
          members,
          (req as AuthenticatedRequest).user,
        );
        if (!otherUser) return null;
        return {
          _id: otherUser._id,
          name: otherUser.name,
          avatar: otherUser.avatar?.url,
        };
      })
      .filter(Boolean);

    if (!friends.length) return next(new ErrorHandler("No friends found", 404));

    if (chatId) {
      const chat = await Chat.findById(chatId).populate(
        "members",
        "name avatar",
      );
      const availableFriends = friends.filter(
        (friend) =>
          !chat?.members.some((m: any) => m._id.toString() === friend?._id),
      );
      return res.status(200).json({ success: true, friends: availableFriends });
    }

    res.status(200).json({ success: true, friends });
  },
);

// --- FETCH USER DETAILS ---
const fetchUserDetails = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return next(new ErrorHandler("User not found", 404));
    res.status(200).json({ success: true, user });
  },
);

// --- EDIT PROFILE ---
const editProfile = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as AuthenticatedRequest).user;
    const { name, username, password, bio } = req.body;

    const updateData: Partial<
      IUser & { avatar?: { url: string; public_id: string } }
    > = {};
    if (name) updateData.name = name.trim();
    if (username) updateData.username = username.trim().toLowerCase();
    if (bio) updateData.bio = bio.trim();
    if (password) updateData.password = await bcrypt.hash(password, 12);

    if ((req as AuthenticatedRequest).file) {
      const result = await uploadFilesToCloudinary([
        (req as AuthenticatedRequest).file!,
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
    if (!updatedUser) return next(new ErrorHandler("User not found", 404));

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  },
);

export {
  acceptFriendRequest,
  editProfile,
  fetchUserDetails,
  getAllNotifications,
  getMyFriends,
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
  cancelFriendRequest,
};
