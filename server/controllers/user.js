




import { User } from '../models/user.js';
import { sendToken, cookieOptions } from '../utils/features.js';
import { TryCatch } from '../middlewares/error.js';
import { ErrorHandler } from '../utils/utility.js';
import bcrypt from 'bcryptjs';

const { compare } = bcrypt;


// Creates new user, save it to database and in cookie
const newUser = TryCatch(async (req, res) => {
 const { name, username, password, bio } = req.body;

  const avatar = {
    public_id: "djfjfdk",
    url: "djdjfjfjf"
  }

 const user = await User.create({
   name,
    username,
    password,
    bio,
    avatar
  })
  sendToken(res, user, 201, "User Created!");
});


// Check the login user
const login = TryCatch(async (req, res, next) => {

  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if(!user) return next(new ErrorHandler("Invalid Username or Password", 404));

  const isPasswordMatch = await compare(password, user.password);

  if(!isPasswordMatch) return next(new ErrorHandler("Invalid Username or Password", 404));

  sendToken(res, user, 200, `Welcome back, ${user.name}`)
});

// User can view his/her profile
const getMyProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);

  res.status(200).json({
    success: true,
    user,
  });
});

const logout = TryCatch(async (req, res) => {
  return res.status(200).cookie("karlobaat-token", "", {
    ...cookieOptions,
    maxAge: 0
  }).json({
    success: true,
    message: "Logged out successfully"
  });
});

const searchUser = TryCatch(async (req, res) => {
  const { name } = req.query;

  return res.status(200).json({
    success: true,
    message: name
  });
});

export {
  login,
  newUser,
  getMyProfile,
  logout,
  searchUser
}

