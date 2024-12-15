
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
}




const connectDb = (uri) => {
  mongoose.connect(uri, { dbName: "KarloBaat" }).then((data) => {
    console.log(`Connected to db: ${data.connection.host}`)
  }).catch((err) => {
    throw err;
  })
}


const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET);                                  

  return res.status(code).cookie("karlobaat-token", token, cookieOptions).json({
      success: true,
      message,
    })
};

export {
  connectDb,
  sendToken,
  cookieOptions
}
