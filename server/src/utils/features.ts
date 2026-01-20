import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { v4 as uuid } from "uuid";
import type { Request, Response } from "express";
import { getBase64, getSockets } from "../lib/helper.js";
import { ErrorHandler } from "./utility.js";

/* =======================
   Cookie Options
======================= */

export const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none" as const,
  httpOnly: true,
  secure: true,
};

/* =======================
   DB Connection
======================= */

const connectDb = (uri: string): void => {
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

const sendToken = (
  res: Response,
  user: { _id: string },
  code: number,
  message: string,
): Response => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string);

  return res.status(code).cookie("karlobaat-token", token, cookieOptions).json({
    success: true,
    user,
    message,
  });
};

/* =======================
   Socket Event Emitter
======================= */

const emitEvent = (
  req: Request,
  event: string,
  users: string[],
  data: unknown,
): void => {
  const io = req.app.get("io");
  const usersSockets = getSockets(users);
  io.to(usersSockets).emit(event, data);
};

/* =======================
   Cloudinary Upload
======================= */

interface UploadedFile {
  public_id: string;
  url: string;
}

const uploadFilesToCloudinary = async (
  files: any[] = [],
): Promise<UploadedFile[]> => {
  try {
    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(getBase64(file), {
        resource_type: "auto",
        public_id: uuid(),
      }),
    );

    const results = await Promise.all(uploadPromises);

    return results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));
  } catch (error: any) {
    console.error("Cloudinary upload error:", error.message);
    throw new ErrorHandler("Error uploading files to Cloudinary", 500);
  }
};

/* =======================
   Cloudinary Delete
======================= */

const deleteFilesFromCloudinary = async (
  public_ids: string[],
): Promise<void> => {
  // Delete files from cloudinary
};

export {
  connectDb,
  deleteFilesFromCloudinary,
  emitEvent,
  sendToken,
  uploadFilesToCloudinary,
};
