import mongoose, { Schema, model, Types, Model } from "mongoose";

export interface IChat {
  name: string;
  groupChat: boolean;
  creator?: Types.ObjectId;
  members: Types.ObjectId[];
}

export interface IChatWithId extends IChat {
  _id: string;
}

const chatSchema = new Schema<IChat>(
  {
    name: {
      type: String,
      required: true,
    },
    groupChat: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Chat: Model<IChat> =
  mongoose.models.Chat || model<IChat>("Chat", chatSchema);
