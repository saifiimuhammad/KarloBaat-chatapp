import type { IUser } from "../models/user.js";
export type IUserWithId = IUser & {
    _id: string;
};
export declare const getOtherMembers: (members: IUserWithId[], userId: string) => IUserWithId | undefined;
export declare const getSockets: (users?: (string | IUserWithId)[]) => (string | undefined)[];
export declare const getBase64: (file: Express.Multer.File) => string;
//# sourceMappingURL=helper.d.ts.map