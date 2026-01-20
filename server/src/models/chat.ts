import mongoose, { Schema, model, Types, Document } from "mongoose";

export interface IChat extends Document {
  name: string;
  groupChat: boolean;
  creator?: Types.ObjectId;
  members: Types.ObjectId[];
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

export const Chat = mongoose.models.Chat || model<IChat>("Chat", chatSchema);
