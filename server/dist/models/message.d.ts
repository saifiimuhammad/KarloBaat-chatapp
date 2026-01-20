import { Schema, Types } from "mongoose";
interface IMessage {
    sender: Types.ObjectId;
    chat: Types.ObjectId;
    content?: string;
    attachments?: any[];
}
export declare const messageSchema: Schema<IMessage, import("mongoose").Model<IMessage, any, any, any, import("mongoose").Document<unknown, any, IMessage, any, {}> & IMessage & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IMessage, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IMessage>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<IMessage> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare const Message: import("mongoose").Model<IMessage, {}, {}, {}, import("mongoose").Document<unknown, {}, IMessage, {}, {}> & IMessage & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=message.d.ts.map