import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

// Types
interface User {
  _id: string;
  name: string;
  username?: string;
  avatar?: string;
  bio?: string;
}

interface Chat {
  _id: string;
  name: string;
  members: User[];
  groupChat: boolean;
}

interface Message {
  _id: string;
  sender: User;
  content: string;
  attachments?: string[];
  createdAt: string;
}

interface Notification {
  _id: string;
  type: string;
  content: string;
  read: boolean;
  createdAt: string;
}

// Request payload types
interface SendFriendRequestBody {
  toUserId: string;
}

interface AcceptFriendRequestBody {
  fromUserId: string;
}

interface NewGroupBody {
  name: string;
  members: string[];
}

interface RenameGroupBody {
  chatId: string;
  name: string;
}

interface RemoveGroupMembersBody {
  chatId: string;
  userId: string;
}

interface AddGroupMembersBody {
  chatId: string;
  members: string[];
}

interface EditProfileBody {
  name?: string;
  username?: string;
  bio?: string;
  password?: string;
  avatar?: File;
}

interface ChatDetailsArgs {
  chatId: string;
  populate?: boolean;
}

interface GetMessagesArgs {
  chatId: string;
  page: number;
}

// RTK Query API
const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/`,
    credentials: "include",
  }),
  tagTypes: ["Chat", "User", "Message"],
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => ({
        url: "user/me",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    myChats: builder.query<Chat[], void>({
      query: () => ({
        url: "chat/my",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),
    searchUser: builder.query<User[], string>({
      query: (name) => ({
        url: `user/search?name=${name}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    sendFriendRequest: builder.mutation<string, SendFriendRequestBody>({
      query: (body) => ({
        url: "user/sendrequest",
        method: "PUT",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    getNotifications: builder.query<Notification[], void>({
      query: () => ({
        url: "user/notifications",
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),
    acceptFriendRequest: builder.mutation<string, AcceptFriendRequestBody>({
      query: (body) => ({
        url: "user/acceptrequest",
        method: "PUT",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
    chatDetails: builder.query<Chat, ChatDetailsArgs>({
      query: ({ chatId, populate = false }) => {
        let url = `chat/${chatId}`;
        if (populate) url += "?populate=true";
        return { url, credentials: "include" };
      },
      providesTags: ["Chat"],
    }),
    getMessages: builder.query<Message[], GetMessagesArgs>({
      query: ({ chatId, page }) => ({
        url: `chat/message/${chatId}?page=${page}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),
    sendAttachments: builder.mutation<Message, FormData>({
      query: (body) => ({
        url: "chat/message",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),
    myGroups: builder.query<Chat[], void>({
      query: () => ({
        url: "chat/my/groups",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),
    availableFriends: builder.query<User[], string | void>({
      query: (chatId) => {
        let url = "user/friends";
        if (chatId) url += `?chatId=${chatId}`;
        return { url, credentials: "include" };
      },
      providesTags: ["Chat"],
    }),
    newGroup: builder.mutation<Chat, NewGroupBody>({
      query: ({ name, members }) => ({
        url: "chat/new",
        method: "POST",
        body: { name, members },
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
    renameGroup: builder.mutation<Chat, RenameGroupBody>({
      query: ({ chatId, name }) => ({
        url: `chat/${chatId}`,
        method: "PUT",
        body: { name },
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
    removeGroupMembers: builder.mutation<Chat, RemoveGroupMembersBody>({
      query: ({ chatId, userId }) => ({
        url: "chat/removemember",
        method: "PUT",
        body: { chatId, userId },
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
    addGroupMembers: builder.mutation<Chat, AddGroupMembersBody>({
      query: ({ members, chatId }) => ({
        url: "chat/addmembers",
        method: "PUT",
        body: { members, chatId },
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
    deleteChat: builder.mutation<void, string>({
      query: (chatId) => ({
        url: `chat/${chatId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
    leaveGroup: builder.mutation<void, string>({
      query: (chatId) => ({
        url: `chat/leave/${chatId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
    editProfile: builder.mutation<User, EditProfileBody>({
      query: (data) => {
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.username) formData.append("username", data.username);
        if (data.bio) formData.append("bio", data.bio);
        if (data.password) formData.append("password", data.password);
        if (data.avatar) formData.append("avatar", data.avatar);
        return {
          url: "user/update",
          method: "PATCH",
          body: formData,
          credentials: "include",
        };
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export default api;

export const {
  useGetMeQuery,
  useMyChatsQuery,
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
  useGetNotificationsQuery,
  useAcceptFriendRequestMutation,
  useChatDetailsQuery,
  useGetMessagesQuery,
  useSendAttachmentsMutation,
  useMyGroupsQuery,
  useAvailableFriendsQuery,
  useNewGroupMutation,
  useRenameGroupMutation,
  useRemoveGroupMembersMutation,
  useAddGroupMembersMutation,
  useDeleteChatMutation,
  useLeaveGroupMutation,
  useEditProfileMutation,
} = api;
