import mongoose, { Schema, model, Model } from "mongoose";
import bcrypt from "bcryptjs";

const { hash } = bcrypt;

type AvatarType = {
  public_id: string;
  url: string;
};

export interface IUser {
  name: string;
  bio: string;
  username: string;
  password: string;
  avatar: AvatarType;
}

export interface IUserWithId extends IUser {
  _id: string; // new property
}

const schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    bio: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    avatar: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  },
  { timestamps: true },
);

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password, 10);
});

export const User: Model<IUser> =
  mongoose.models.User || model<IUser>("User", schema);
