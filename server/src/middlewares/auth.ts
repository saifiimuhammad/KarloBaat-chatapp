import type { Request, Response, NextFunction } from "express";
import type { Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";

import { adminSecretKey } from "../app.js";
import { KARLOBAAT_ADMIN_TOKEN, KARLOBAAT_TOKEN } from "../constants/config.js";
import { User, type IUser } from "../models/user.js";
import { ErrorHandler } from "../utils/utility.js";
import type { IncomingMessage } from "node:http";

/* =======================
   Extend Request for user
======================= */
interface AuthRequest extends Request {
  user?: string;
}

/* =======================
   Extend Socket for user & cookies
======================= */
interface AuthSocket extends Socket {
  user?: IUser;
  request: IncomingMessage & {
    cookies?: Record<string, string>;
  };
}

/* =======================
   Express Auth Middleware
======================= */
const isAuthenticated = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.[KARLOBAAT_TOKEN];

  if (!token) {
    return next(new ErrorHandler("Please login to access thus route", 401));
  }

  const decodedData = jwt.verify(
    token,
    process.env.JWT_SECRET as string,
  ) as JwtPayload & { _id: string };

  req.user = decodedData._id;
  next();
};

const adminOnly = (req: Request, _res: Response, next: NextFunction): void => {
  const token = req.cookies?.[KARLOBAAT_ADMIN_TOKEN];

  if (!token) {
    return next(new ErrorHandler("Only admin can access this route", 401));
  }

  const adminId = jwt.verify(
    token,
    process.env.JWT_SECRET as string,
  ) as JwtPayload & { secretKey: string };

  const { secretKey } = adminId;
  const isMatched = secretKey === adminSecretKey;

  if (!isMatched) {
    return next(new ErrorHandler("Invalid Admin Key", 401));
  }

  next();
};

/* =======================
   Socket.IO Auth Middleware
======================= */
const socketAuthenticator = (
  err: Error | undefined,
  socket: AuthSocket,
  next: (err?: Error | undefined) => void,
): void => {
  (async () => {
    try {
      if (err) return next(err);

      const authToken = socket.request.cookies?.[KARLOBAAT_TOKEN];

      if (!authToken) {
        return next(new ErrorHandler("Please login to access this route", 401));
      }

      const decodedData = jwt.verify(
        authToken,
        process.env.JWT_SECRET as string,
      ) as JwtPayload & { _id: string };

      const user = await User.findById(decodedData._id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      socket.user = user;
      next();
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler("Please login to access this route", 401));
    }
  })();
};

export { isAuthenticated, adminOnly, socketAuthenticator };
