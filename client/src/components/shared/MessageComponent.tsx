import React, { memo } from "react";
import moment from "moment";
import { motion } from "framer-motion";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import { CheckCheck } from "lucide-react";

/* ---------------- types ---------------- */

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
  attachments?: Attachment[];
  createdAt: string;
}

interface Props {
  message: Message;
  user: User;
}

/* ---------------- component ---------------- */

const MessageComponent: React.FC<Props> = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;

  const isMe = sender._id === user._id;
  const time = moment(createdAt).format("hh:mm A");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col ${
        isMe ? "items-end ml-auto" : "items-start"
      } max-w-[70%]`}
    >
      {/* sender name (only for incoming) */}
      {!isMe && (
        <p className="text-xs font-semibold text-secondary mb-1">
          {sender.name}
        </p>
      )}

      {/* message bubble */}
      <div
        className={`px-4 py-3 rounded-2xl shadow-sm ${
          isMe
            ? "bg-primary text-white rounded-br-none"
            : "bg-white text-text rounded-bl-none"
        }`}
      >
        {/* text */}
        {content && (
          <p className="text-sm leading-relaxed wrap-break-word">{content}</p>
        )}

        {/* attachments */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment, index) => {
              const url = attachment.url;
              const file = fileFormat(url);

              return (
                <a
                  key={attachment.url + index}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="block"
                >
                  {RenderAttachment(file, url)}
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* time */}
      <span className="text-[11px] text-textLight mt-1 flex items-center justify-center gap-1">
        <p>{time}</p>
        {isMe && <CheckCheck size={18} />}
      </span>
    </motion.div>
  );
};

export default memo(MessageComponent);
