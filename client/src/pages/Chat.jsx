import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { IconButton, Skeleton, Stack, Typography } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import AppLayout from "../components/layout/AppLayout.jsx";

import { InputBox } from "../components/styles/StyledComponents.jsx";
import { grayColor, orange } from "../constants/colors.js";

import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import FileMenu from "../components/dialogs/FileMenu.jsx";
import { TypingLoader } from "../components/layout/Loaders.jsx";
import MessageComponent from "../components/shared/MessageComponent.jsx";
import {
  ALERT,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events.js";
import { useErrors, useSocketEvents } from "../hooks/hooks.jsx";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api.js";
import { removeNewMessagesAlert } from "../redux/reducers/chat.js";
import { setIsFileMenu } from "../redux/reducers/misc.js";
import { getSocket } from "../socket.jsx";

const Chat = ({ chatId, user }) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const bottomRef = useRef(null);

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

  const messageOnChange = (e) => {
    setMessage(e.target.value);
    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, 2000);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Emmitting message to server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    console.log(messages);
    setMessage("");
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  useEffect(() => {
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "0muh3amm2ad4sa3if1ar9ai1n600717",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandlers = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

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
        {allMessages.length === 0 ? (
          <Typography variant="h6" color="text.secondary" textAlign="center">
            No messages yet
          </Typography>
        ) : (
          allMessages.map((i, key) => {
            return <MessageComponent key={key} message={i} user={user} />;
          })
        )}

        {userTyping && <TypingLoader />}
        <div ref={bottomRef} />
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
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>

          <InputBox
            placeholder="Type message here..."
            value={message}
            onChange={messageOnChange}
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

      <FileMenu anchorEl={fileMenuAnchor} chatId={chatId} />
    </>
  );
};

export default AppLayout()(Chat);
