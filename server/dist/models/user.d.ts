export const User: mongoose.Model<any, {}, {}, {}, any, any> | mongoose.Model<{
    name: string;
    bio: string;
    username: string;
    password: string;
    avatar?: {
        url: string;
        public_id: string;
    } | null;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    bio: string;
    username: string;
    password: string;
    avatar?: {
        url: string;
        public_id: string;
    } | null;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    bio: string;
    username: string;
    password: string;
    avatar?: {
        url: string;
        public_id: string;
    } | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    bio: string;
    username: string;
    password: string;
    avatar?: {
        url: string;
        public_id: string;
    } | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    bio: string;
    username: string;
    password: string;
    avatar?: {
        url: string;
        public_id: string;
    } | null;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    name: string;
    bio: string;
    username: string;
    password: string;
    avatar?: {
        url: string;
        public_id: string;
    } | null;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
import mongoose from "mongoose";
//# sourceMappingURL=user.d.ts.map