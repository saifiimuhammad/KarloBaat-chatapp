import React, { useCallback, useEffect } from "react";
import { useMyChatsQuery } from "../../redux/api/api.js";
import Title from "../shared/Title.jsx";
import ChatList from "../specific/ChatList.jsx";
import Profile from "../specific/Profile.jsx";
import Header from "./Header.jsx";

import { Drawer, Grid, Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { NEW_MESSAGE_ALERT, NEW_REQUEST } from "../../constants/events.js";
import { useErrors, useSocketEvents } from "../../hooks/hooks.jsx";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat.js";
import { setIsMobile } from "../../redux/reducers/misc.js";
import { getSocket } from "../../socket.jsx";
import { getorSaveFromStorage } from "../../lib/features.js";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const chatId = params.chatId;
    const dispatch = useDispatch();
    const { newMessagesAlert } = useSelector((state) => state.chat);

    const socket = getSocket();

    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);

    const { isLoading, isError, isSuccess, error, data, refetch } =
      useMyChatsQuery("");

    useErrors([{ isError, error }]);

    useEffect(() => {
      getorSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log("Delete chst: ", _id, groupChat);
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    const newMessageAlertHandler = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );
    const newRequestHandler = useCallback(() => {
      dispatch(incrementNotification());
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
      [NEW_REQUEST]: newRequestHandler,
    };

    useSocketEvents(socket, eventHandlers);

    return (
      <>
        <Title />
        <Header />

        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobile} onClose={handleMobileClose}>
            <ChatList
              w="70vw"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
            />
          </Drawer>
        )}

        <Grid container height="calc(100vh - 4rem)">
          <Grid
            item
            sm={4}
            md={3}
            height="100%"
            sx={{
              display: { xs: "none", sm: "block" },
            }}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height="100%">
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid>
          <Grid
            item
            md={4}
            lg={3}
            height="100%"
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}
          >
            <Profile user={user} />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
