import { model, Schema, Types } from "mongoose";

export interface IMessage {
  sender: Types.ObjectId;
  chat: Types.ObjectId;
  content?: string;
  attachments?: any[];
}

export interface IMessageWithId extends IMessage {
  _id: string;
}

export const messageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  content: { type: String },
  attachments: [{ url: String, public_id: String }],
});

export const Message = model<IMessage>("Message", messageSchema);
