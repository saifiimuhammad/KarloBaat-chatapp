import { body, param, validationResult, } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";
/* Middleware to handle validation errors */
const validateHandler = (req, res, next) => {
    const errors = validationResult(req);
    const errorMessages = errors
        .array()
        .map((error) => error.msg)
        .join(",");
    console.log(errorMessages);
    if (errors.isEmpty())
        return next();
    else
        next(new ErrorHandler(errorMessages, 400));
};
/* Validators */
const registerValidator = () => [
    body("name", "Please Enter Name").notEmpty(),
    body("username", "Please Enter Username").notEmpty(),
    body("bio", "Please Enter Bio").notEmpty(),
    body("password", "Please Enter Password").notEmpty(),
];
const loginValidator = () => [
    body("identifier", "Please Enter Username or Email").notEmpty(),
    body("password", "Please Enter Password").notEmpty(),
];
const sendOtpValidator = () => [
    body("email", "Please Enter Email").notEmpty().isEmail(),
    body("type", "Please Enter Type").notEmpty(),
];
const verifyOtpValidator = () => [
    body("email", "Please Enter Email").notEmpty().isEmail().normalizeEmail(),
    body("otp", "Please Enter OTP").notEmpty(),
];
const changePasswordValidator = () => [
    body("email", "Please Enter Email").notEmpty().isEmail().normalizeEmail(),
    body("newPassword", "Please Enter New Password").notEmpty(),
];
const newGroupValidator = () => [
    body("name", "Please Enter Name").notEmpty(),
    body("members")
        .notEmpty()
        .withMessage("Please Enter Members")
        .isArray({ min: 2, max: 100 })
        .withMessage("Members must be between 2-100"),
];
const addMemberValidator = () => [
    body("chatId", "Please Enter Chat ID").notEmpty(),
    body("members")
        .notEmpty()
        .withMessage("Please Enter Members")
        .isArray({ min: 1, max: 97 })
        .withMessage("Members must be between 1-97"),
];
const removeMemberValidator = () => [
    body("chatId", "Please Enter Chat ID").notEmpty(),
    body("userId", "Please Enter User ID").notEmpty(),
];
const sendAttachementsValidator = () => [
    body("chatId", "Please Enter Chat ID").notEmpty(),
];
const chatIdValidator = () => [
    param("id", "Please Enter Chat ID").notEmpty(),
];
const renameValidator = () => [
    param("id", "Please Enter Chat ID").notEmpty(),
    body("name", "Please Enter New Name").notEmpty(),
];
const sendRequestValidator = () => [
    body("userId", "Please Enter User ID").notEmpty(),
];
const acceptRequestValidator = () => [
    body("requestId", "Please Enter Request ID").notEmpty(),
    body("accept")
        .notEmpty()
        .withMessage("Please add Accept")
        .isBoolean()
        .withMessage("Accept must be boolean"),
];
const adminLoginValidator = () => [
    body("secretKey", "Please Enter Secret Key").notEmpty(),
];
/* Export all validators and handler */
export { registerValidator, validateHandler, loginValidator, newGroupValidator, addMemberValidator, removeMemberValidator, sendAttachementsValidator, chatIdValidator, renameValidator, sendRequestValidator, acceptRequestValidator, adminLoginValidator, sendOtpValidator, verifyOtpValidator, changePasswordValidator, };
//# sourceMappingURL=validators.js.map