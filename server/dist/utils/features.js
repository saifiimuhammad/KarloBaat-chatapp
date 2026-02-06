import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { v4 as uuid } from "uuid";
import { getBase64, getSockets } from "../lib/helper.js";
import { ErrorHandler } from "./utility.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();
const testAccount = await nodemailer.createTestAccount();
const transporter = nodemailer.createTransport({
    // host: "smtp.ethereal.email",
    service: "gmail",
    // port: 587,
    // secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.GOOGLE_USER || testAccount.user,
        pass: process.env.GOOGLE_PASS || testAccount.pass,
    },
});
/* =======================
   Cookie Options
======================= */
export const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true,
};
/* =======================
   DB Connection
======================= */
const connectDb = (uri) => {
    mongoose
        .connect(uri, { dbName: "KarloBaat" })
        .then((data) => {
        console.log(`Connected to db: ${data.connection.host}`);
    })
        .catch((err) => {
        throw err;
    });
};
/* =======================
   Auth Token Sender
======================= */
const sendToken = (res, user, code, message) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    return res.status(code).cookie("karlobaat-token", token, cookieOptions).json({
        success: true,
        user,
        message,
    });
};
/* =======================
   Socket Event Emitter
======================= */
const emitEvent = (req, event, users, data) => {
    const io = req.app.get("io");
    const usersSockets = getSockets(users);
    io.to(usersSockets).emit(event, data);
};
const uploadFilesToCloudinary = async (files = []) => {
    try {
        const uploadPromises = files.map((file) => cloudinary.uploader.upload(getBase64(file), {
            resource_type: "auto",
            public_id: uuid(),
        }));
        const results = await Promise.all(uploadPromises);
        return results.map((result) => ({
            public_id: result.public_id,
            url: result.secure_url,
        }));
    }
    catch (error) {
        console.error("Cloudinary upload error:", error.message);
        throw new ErrorHandler("Error uploading files to Cloudinary", 500);
    }
};
/* =======================
   Cloudinary Delete
======================= */
const deleteFilesFromCloudinary = async (public_ids) => {
    // Delete files from cloudinary
};
const sendOtpHandler = async (email, otp, subject) => {
    try {
        await transporter.sendMail({
            from: '"Muhammad Saif" <muhammadsaifarain786@gmail.com>',
            to: email,
            subject: subject,
            text: `Your OTP is ${otp}`,
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; text-align: center;">
          <h2 style="color: #333;">Your OTP Code</h2>
          <p style="font-size: 18px; color: #555;">Enter the following code to proceed:</p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #000; margin: 20px 0;">${otp}</p>
          <p style="font-size: 14px; color: #777;">This code will expire in 10 minutes.</p>
          <hr style="margin: 20px 0;" />
          <p style="font-size: 12px; color: #aaa;">If you did not request this, please ignore this email.</p>
        </div>`,
        });
    }
    catch (error) {
        console.error("Error sending OTP email:", error);
    }
};
export { connectDb, deleteFilesFromCloudinary, emitEvent, sendToken, uploadFilesToCloudinary, sendOtpHandler, };
//# sourceMappingURL=features.js.map