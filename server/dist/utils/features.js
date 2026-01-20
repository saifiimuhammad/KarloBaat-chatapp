import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { v4 as uuid } from "uuid";
import { getBase64, getSockets } from "../lib/helper.js";
import { ErrorHandler } from "./utility.js";
const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true,
};
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
const sendToken = (res, user, code, message) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    return res.status(code).cookie("karlobaat-token", token, cookieOptions).json({
        success: true,
        user,
        message,
    });
};
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
const deleteFilesFromCloudinary = async (public_ids) => {
    // Delete files from cloudinary
};
export { connectDb, cookieOptions, deleteFilesFromCloudinary, emitEvent, sendToken, uploadFilesToCloudinary, };
//# sourceMappingURL=features.js.map