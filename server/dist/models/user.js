import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
const { hash } = bcrypt;
const schema = new Schema({
    name: { type: String, required: true },
    bio: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    isEmailVerified: { type: Boolean, default: false },
    otpPasswordVerified: { type: Boolean, default: false },
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
}, { timestamps: true });
schema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await hash(this.password, 10);
    next();
});
export const User = mongoose.models.User || model("User", schema);
//# sourceMappingURL=user.js.map