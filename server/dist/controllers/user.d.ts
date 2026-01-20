import { Request, Response, NextFunction } from "express";
export interface AuthenticatedRequest extends Request {
    user: string;
    file?: Express.Multer.File;
}
declare const newUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const getMyProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const searchUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const sendFriendRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const acceptFriendRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const getAllNotifications: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const getMyFriends: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const fetchUserDetails: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const editProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export { acceptFriendRequest, getAllNotifications, getMyFriends, getMyProfile, login, logout, newUser, searchUser, sendFriendRequest, fetchUserDetails, editProfile, };
//# sourceMappingURL=user.d.ts.map