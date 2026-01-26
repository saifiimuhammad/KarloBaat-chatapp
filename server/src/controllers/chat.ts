import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import {
  ALERT,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/events.js";
import { getOtherMembers, IUserWithId } from "../lib/helper.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat, IChat, IChatWithId } from "../models/chat.js";
import { Message, IMessage } from "../models/message.js";
import { User, IUser } from "../models/user.js";
import {
  deleteFilesFromCloudinary,
  emitEvent,
  uploadFilesToCloudinary,
} from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";

interface AuthenticatedRequest extends Request {
  user: string; // assuming (req as AuthenticatedRequest).user is user id as string
  files?: Express.Multer.File[];
}

// ----------------- Create Group -----------------
const newGroupChat = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, members }: { name: string; members: string[] } = req.body;

    if (members.length < 2)
      return next(
        new ErrorHandler("Group chat must have at least 3 members.", 400),
      );

    const allMembers = [...members, (req as AuthenticatedRequest).user];

    await Chat.create({
      name,
      groupChat: true,
      creator: (req as AuthenticatedRequest).user,
      members: allMembers,
    });

    emitEvent(req, ALERT, allMembers, `Welcome to ${name} Group`);
    emitEvent(req, REFETCH_CHATS, members);

    return res.status(201).json({
      success: true,
      message: "Group Created",
    });
  },
);

// ----------------- Get My Chats -----------------
const getMyChats = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const chats = await Chat.find({
      members: (req as AuthenticatedRequest).user,
    }).populate<{ members: IUserWithId[] }>("members", "name avatar");

    const transformedChats = chats.map((chat) => {
      const { _id, name, members, groupChat } = chat;
      const otherMember = getOtherMembers(
        members,
        (req as AuthenticatedRequest).user,
      );

      return {
        _id,
        groupChat,
        avatar: groupChat
          ? members.slice(0, 3).map((m) => m.avatar?.url)
          : [otherMember?.avatar?.url],
        name: groupChat ? name : otherMember?.name,
        members: members.reduce<string[]>((prev, curr) => {
          if (
            curr._id.toString() !==
            (req as AuthenticatedRequest).user.toString()
          ) {
            prev.push(curr._id.toString());
          }
          return prev;
        }, []),
      };
    });

    return res.status(200).json({
      success: true,
      chats: transformedChats,
    });
  },
);

// ----------------- Get My Groups -----------------
const getMyGroups = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const chats = await Chat.find({
      members: (req as AuthenticatedRequest).user,
      groupChat: true,
      creator: (req as AuthenticatedRequest).user,
    }).populate<{ members: IUserWithId[] }>("members", "name avatar");

    const groups = chats.map((chat) => {
      const { _id, name, groupChat, members } = chat;
      return {
        _id,
        groupChat,
        name,
        avatar: members.slice(0, 3).map((m) => m.avatar.url),
      };
    });

    return res.status(200).json({
      success: true,
      groups,
    });
  },
);

// ----------------- Add Members -----------------
const addMembers = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId, members }: { chatId: string; members: string[] } = req.body;

    if (!members || members.length < 1)
      return next(new ErrorHandler("Please add members", 400));

    // Define the type for a populated chat
    type PopulatedChat = IChatWithId & { members: IUserWithId[] };

    // Fetch the chat
    const chat = await Chat.findById(chatId)
      .populate<{ members: string[] }>("members")
      .exec();

    if (!chat) return next(new ErrorHandler("Chat not found", 404));
    if (!chat.groupChat)
      return next(new ErrorHandler("This is not a group chat", 400));
    if (chat.creator) {
      if (
        chat.creator.toString() !==
        (req as AuthenticatedRequest).user.toString()
      )
        return next(
          new ErrorHandler("You are not allowed to add members", 403),
        );
    }

    const allMembersPromise = members.map((id) =>
      User.findById<IUserWithId>(id, "name"),
    );
    const allNewMembers = (await Promise.all(
      allMembersPromise,
    )) as IUserWithId[];

    const uniqueMembers = allNewMembers
      .filter((i) => !chat.members.includes(i._id))
      .map((i) => i._id);

    chat.members.push(...uniqueMembers);

    if (chat.members.length > 100)
      return next(new ErrorHandler("Chat limit reached!", 400));

    await chat.save();

    const allUsersName = allNewMembers.map((i) => i.name);
    emitEvent(
      req,
      ALERT,
      chat.members,
      `${allUsersName} has been added in ${chat.name}`,
    );
    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
      success: true,
      message: "Members added successfully",
    });
  },
);

// ----------------- Remove Member -----------------
const removeMember = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, chatId }: { userId: string; chatId: string } = req.body;

    const [chat, userThatWillBeRemoved] = await Promise.all([
      Chat.findById(chatId),
      User.findById(userId, "name"),
    ]);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));
    if (!chat.groupChat)
      return next(new ErrorHandler("This is not a group chat", 400));
    if (chat.creator) {
      if (
        chat.creator.toString() !==
        (req as AuthenticatedRequest).user.toString()
      )
        return next(
          new ErrorHandler("You are not allowed to remove members", 403),
        );
    }
    if (chat.members.length <= 3)
      return next(new ErrorHandler("Chat must have at least 3 members", 400));

    const allChatMembers = chat.members.map((i) => i.toString());
    chat.members = chat.members.filter(
      (i) => i.toString() !== userId.toString(),
    );

    await chat.save();

    emitEvent(
      req,
      ALERT,
      chat.members.map((i) => i.toString()),
      {
        message: `${userThatWillBeRemoved!.name} is removed from ${chat.name}`,
        chatId,
      },
    );
    emitEvent(req, REFETCH_CHATS, allChatMembers);

    return res.status(200).json({
      success: true,
      message: "Member removed successfully!",
    });
  },
);

