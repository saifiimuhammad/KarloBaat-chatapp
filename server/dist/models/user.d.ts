import { Model } from "mongoose";
type AvatarType = {
    public_id: string;
    url: string;
};
export interface IUser {
    name: string;
    bio: string;
    username: string;
    password: string;
    avatar: AvatarType;
}
export interface IUserWithId extends IUser {
    _id: string;
}
export declare const User: Model<IUser>;
export {};
//# sourceMappingURL=user.d.ts.map