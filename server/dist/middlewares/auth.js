import jwt from "jsonwebtoken";
import { adminSecretKey } from "../app.js";
import { KARLOBAAT_ADMIN_TOKEN, KARLOBAAT_TOKEN } from "../constants/config.js";
import { User } from "../models/user.js";
import { ErrorHandler } from "../utils/utility.js";
/* =======================
   Express Auth Middleware
======================= */
const isAuthenticated = (req, _res, next) => {
    const token = req.cookies?.[KARLOBAAT_TOKEN];
    if (!token) {
        return next(new ErrorHandler("Please login to access thus route", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedData._id;
    next();
};
const adminOnly = (req, _res, next) => {
    const token = req.cookies?.[KARLOBAAT_ADMIN_TOKEN];
    if (!token) {
        return next(new ErrorHandler("Only admin can access this route", 401));
    }
    const adminId = jwt.verify(token, process.env.JWT_SECRET);
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
const socketAuthenticator = (err, socket, next) => {
    (async () => {
        try {
            if (err)
                return next(err);
            const authToken = socket.request.cookies?.[KARLOBAAT_TOKEN];
            if (!authToken) {
                return next(new ErrorHandler("Please login to access this route", 401));
            }
            const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);
            const user = await User.findById(decodedData._id);
            if (!user) {
                return next(new ErrorHandler("User not found", 404));
            }
            socket.user = user;
            next();
        }
        catch (error) {
            console.log(error);
            return next(new ErrorHandler("Please login to access this route", 401));
        }
    })();
};
export { isAuthenticated, adminOnly, socketAuthenticator };
//# sourceMappingURL=auth.js.map