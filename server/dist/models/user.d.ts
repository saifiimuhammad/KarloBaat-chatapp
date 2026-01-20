import mongoose, { Document } from "mongoose";
interface IAvatar {
    public_id: string;
    url: string;
}
export interface IUser extends Document {
    name: string;
    bio: string;
    username: string;
    password: string;
    avatar: IAvatar;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: mongoose.Model<any, {}, {}, {}, any, any> | mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=user.d.ts.map