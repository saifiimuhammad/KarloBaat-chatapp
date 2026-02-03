import mongoose, { Schema, model, Model } from "mongoose";
import bcrypt from "bcryptjs";

const { hash } = bcrypt;

type AvatarType = {
  public_id: string;
  url: string;
};

type VerifType = {
  otpHash?: string | undefined;
  expiresAt?: Date | undefined;
  attempts: number;
};

export interface IUser {
  name: string;
  bio: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
  password: string;
  avatar: AvatarType;
  passwordVerif: VerifType;
  emailVerif: VerifType;
}

export interface IUserWithId extends IUser {
  _id: string;
}

const schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    bio: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    isEmailVerified: { type: Boolean, default: false },
    password: { type: String, required: true, select: false },
    avatar: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    passwordVerif: {
      otpHash: { type: String, required: false, default: undefined },
      expiresAt: { type: Date, required: false, default: undefined },
      attempts: { type: Number, required: false, default: 0 },
    },
    emailVerif: {
      otpHash: { type: String, required: false, default: undefined },
      expiresAt: { type: Date, required: false, default: undefined },
      attempts: { type: Number, required: false, default: 0 },
    },
  },
  { timestamps: true },
);

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password, 10);
  next();
});

export const User: Model<IUser> =
  mongoose.models.User || model<IUser>("User", schema);
