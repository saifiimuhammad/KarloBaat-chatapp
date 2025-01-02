import React from "react";
import { Stack, Typography } from "@mui/material";
import ChatItem from "../shared/ChatItem.jsx";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {
  return (
    <Stack width={w} direction="column" overflow="auto" height="100%">
      {chats.length === 0 ? (
        <Stack
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h6" color="gray">
            Add friends to chat!
          </Typography>
        </Stack>
      ) : (
        chats?.map((data, index) => {
          const { avatar, name, _id, groupChat, members } = data;

          const newMessageAlert = newMessagesAlert.find(
            ({ chatId }) => chatId === _id
          );

          const isOnline = members?.some((member) => onlineUsers.includes(_id));

          return (
            <ChatItem
              index={index}
              newMessageAlert={newMessageAlert}
              isOnline={isOnline}
              avatar={avatar}
              name={name}
              key={_id}
              _id={_id}
              groupChat={groupChat}
              sameSender={chatId === _id}
              handleDeleteChat={handleDeleteChat}
            />
          );
        })
      )}
    </Stack>
  );
};

export default ChatList;
