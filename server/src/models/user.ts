import mongoose, { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

const { hash } = bcrypt;

// 1. Interface for avatar
interface IAvatar {
  public_id: string;
  url: string;
}

// 2. Interface for User document
export interface IUser extends Document {
  name: string;
  bio: string;
  username: string;
  password: string;
  avatar: IAvatar;
  createdAt: Date;
  updatedAt: Date;
}

// 3. Schema definition
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // will not be returned by default
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// 4. Pre-save hook for password hashing
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password, 10);
  next();
});

// 5. Export the model
export const User = mongoose.models.User || model<IUser>("User", userSchema);
