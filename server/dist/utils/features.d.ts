import type { Request, Response } from "express";
import { IUserWithId } from "../models/user.js";
export declare const cookieOptions: {
    maxAge: number;
    sameSite: "none";
    httpOnly: boolean;
    secure: boolean;
};
declare const connectDb: (uri: string) => void;
declare const sendToken: (res: Response, user: IUserWithId, code: number, message: string) => Response;
declare const emitEvent: (req: Request, event: string, users: string[], data: unknown) => void;
interface UploadedFile {
    public_id: string;
    url: string;
}
declare const uploadFilesToCloudinary: (files?: any[]) => Promise<UploadedFile[]>;
declare const deleteFilesFromCloudinary: (public_ids: string[]) => Promise<void>;
export { connectDb, deleteFilesFromCloudinary, emitEvent, sendToken, uploadFilesToCloudinary, };
//# sourceMappingURL=features.d.ts.map