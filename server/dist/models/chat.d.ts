import { Types, Model } from "mongoose";
export interface IChat {
    name: string;
    groupChat: boolean;
    creator?: Types.ObjectId;
    members: Types.ObjectId[];
}
export interface IChatWithId extends IChat {
    _id: string;
}
export declare const Chat: Model<IChat>;
//# sourceMappingURL=chat.d.ts.map