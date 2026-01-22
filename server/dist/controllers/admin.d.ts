import { Request, Response, NextFunction } from "express";
declare const adminLogin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const adminLogout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const getAdminData: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const allUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const allChats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const allMessages: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const getDashboardStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export { adminLogin, adminLogout, allUsers, allChats, allMessages, getAdminData, getDashboardStats, };
//# sourceMappingURL=admin.d.ts.map