// ----------------- Leave Group -----------------
const leaveGroup = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);
    if (!chat) return next(new ErrorHandler("Chat not found", 404));
    if (!chat.groupChat)
      return next(new ErrorHandler("This is not a group chat", 400));

    const remainingMembers = chat.members.filter(
      (i) => i.toString() !== (req as AuthenticatedRequest).user.toString(),
    );

    if (remainingMembers.length <= 3)
      return next(new ErrorHandler("Chat must have at least 3 members", 400));

    if (
      chat.creator?.toString() === (req as AuthenticatedRequest).user.toString()
    ) {
      const newCreator = remainingMembers[0]!;
      chat.creator = newCreator;
    }

    chat.members = remainingMembers;

    const [user] = await Promise.all([
      User.findById((req as AuthenticatedRequest).user, "name"),
      chat.save(),
    ]);

    emitEvent(
      req,
      ALERT,
      chat.members.map((i) => i.toString()),
      {
        message: `${user!.name} left the chat`,
        chatId,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Group left successfully!",
    });
  },
);

// ----------------- Send Attachments -----------------
const sendAttachments = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId }: { chatId: string } = req.body;

    const [chat, me] = await Promise.all([
      Chat.findById(chatId),
      User.findById((req as AuthenticatedRequest).user),
    ]);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    const files = (req.files || []) as Express.Multer.File[];

    if (files.length < 1)
      return next(new ErrorHandler("Please provide attachments", 400));
    if (files.length > 6)
      return next(new ErrorHandler("Only 5 files are allowed at a time", 400));

    const attachments = await uploadFilesToCloudinary(files);

    const messageForDb = {
      chat: chatId,
      content: "",
      sender: me!._id,
      attachments,
    };

    const messageForRealTime = {
      ...messageForDb,
      sender: {
        _id: me!._id,
        name: me!.name,
      },
    };

    const message = await Message.create(messageForDb);

    emitEvent(
      req,
      NEW_MESSAGE,
      chat.members.map((i) => i.toString()),
      {
        message: messageForRealTime,
        chatId,
      },
    );

    emitEvent(
      req,
      NEW_MESSAGE_ALERT,
      chat.members.map((i) => i.toString()),
      { chatId },
    );

    return res.status(200).json({
      success: true,
      message,
    });
  },
);

// ----------------- Get Chat Details -----------------
const getChatDetails = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.populate === "true") {
      const chat = await Chat.findById(req.params.id)
        .populate<{ members: IUserWithId[] }>("members", "name avatar")
        .lean();

      if (!chat) return next(new ErrorHandler("Chat not found", 404));

      const transformedMembers = (chat.members as IUserWithId[]).map(
        ({ _id, name, avatar }) => ({
          _id,
          name,
          avatar: avatar.url,
        }),
      );

      return res.status(200).json({
        success: true,
        chat: {
          ...chat,
          members: transformedMembers,
        },
      });
    } else {
      const chat = await Chat.findById(req.params.id);
      if (!chat) return next(new ErrorHandler("Chat not found", 404));
      return res.status(200).json({
        success: true,
        chat,
      });
    }
  },
);

// ----------------- Rename Group -----------------
const renameGroup = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.id;
    const { name }: { name: string } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) return next(new ErrorHandler("Chat not found", 404));
    if (!chat.groupChat)
      return next(new ErrorHandler("This is not a group chat", 400));
    if (chat.creator) {
      if (
        chat.creator.toString() !==
        (req as AuthenticatedRequest).user.toString()
      )
        return next(
          new ErrorHandler("You are not allowed to rename this group", 403),
        );
    }

    chat.name = name;
    await chat.save();
    emitEvent(
      req,
      REFETCH_CHATS,
      chat.members.map((i) => i.toString()),
    );

    return res.status(200).json({
      success: true,
      message: "Group renamed successfully",
    });
  },
);

// ----------------- Delete Chat -----------------
const deleteChat = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);
    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    const members = chat.members;

    const messagesWithAttachments = await Message.find({
      chat: chatId,
      attachments: { $exists: true, $ne: [] },
    });

    const public_ids: string[] = [];
    messagesWithAttachments.forEach((attachment) => {
      attachment.attachments?.forEach(({ public_id }) =>
        public_ids.push(public_id),
      );
    });

    await Promise.all([
      deleteFilesFromCloudinary(public_ids),
      chat.deleteOne(),
      Message.deleteMany({ chat: chatId }),
    ]);

    emitEvent(
      req,
      REFETCH_CHATS,
      members.map((i) => i.toString()),
    );

    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  },
);

// ----------------- Get Messages -----------------
const getMessages = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.id;
    const page = Number(req.query.page) || 1;
    const resultPerPage = 20;
    const skip = (page - 1) * resultPerPage;

    const chat = await Chat.findById(chatId);
    if (!chat) return next(new ErrorHandler("Chat not found", 404));
    if (
      !chat.members.includes(
        new Types.ObjectId((req as AuthenticatedRequest).user),
      )
    )
      return next(
        new ErrorHandler("You are not allowed to access this chat", 403),
      );

    const [messages, totalMessagesCount] = await Promise.all([
      Message.find({ chat: chatId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(resultPerPage)
        .populate("sender", "name")
        .lean(),
      Message.countDocuments({ chat: chatId }),
    ]);

    const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;

    return res.status(200).json({
      success: true,
      messages: messages.reverse(),
      totalPages,
    });
  },
);

export {
  addMembers,
  deleteChat,
  getChatDetails,
  getMessages,
  getMyChats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMember,
  renameGroup,
  sendAttachments,
};
