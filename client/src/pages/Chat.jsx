import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { IconButton, Skeleton, Stack } from "@mui/material";
import React, { useContext, useRef, useState } from "react";
import AppLayout from "../components/layout/AppLayout.jsx";

import { InputBox } from "../components/styles/StyledComponents.jsx";
import { grayColor, orange } from "../constants/colors.js";

import FileMenu from "../components/dialogs/FileMenu.jsx";
import MessageComponent from "../components/shared/MessageComponent.jsx";
import { NEW_MESSAGE } from "../constants/events.js";
import { sampleMessage } from "../constants/sampleData.js";
import { useErrors, useSocketEvents } from "../hooks/hooks.jsx";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api.js";
import { getSocket } from "../socket.jsx";
import { useInfiniteScrollTop } from "6pp";

const Chat = ({ chatId, user }) => {
  const containerRef = useRef(null);
  const socket = getSocket();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails.data?.chat?.members;

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Emmitting message to server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  const newMessagesHandler = (data) => {
    setMessages((prev) => [...prev, data]);
  };

  const eventHandlers = { [NEW_MESSAGE]: newMessagesHandler };

  useSocketEvents(socket, eventHandlers);

  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <>
      <Stack
        ref={containerRef}
        boxSizing="border-box"
        padding="1rem"
        spacing="1rem"
        bgcolor={grayColor}
        height="90%"
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {allMessages.map((i) => {
          return <MessageComponent key={i._id} message={i} user={user} />;
        })}
      </Stack>

      <form
        style={{
          height: "10%",
        }}
        onSubmit={submitHandler}
      >
        <Stack
          direction="row"
          height="100%"
          padding="1rem"
          alignItems="center"
          position="relative"
        >
          <IconButton
            sx={{
              position: "absolute",
              left: "1.5rem",
              rotate: "30deg",
            }}
          >
            <AttachFileIcon />
          </IconButton>

          <InputBox
            placeholder="Type message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <IconButton
            type="submit"
            sx={{
              bgcolor: orange,
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                bgcolor: "error.dark",
              },
              rotate: "-30deg",
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>

      <FileMenu />
    </>
  );
};

export default AppLayout()(Chat);
