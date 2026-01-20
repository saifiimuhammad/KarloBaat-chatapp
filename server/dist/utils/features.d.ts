export function connectDb(uri: any): void;
export namespace cookieOptions {
    let maxAge: number;
    let sameSite: string;
    let httpOnly: boolean;
    let secure: boolean;
}
export function deleteFilesFromCloudinary(public_ids: any): Promise<void>;
export function emitEvent(req: any, event: any, users: any, data: any): void;
export function sendToken(res: any, user: any, code: any, message: any): any;
export function uploadFilesToCloudinary(files?: any[]): Promise<{
    public_id: string;
    url: string;
}[]>;
//# sourceMappingURL=features.d.ts.map