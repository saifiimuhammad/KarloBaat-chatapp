import { Types, Model } from "mongoose";
export interface IChat {
    name: string;
    groupChat: boolean;
    creator?: Types.ObjectId;
    members: Types.ObjectId[];
}
export declare const Chat: Model<IChat>;
//# sourceMappingURL=chat.d.ts.map