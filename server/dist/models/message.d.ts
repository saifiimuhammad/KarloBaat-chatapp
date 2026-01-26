import { Schema, Types } from "mongoose";
export interface IMessage {
    sender: Types.ObjectId;
    chat: Types.ObjectId;
    content?: string;
    attachments?: any[];
}
export interface IMessageWithId extends IMessage {
    _id: string;
}
export declare const messageSchema: Schema<IMessage, import("mongoose").Model<IMessage, any, any, any, import("mongoose").Document<unknown, any, IMessage> & IMessage & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IMessage, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IMessage>> & import("mongoose").FlatRecord<IMessage> & {
    _id: Types.ObjectId;
}>;
export declare const Message: import("mongoose").Model<IMessage, {}, {}, {}, import("mongoose").Document<unknown, {}, IMessage> & IMessage & {
    _id: Types.ObjectId;
}, any>;
//# sourceMappingURL=message.d.ts.map