import { userSocketIDs } from "../app.js";
import type { IUser } from "../models/user.js";

/* IUser with guaranteed _id */
export type IUserWithId = IUser & { _id: string };

/* Find the first member that is not the given user */
export const getOtherMembers = (
  members: IUserWithId[],
  userId: string,
): IUserWithId | undefined =>
  members.find((member) => member._id.toString() !== userId.toString());

/* Get socket IDs of users */
export const getSockets = (
  users: (string | IUserWithId)[] = [],
): (string | undefined)[] =>
  users.map((user) =>
    userSocketIDs.get(typeof user === "string" ? user : user._id.toString()),
  );

/* Convert uploaded file to base64 string */
export const getBase64 = (file: Express.Multer.File): string =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
