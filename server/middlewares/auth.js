import { adminSecretKey } from "../app.js";
import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  const token = req.cookies["karlobaat-token"];

  if (!token)
    return next(new ErrorHandler("Please login to access thus route", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decodedData._id;
  next();
};

const adminOnly = (req, res, next) => {
  const token = req.cookies["karlobaat-admin-token"];

  if (!token)
    return next(new ErrorHandler("Only admin can access this route", 401));

  const adminId = jwt.verify(token, process.env.JWT_SECRET);
  const { secretKey } = adminId;
  const isMatched = secretKey === adminSecretKey;
  if (!isMatched) return next(new ErrorHandler("Invalid Admin Key", 401));
  next();
};

export { isAuthenticated, adminOnly };
