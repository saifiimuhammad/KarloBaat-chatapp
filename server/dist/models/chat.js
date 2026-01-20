import mongoose, { Schema, model } from "mongoose";
const chatSchema = new Schema({
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
}, {
    timestamps: true,
});
export const Chat = mongoose.models.Chat || model("Chat", chatSchema);
//# sourceMappingURL=chat.js.map