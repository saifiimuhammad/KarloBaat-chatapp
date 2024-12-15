


import { ErrorHandler } from '../utils/utility.js';
import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
  const token = req.cookies["karlobaat-token"]
  
  if(!token) return next(new ErrorHandler("Please login to access thus route", 401))

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decodedData._id;

};

export {
  isAuthenticated
}
