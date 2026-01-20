import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
const { hash } = bcrypt;
// 3. Schema definition
const userSchema = new Schema({
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
}, {
    timestamps: true, // adds createdAt & updatedAt
});
// 4. Pre-save hook for password hashing
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await hash(this.password, 10);
    next();
});
// 5. Export the model
export const User = mongoose.models.User || model("User", userSchema);
//# sourceMappingURL=user.js.map