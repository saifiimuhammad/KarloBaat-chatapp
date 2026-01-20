import mongoose, { Types, Document } from "mongoose";
export interface IRequest extends Document {
    status: "pending" | "accepted" | "rejected";
    sender: Types.ObjectId;
    reciever: Types.ObjectId;
}
export declare const Request: mongoose.Model<any, {}, {}, {}, any, any> | mongoose.Model<IRequest, {}, {}, {}, mongoose.Document<unknown, {}, IRequest, {}, {}> & IRequest & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=request.d.ts.map