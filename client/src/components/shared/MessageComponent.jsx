import React, { memo } from "react";
import { Typography, Box } from "@mui/material";
import { lightBlue } from "../../constants/colors.js";
import moment from "moment";
import { fileFormat } from "../../lib/features.js";
import RenderAttachment from "./RenderAttachment.jsx";
import { motion } from "framer-motion";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;

  const sameSender = sender._id === user._id;

  const timeAgo = moment(createdAt).fromNow();

  return (
    <motion.div
      initial={{ opacity: 0, x: "-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: sameSender ? "#1976d2" : "#f7f7f7",
        color: sameSender ? "white" : "black",
        borderRadius: "5px",
        padding: ".5rem 1rem",
        width: "fit-content",
      }}
    >
      {!sameSender && (
        <Typography color={"#1976d2"} fontWeight="600" variant="caption">
          {sender.name}
        </Typography>
      )}

      {content && <Typography>{content}</Typography>}

      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);

          return (
            <Box key={index}>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                download
                style={{
                  color: "black",
                }}
              >
                {RenderAttachment(file, url)}
              </a>
            </Box>
          );
        })}

      <Typography
        variant="caption"
        sx={{
          color: sameSender ? "#e4e4e4" : "#323232",
        }}
      >
        {timeAgo}
      </Typography>
    </motion.div>
  );
};

export default memo(MessageComponent);
