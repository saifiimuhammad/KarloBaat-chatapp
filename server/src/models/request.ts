import mongoose, { Schema, model, Types, Model } from "mongoose";

export interface IRequest {
  status: "pending" | "accepted" | "rejected";
  sender: Types.ObjectId;
  reciever: Types.ObjectId;
}

const requestSchema = new Schema<IRequest>(
  {
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "rejected"],
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reciever: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Request: Model<IRequest> =
  mongoose.models.Request || model<IRequest>("Request", requestSchema);
