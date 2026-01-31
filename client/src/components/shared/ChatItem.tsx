import React, { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AvatarCard from "./AvatarCard";

type NewMessageAlert = {
  chatId: string;
  count: number;
};

interface ChatItemProps {
  avatar?: string[] | undefined;
  name: string;
  _id: string;
  groupChat?: boolean | undefined;
  sameSender?: boolean;
  isOnline?: boolean | undefined;
  newMessageAlert?: NewMessageAlert | undefined;
  index?: number;
  handleDeleteChat: (
    e: React.MouseEvent,
    id: string,
    isGroupChat: boolean,
  ) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender = false,
  isOnline = false,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  return (
    <Link
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
      className="block bg-white"
    >
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
        className={`
          relative flex items-center gap-4 rounded-xl py-3 px-3 mb-1
          transition-colors
          ${
            sameSender
              ? "bg-accent text-text border-l-5 border-primary"
              : "hover:bg-zinc-100/80"
          }
        `}
      >
        <AvatarCard avatar={avatar} unreadCount={newMessageAlert?.count || 0} />

        <div className="flex flex-col w-full">
          <div className="w-full flex items-center justify-between">
            <h4 className="font-semibold text-text">{name}</h4>{" "}
            <span className="text-text-light/60 text-xs font-medium">
              9:31 AM
            </span>
            <span>{isOnline ? "Online" : "Offline"}</span>
          </div>
          <p className="text-xs text-text-light/70 mt-1">No recent activity</p>

          {newMessageAlert && newMessageAlert.count > 0 && (
            <span className="text-sm text-primary">
              {newMessageAlert.count} new message
              {newMessageAlert.count > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* {isOnline && (
          <span className="absolute right-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-green-500" />
        )} */}
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);
