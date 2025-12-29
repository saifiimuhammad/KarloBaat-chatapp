import {
  Plus,
  Users,
  LogOut,
  Menu,
  Bell as BellIcon,
  Search,
  MessageCircleHeart as MessageCircleHeartIcon,
  EllipsisVertical as EllipsisVerticalIcon,
  UserPlus,
} from "lucide-react";
import axios from "axios";
import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { server } from "../../constants/config.js";
import { userNotExists } from "../../redux/reducers/auth.js";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc.js";
import { resetNotificationCount } from "../../redux/reducers/chat.js";

const SearchDialog = lazy(() => import("../specific/Search.jsx"));
const NotificationsDialog = lazy(() => import("../specific/Notifications.jsx"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup.jsx"));

interface IconBtnProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  value?: number;
}

const IconBtn = ({ title, icon, onClick, value }: IconBtnProps) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className="relative p-2 rounded-full hover:bg-secondary/20 transition cursor-pointer"
    >
      {value ? (
        <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 text-xs rounded-full bg-red-500 text-white flex items-center justify-center">
          {value}
        </span>
      ) : null}
      {icon}
    </button>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tabOpened, setTabOpened] = useState<"chats" | "groups" | "settings">(
    "chats"
  );
  const [isDialog, setIsDialog] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);

  const isMobile = window.innerWidth <= 500;

  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state: any) => state.misc
  );
  const { notificationCount } = useSelector((state: any) => state.chat);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setIsDialog(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.CheckmarkIcon(data.message);
    } catch (err: any) {
      toast.ErrorIcon(err?.response?.data?.message || "Logout failed");
    }
  };

  return (
    <>
      <header className="h-16 px-4 bg-white flex items-center border-b border-accent">
        {/* Left */}
        <div className="flex items-center gap-3">
          {isMobile && (
            <button
              onClick={() => dispatch(setIsMobile(true))}
              className="p-2 rounded-lg hover:bg-secondary/20"
            >
              <Menu size={20} />
            </button>
          )}

          <h2
            className="text-lg font-semibold tracking-tight flex items-center justify-center gap-1 text-center text-text/80 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <MessageCircleHeartIcon /> Karlobaat
          </h2>
        </div>

        {/* Toggle Pill Button */}
        <div className="w-full flex items-center justify-center">
          <div className="w-75 rounded-xl bg-background-light p-1 flex my-6">
            <button
              onClick={() => setTabOpened("chats")}
              className={`cursor-pointer flex-1 rounded-xl py-2 text-sm font-medium transition-all duration-200
          ${
            tabOpened === "chats"
              ? "bg-white text-text shadow"
              : "text-text-light"
          }`}
            >
              Chats
            </button>

            <button
              onClick={() => setTabOpened("groups")}
              className={`cursor-pointer flex-1 rounded-xl py-2 text-sm font-medium transition-all duration-200
          ${
            tabOpened === "groups"
              ? "bg-white text-text shadow"
              : "text-text-light"
          }`}
            >
              Groups
            </button>

            <button
              onClick={() => setTabOpened("settings")}
              className={`cursor-pointer flex-1 rounded-xl py-2 text-sm font-medium transition-all duration-200
          ${
            tabOpened === "settings"
              ? "bg-white text-text shadow"
              : "text-text-light"
          }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1 sm:gap-4">
          {/* <IconBtn
            title="Search"
            icon={<Search size={20} />}
            onClick={() => dispatch(setIsSearch(true))}
          />

          <IconBtn
            title="New Group"
            icon={<Plus size={20} />}
            onClick={() => dispatch(setIsNewGroup(true))}
          />

          <IconBtn
            title="Groups"
            icon={<Users size={20} />}
            onClick={() => navigate("/groups")}
          /> */}

          <IconBtn
            title="Notifications"
            icon={<BellIcon size={20} />}
            value={notificationCount}
            onClick={() => {
              dispatch(setIsNotification(true));
              dispatch(resetNotificationCount());
            }}
          />
          <div className="relative">
            <IconBtn
              title="Others"
              icon={<EllipsisVerticalIcon size={20} />}
              onClick={() => setIsDialog(!isDialog)}
            />
            {isDialog && (
              <div
                ref={boxRef}
                className="absolute right-0 mt-2 z-50 w-44 rounded-xl bg-white shadow-lg border border-accent"
              >
                <ul className="flex flex-col py-2 text-sm font-medium text-text">
                  <li>
                    <button
                      className="flex w-full items-center gap-2 px-4 py-2 hover:bg-accent transition cursor-pointer"
                      onClick={() => dispatch(setIsSearch(true))}
                    >
                      <Search size={18} />
                      Search
                    </button>
                  </li>

                  <li>
                    <button
                      className="flex w-full items-center gap-2 px-4 py-2 hover:bg-accent transition cursor-pointer"
                      onClick={() => dispatch(setIsNewGroup(true))}
                    >
                      <UserPlus size={18} />
                      New Group
                    </button>
                  </li>

                  <li>
                    <button
                      className="flex w-full items-center gap-2 px-4 py-2 hover:bg-accent transition cursor-pointer"
                      onClick={() => navigate("/groups")}
                    >
                      <Users size={18} />
                      Groups
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* <IconBtn
            title="Logout"
            icon={<LogOut size={20} />}
            onClick={logoutHandler}
          /> */}
        </div>
      </header>

      {/* Dialogs */}
      {isSearch && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/40" />}>
          <SearchDialog />
        </Suspense>
      )}

      {isNotification && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/40" />}>
          <NotificationsDialog />
        </Suspense>
      )}

      {isNewGroup && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/40" />}>
          <NewGroupDialog />
        </Suspense>
      )}
    </>
  );
};

export default Header;
