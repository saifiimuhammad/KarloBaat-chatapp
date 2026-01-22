import { Types, Model } from "mongoose";
export interface IRequest {
    status: "pending" | "accepted" | "rejected";
    sender: Types.ObjectId;
    reciever: Types.ObjectId;
}
export declare const Request: Model<IRequest>;
//# sourceMappingURL=request.d.ts.map