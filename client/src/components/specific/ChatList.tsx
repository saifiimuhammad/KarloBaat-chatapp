import React, { useEffect, useMemo, useState } from "react";
import ChatItem from "../shared/ChatItem";
import { Search } from "lucide-react";

type Chat = {
  _id: string;
  name: string;
  avatar?: string;
  groupChat?: boolean;
  members?: string[];
};

type NewMessageAlert = {
  chatId: string;
  count: number;
};

interface ChatListProps {
  w?: string;
  chats?: Chat[];
  chatId?: string;
  onlineUsers?: string[];
  newMessagesAlert?: NewMessageAlert[];
  handleDeleteChat: (
    e: React.MouseEvent,
    id: string,
    isGroupChat: boolean,
  ) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [{ chatId: "", count: 0 }],
  handleDeleteChat,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim().toLowerCase());
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filtered chats based on debounced query
  const filteredChats = useMemo(() => {
    if (!debouncedQuery) return chats;
    return chats.filter((chat) =>
      chat.name.toLowerCase().includes(debouncedQuery),
    );
  }, [debouncedQuery, chats]);

  return (
    <div className="flex flex-col h-[91vh]">
      <div className="p-4 shrink-0">
        <div className="relative w-full">
          <div
            className={`absolute left-3 top-5 -translate-y-1/2 text-[#9b988c] ${
              isActive ? "text-text/70" : ""
            }`}
          >
            <Search size={16} />
          </div>
          <input
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#f6f8f4] text-text 
        placeholder:text-[#9b988c] placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            type="text"
            name="search"
            id="search"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
          />
        </div>
        <h3 className="mt-4 text-text-light/80 uppercase text-xs font-medium">
          Messages
        </h3>
      </div>
      <div
        style={{ width: w }}
        className="flex-1 overflow-y-auto px-2 no-scrollbar"
      >
        {filteredChats.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-lg text-text-light">Add friends to chat!</p>
          </div>
        ) : (
          filteredChats.map((data, index) => {
            const { avatar, name, _id, groupChat, members } = data;

            const newMessageAlert = newMessagesAlert.find(
              (alert) => alert.chatId === _id,
            );

            const isOnline = members?.some((member) =>
              onlineUsers.includes(member),
            );

            return (
              <ChatItem
                key={_id}
                index={index}
                avatar={avatar as string[] | undefined}
                name={name}
                _id={_id}
                groupChat={groupChat}
                isOnline={isOnline}
                newMessageAlert={newMessageAlert}
                sameSender={chatId === _id}
                handleDeleteChat={handleDeleteChat}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;
