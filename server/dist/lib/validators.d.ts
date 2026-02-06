import { ValidationChain } from "express-validator";
import type { Request, Response, NextFunction } from "express";
declare const validateHandler: (req: Request, res: Response, next: NextFunction) => void;
declare const registerValidator: () => ValidationChain[];
declare const loginValidator: () => ValidationChain[];
declare const sendOtpValidator: () => ValidationChain[];
declare const verifyOtpValidator: () => ValidationChain[];
declare const changePasswordValidator: () => ValidationChain[];
declare const newGroupValidator: () => ValidationChain[];
declare const addMemberValidator: () => ValidationChain[];
declare const removeMemberValidator: () => ValidationChain[];
declare const sendAttachementsValidator: () => ValidationChain[];
declare const chatIdValidator: () => ValidationChain[];
declare const renameValidator: () => ValidationChain[];
declare const sendRequestValidator: () => ValidationChain[];
declare const acceptRequestValidator: () => ValidationChain[];
declare const adminLoginValidator: () => ValidationChain[];
export { registerValidator, validateHandler, loginValidator, newGroupValidator, addMemberValidator, removeMemberValidator, sendAttachementsValidator, chatIdValidator, renameValidator, sendRequestValidator, acceptRequestValidator, adminLoginValidator, sendOtpValidator, verifyOtpValidator, changePasswordValidator, };
//# sourceMappingURL=validators.d.ts.map