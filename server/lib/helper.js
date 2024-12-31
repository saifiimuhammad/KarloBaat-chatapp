import { userSocketIDs } from "../app.js";

export const getOtherMembers = (members, userId) =>
  members.find((member) => member._id.toString() !== userId.toString());

export const getSockets = (users = []) =>
  users.map((user) => userSocketIDs.get(user.toString()));
