import { userSocketIDs } from "../app.js";
/* Find the first member that is not the given user */
export const getOtherMembers = (members, userId) => members.find((member) => member._id.toString() !== userId.toString());
/* Get socket IDs of users */
export const getSockets = (users = []) => users.map((user) => userSocketIDs.get(typeof user === "string" ? user : user._id.toString()));
/* Convert uploaded file to base64 string */
export const getBase64 = (file) => `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
//# sourceMappingURL=helper.js.map