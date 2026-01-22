import { Request, Response, NextFunction } from "express";
declare const newGroupChat: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const getMyChats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const getMyGroups: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const addMembers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const removeMember: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const leaveGroup: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const sendAttachments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const getChatDetails: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const renameGroup: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const deleteChat: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const getMessages: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export { addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMember, renameGroup, sendAttachments, };
//# sourceMappingURL=chat.d.ts.map