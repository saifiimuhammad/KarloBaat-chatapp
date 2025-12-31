import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { Send, Phone, Video, Info, Smile, CirclePlus } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import FileMenu from "../components/dialogs/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import { TypingLoader } from "../components/layout/Loaders";

import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";

import { useErrors, useSocketEvents } from "../hooks/hooks";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { setIsFileMenu } from "../redux/reducers/misc";
import { getSocket } from "../socket";

import { useInfiniteScrollTop } from "6pp";
import { server } from "../constants/config";
import axios from "axios";

/* ---------------- types ---------------- */

interface ChatProps {
  chats: {
    _id: string;
    name: string;
    avatar?: string;
    groupChat?: boolean;
    members?: string[];
    isOnline?: boolean;
  }[];
  chatId: string;
  user: {
    _id: string;
    name: string;
  };
  onlineUsers: string[];
}

interface User {
  _id: string;
  name: string;
}

interface Attachment {
  url: string;
}

interface Message {
  content?: string;
  sender: User;
  chat: string;
  attachments?: Attachment[];
  createdAt: string;
}

type UserDetails = {
  avatar: {
    public_id: string;
    url: string;
  };
  name: string;
  username: string;
  bio: string;
  createdAt: string; // API-safe
};

/* ---------------- component ---------------- */

const Chat: React.FC<ChatProps> = ({ chats, chatId, user, onlineUsers }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = getSocket();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const emojiRef = useRef<HTMLDivElement | null>(null);

  const [showEmoji, setShowEmoji] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentChat = chats.find((chat) => chat._id === chatId)!;
  const otherMembers =
    currentChat.members?.filter((id) => id !== user._id) || [];
  const isOnline = onlineUsers.includes(otherMembers[0]!);

  // console.log(currentChat);
  const [showInfo, setShowInfo] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState<HTMLElement | null>(
    null
  );
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const [iamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const members = chatDetails.data?.chat?.members;

  /* ---------------- handlers ---------------- */

  const messageOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (!iamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, 2000);
  };

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  const handleFileOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    const newText =
      message.slice(0, start) + emojiData.emoji + message.slice(end);

    setMessage(newText);

    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(
        start + emojiData.emoji.length,
        start + emojiData.emoji.length
      );
    });
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          `${server}/api/v1/user/fetch/${otherMembers[0]}`,
          {
            withCredentials: true,
          }
        );

        setUserDetails(data.user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    };

    if (showEmoji) {
      document.addEventListener("mousedown", handler);
    }

    return () => document.removeEventListener("mousedown", handler);
  }, [showEmoji]);

  /* ---------------- lifecycle ---------------- */

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) navigate("/");
  }, [chatDetails.isError]);

  /* ---------------- socket listeners ---------------- */

  const newMessageListener = useCallback(
    (data: any) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data: any) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data: any) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data: any) => {
      if (data.chatId !== chatId) return;

      const alertMessage: Message = {
        content: data.message,
        sender: {
          _id: "admin",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, alertMessage]);
    },
    [chatId]
  );

  useSocketEvents(socket, {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessageListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  });

  useErrors([
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ]);

  const allMessages = [...oldMessages, ...messages];

  /* ---------------- UI ---------------- */

  if (chatDetails.isLoading) {
    return <div className="p-4 animate-pulse bg-gray-200 rounded-lg" />;
  }

  return (
    <div className="flex flex-col h-full bg-background-2 border-x border-zinc-200">
      {/* ---------- HEADER ---------- */}
      <div className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img
            src={currentChat?.avatar || "/default-avatar.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-text">{currentChat?.name}</p>
            <p className="text-xs text-secondary">
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex gap-4 text-primary">
          <Phone size={18} className="cursor-pointer hover:text-secondary" />
          <Video size={18} className="cursor-pointer hover:text-secondary" />
          <Info
            size={18}
            className="cursor-pointer hover:text-secondary"
            onClick={() => setShowInfo(true)}
          />
        </div>
      </div>

      {/* ---------- MESSAGES ---------- */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-6 no-scrollbar"
      >
        <div className="mx-auto text-xs text-textLight bg-accent px-4 py-1 rounded-full w-fit">
          Today
        </div>

        {allMessages.length === 0 ? (
          <p className="text-center text-textLight">No messages yet</p>
        ) : (
          allMessages.map((msg, i) => (
            <MessageComponent
              key={i + 22}
              message={msg as Message}
              user={user}
            />
          ))
        )}

        {userTyping && <TypingLoader />}
        <div ref={bottomRef} />
      </div>

      {/* ---------- INPUT ---------- */}
      <form onSubmit={submitHandler} className="p-4 bg-bg2">
        <div className="relative flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow">
          <button
            type="button"
            className="text-primary hover:text-secondary cursor-pointer"
            onClick={handleFileOpen}
          >
            <CirclePlus size={20} />
          </button>

          <input
            ref={inputRef}
            value={message}
            onChange={messageOnChange}
            placeholder="Type a message..."
            className="flex-1 outline-none text-sm text-text"
          />

          <button
            type="button"
            onClick={() => setShowEmoji((p) => !p)}
            className="text-primary hover:text-secondary cursor-pointer"
          >
            <Smile size={20} />
          </button>

          <button
            type="submit"
            className="bg-primary hover:bg-secondary text-white p-2 rounded-xl cursor-pointer"
          >
            <Send size={18} />
          </button>

          {showEmoji && (
            <div className="absolute bottom-16 right-0 z-50">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
      </form>

      <FileMenu anchorEl={fileMenuAnchor} chatId={chatId} />

      {/* Info Dialog */}

      {showInfo && currentChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowInfo(false)}
          />

          {/* Dialog */}
          <div
            className="
        relative z-50 w-full max-w-md
        rounded-2xl
        bg-background-2
        p-6
        shadow-xl
        border border-accent
      "
          >
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-accent pb-4">
              <img
                src={currentChat.avatar || "/default-avatar.png"}
                className="h-14 w-14 rounded-full border border-accent"
                alt="chat avatar"
              />

              <div className="flex-1">
                <h2 className="text-lg font-semibold text-text">
                  {currentChat.name}
                </h2>
                <p className="text-sm text-text-light">
                  {currentChat.groupChat ? "Group Chat" : "Private Chat"}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="mt-5 space-y-4 text-sm">
              {/* -------- Chat Info -------- */}
              <div className="flex justify-between items-center">
                <span className="text-text-light">Status</span>
                <span
                  className={`font-medium ${
                    isOnline ? "text-primary" : "text-text-light"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>

              {currentChat.groupChat && (
                <div className="flex justify-between items-center">
                  <span className="text-text-light">Members</span>
                  <span className="font-medium text-text">
                    {currentChat.members?.length || 0}
                  </span>
                </div>
              )}

              {/* -------- User Details -------- */}
              {!userDetails ? (
                <p className="text-text-light text-center mt-4">
                  Loading user details...
                </p>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-text-light">Full Name</span>
                    <span className="font-medium text-text">
                      {userDetails.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-text-light">Username</span>
                    <span className="font-medium text-text">
                      @{userDetails.username}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-text-light">Bio</span>
                    <span className="font-medium text-text text-right w-full">
                      {userDetails.bio || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-text-light">Joined</span>
                    <span className="font-medium text-text">
                      {new Date(userDetails.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowInfo(false)}
                className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-text hover:bg-background-light transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout()(Chat);
