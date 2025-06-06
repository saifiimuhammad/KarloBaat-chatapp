import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMyChatsQuery } from "../../redux/api/api.js";
import Title from "../shared/Title.jsx";
import ChatList from "../specific/ChatList.jsx";
import Profile from "../specific/Profile.jsx";
import Header from "./Header.jsx";

import { Drawer, Grid, Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  REFETCH_CHATS,
} from "../../constants/events.js";
import { useErrors, useSocketEvents } from "../../hooks/hooks.jsx";
import { getorSaveFromStorage } from "../../lib/features.js";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat.js";
import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from "../../redux/reducers/misc.js";
import { getSocket } from "../../socket.jsx";
import DeleteChatMenu from "../dialogs/DeleteChatMenu.jsx";
import { ONLINE_USERS } from "../../../../server/constants/events.js";
import { matteBlack } from "../../constants/colors.js";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const chatId = params.chatId;
    const dispatch = useDispatch();

    const deleteMenuAnchor = useRef(null);

    const [onlineUsers, setOnlineUsers] = useState([]);

    const { newMessagesAlert } = useSelector((state) => state.chat);

    const socket = getSocket();

    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);

    const { isLoading, isError, error, data, refetch } = useMyChatsQuery("");

    useErrors([{ isError, error }]);

    useEffect(() => {
      getorSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, []);

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);

    return (
      <div className="main-container">
        <Title />
        <Header />

        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />

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
              onlineUsers={onlineUsers}
            />
          </Drawer>
        )}

        <Grid container height={"90vh"}>
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
                onlineUsers={onlineUsers}
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
              bgcolor: matteBlack,
              borderRadius: "15px",
            }}
          >
            <Profile user={user} />
          </Grid>
        </Grid>
      </div>
    );
  };
};

export default AppLayout;
