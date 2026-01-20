import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { useMyChatsQuery } from "../../redux/api/api";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  REFETCH_CHATS,
  ONLINE_USERS,
} from "../../constants/events";

import { useErrors, useSocketEvents } from "../../hooks/hooks";
import { getorSaveFromStorage } from "../../lib/features";

import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";

import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from "../../redux/reducers/misc";

import { getSocket } from "../../socket";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";

import type { RootState, AppDispatch } from "../../redux/store";

/* ---------------------------------- */
/* Types                              */
/* ---------------------------------- */

type AppLayoutInjectedProps = {
  chats?: any[];
  chatId?: string;
  user: any;
  onlineUsers: string[];
};

/* ---------------------------------- */
/* Layout HOC                         */
/* ---------------------------------- */

const AppLayout =
  () =>
  <P extends object>(
    WrappedComponent: ComponentType<P & AppLayoutInjectedProps>,
  ) =>
  (props: P) => {
    const params = useParams<{ chatId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const chatId = params.chatId;

    const deleteMenuAnchor = useRef<HTMLDivElement | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    const { newMessagesAlert } = useSelector((state: RootState) => state.chat);
    const { isMobile } = useSelector((state: RootState) => state.misc);
    const { user } = useSelector((state: RootState) => state.auth);

    const socket = getSocket();

    const { isLoading, isError, error, data, refetch } = useMyChatsQuery();

    useErrors([{ isError, error: error as any }]);

    /* ---------------------------------- */
    /* Side Effects                       */
    /* ---------------------------------- */

    useEffect(() => {
      getorSaveFromStorage({
        key: NEW_MESSAGE_ALERT,
        value: newMessagesAlert,
      });
    }, [newMessagesAlert]);

    /* ---------------------------------- */
    /* Handlers                           */
    /* ---------------------------------- */

    const handleDeleteChat = (
      e: React.MouseEvent<Element, MouseEvent>,
      chatId: string,
      groupChat: boolean,
    ) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget as HTMLDivElement;
    };

    const handleMobileClose = () => {
      dispatch(setIsMobile(false));
    };

    const newMessageAlertListener = useCallback(
      (data: any) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId, dispatch],
    );

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data: string[]) => {
      setOnlineUsers(data);
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);

    /* ---------------------------------- */
    /* Render                             */
    /* ---------------------------------- */

    return (
      <div className="min-h-screen">
        <Title />

        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />

        {/* Mobile Drawer */}
        {isMobile && (
          <div
            className="fixed inset-0 z-40 bg-black/40 sm:hidden"
            onClick={handleMobileClose}
          >
            <div
              className="h-full w-[70vw] bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              {isLoading ? (
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-zinc-200 rounded animate-pulse" />
                  <div className="h-4 bg-zinc-200 rounded animate-pulse" />
                </div>
              ) : (
                <ChatList
                  w="70vw"
                  chats={data?.chats}
                  chatId={chatId as string}
                  handleDeleteChat={handleDeleteChat}
                  newMessagesAlert={newMessagesAlert}
                  onlineUsers={onlineUsers}
                />
              )}
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-12 h-[90vh]">
          {/* Chat List (Desktop) */}
          <div className="hidden sm:block sm:col-span-4 md:col-span-3 h-full">
            {isLoading ? (
              <div className="p-4 space-y-3">
                <div className="h-4 bg-zinc-200 rounded animate-pulse" />
                <div className="h-4 bg-zinc-200 rounded animate-pulse" />
              </div>
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId as string}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              />
            )}
          </div>

          {/* Main Content */}
          <div className="col-span-12 sm:col-span-8 md:col-span-5 lg:col-span-6 h-full">
            <WrappedComponent
              {...props}
              chats={data?.chats}
              chatId={chatId as string}
              user={user}
              onlineUsers={onlineUsers}
            />
          </div>

          {/* Profile */}
          <div className="hidden md:block md:col-span-4 lg:col-span-3 h-full p-8 pt-4">
            <Profile user={user} />
          </div>
        </div>
      </div>
    );
  };

export default AppLayout;
