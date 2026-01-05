export const ALERT = "ALERT" as const;
export const REFETCH_CHATS = "REFETCH_CHATS" as const;
export const NEW_ATTACHMENT = "NEW_ATTACHMENT" as const;
export const NEW_MESSAGE_ALERT = "NEW_MESSAGE_ALERT" as const;
export const NEW_REQUEST = "NEW_REQUEST" as const;
export const NEW_MESSAGE = "NEW_MESSAGE" as const;
export const START_TYPING = "START_TYPING" as const;
export const STOP_TYPING = "STOP_TYPING" as const;
export const CHAT_JOINED = "CHAT_JOINED" as const;
export const CHAT_LEAVED = "CHAT_LEAVED" as const;
export const ONLINE_USERS = "ONLINE_USERS" as const;

// Optional: string literal union type for type safety
// export type EventType =
//   | typeof ALERT
//   | typeof REFETCH_CHATS
//   | typeof NEW_ATTACHMENT
//   | typeof NEW_MESSAGE_ALERT
//   | typeof NEW_REQUEST
//   | typeof NEW_MESSAGE
//   | typeof START_TYPING
//   | typeof STOP_TYPING
//   | typeof CHAT_JOINED
//   | typeof CHAT_LEAVED
//   | typeof ONLINE_USERS;
