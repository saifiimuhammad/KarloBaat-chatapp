import type { Request, Response, NextFunction } from "express";
import type { Socket } from "socket.io";
import { type IUser } from "../models/user.js";
import type { IncomingMessage } from "node:http";
interface AuthRequest extends Request {
    user?: string;
}
interface AuthSocket extends Socket {
    user?: IUser;
    request: IncomingMessage & {
        cookies?: Record<string, string>;
    };
}
declare const isAuthenticated: (req: AuthRequest, _res: Response, next: NextFunction) => void;
declare const adminOnly: (req: Request, _res: Response, next: NextFunction) => void;
declare const socketAuthenticator: (err: Error | undefined, socket: AuthSocket, next: (err?: Error | undefined) => void) => void;
export { isAuthenticated, adminOnly, socketAuthenticator };
//# sourceMappingURL=auth.d.ts.map