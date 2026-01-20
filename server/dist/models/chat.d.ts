import mongoose, { Types, Document } from "mongoose";
export interface IChat extends Document {
    name: string;
    groupChat: boolean;
    creator?: Types.ObjectId;
    members: Types.ObjectId[];
}
export declare const Chat: mongoose.Model<any, {}, {}, {}, any, any> | mongoose.Model<IChat, {}, {}, {}, mongoose.Document<unknown, {}, IChat, {}, {}> & IChat & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=chat.d.ts.map