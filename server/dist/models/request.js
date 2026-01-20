import mongoose, { Schema, model } from "mongoose";
const requestSchema = new Schema({
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "accepted", "rejected"],
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reciever: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
export const Request = mongoose.models.Request || model("Request", requestSchema);
//# sourceMappingURL=request.js.map