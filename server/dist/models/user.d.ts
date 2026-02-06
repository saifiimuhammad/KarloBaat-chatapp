import { Model } from "mongoose";
type AvatarType = {
    public_id: string;
    url: string;
};
type VerifType = {
    otpHash?: string | undefined;
    expiresAt?: Date | undefined;
    attempts: number;
};
export interface IUser {
    name: string;
    bio: string;
    username: string;
    email: string;
    isEmailVerified: boolean;
    otpPasswordVerified: boolean;
    password: string;
    avatar: AvatarType;
    passwordVerif: VerifType;
    emailVerif: VerifType;
}
export interface IUserWithId extends IUser {
    _id: string;
}
export declare const User: Model<IUser>;
export {};
//# sourceMappingURL=user.d.ts.map