import { model, Schema } from "mongoose";
export const messageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    content: { type: String },
    attachments: [{ url: String, public_id: String }],
});
export const Message = model("Message", messageSchema);
//# sourceMappingURL=message.js.map