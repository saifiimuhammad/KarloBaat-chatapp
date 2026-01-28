import {
  Bell as BellIcon,
  Menu as MenuIcon,
  MessageCircleHeart as KarlobaatLogo,
  MessageCirclePlus as GroupIcon,
  Search as SearchIcon,
  ChevronDown,
  EllipsisVertical,
  User,
  CircleUser,
} from "lucide-react";
import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { resetNotificationCount } from "../../redux/reducers/chat";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";

const SearchDialog = lazy(() => import("../specific/Search.jsx"));
const NotificationsDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

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
    "chats",
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const isMobile = window.innerWidth <= 500;

  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state: any) => state.misc,
  );
  const { notificationCount } = useSelector((state: any) => state.chat);

  return (
    <>
      <header className="h-16 w-full px-2 sm:px-4 bg-white flex items-center justify-between border-b border-zinc-200">
        {/* Left */}
        <div className="flex items-center gap-1 sm:gap-3">
          {isMobile && (
            <button
              onClick={() => dispatch(setIsMobile(true))}
              className="p-1 rounded-lg hover:bg-secondary/20"
            >
              <MenuIcon size={20} />
            </button>
          )}

          <button
            className="text-lg font-semibold tracking-tight flex items-center justify-center gap-1 text-center text-text/80 cursor-pointer bg-transparent border-none hover:opacity-80 transition"
            onClick={() => navigate("/")}
          >
            <KarlobaatLogo className="hidden sm:block" /> Karlobaat
          </button>
        </div>

        {/* Toggle Pill Button */}
        <div className="hidden w-full md:flex items-center justify-center">
          <div className="w-75 rounded-xl bg-background-light p-1 flex my-6">
            <button
              onClick={() => {
                navigate("/");
                setTabOpened("chats");
              }}
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
              onClick={() => {
                navigate("/groups");
                setTabOpened("groups");
              }}
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
        <div className="hidden sm:flex items-center gap-0 sm:gap-4">
          <IconBtn
            title="Notifications"
            icon={<BellIcon size={20} />}
            value={notificationCount}
            onClick={() => {
              dispatch(setIsNotification(true));
              dispatch(resetNotificationCount());
            }}
          />

          <IconBtn
            title="Search"
            icon={<SearchIcon size={20} />}
            onClick={() => dispatch(setIsSearch(true))}
          />

          <IconBtn
            title="New Group"
            icon={<GroupIcon size={20} />}
            onClick={() => dispatch(setIsNewGroup(true))}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Pill Dropdown (Mobile) */}
          {isMobile && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center justify-between w-24 px-3 py-2 bg-white rounded-lg border border-zinc-300 text-sm"
              >
                <span className="capitalize">{tabOpened}</span>
                <ChevronDown size={16} />
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-zinc-200 z-50 overflow-hidden">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => {
                      navigate("/");
                      setTabOpened("chats");
                      setIsDropdownOpen(false);
                    }}
                  >
                    Chats
                  </button>

                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => {
                      navigate("/groups");
                      setTabOpened("groups");
                      setIsDropdownOpen(false);
                    }}
                  >
                    Groups
                  </button>

                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => {
                      setTabOpened("settings");
                      setIsDropdownOpen(false);
                    }}
                  >
                    Settings
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center">
            {/* Right (Mobile) */}
            <div className="relative sm:hidden">
              <button
                onClick={() => setIsActionsOpen((prev) => !prev)}
                className="p-2 rounded-full hover:bg-secondary/20"
              >
                <EllipsisVertical size={20} />
              </button>

              {isActionsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-zinc-200 z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      dispatch(setIsNotification(true));
                      dispatch(resetNotificationCount());
                      setIsActionsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-sm"
                  >
                    <BellIcon size={18} />
                    Notifications
                    {notificationCount > 0 && (
                      <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                        {notificationCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      dispatch(setIsSearch(true));
                      setIsActionsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-sm"
                  >
                    <SearchIcon size={18} />
                    Search
                  </button>

                  <button
                    onClick={() => {
                      dispatch(setIsNewGroup(true));
                      setIsActionsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-sm"
                  >
                    <GroupIcon size={18} />
                    New Group
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate(`/edit-profile`)}
              className="w-full p-2 hover:bg-gray-100 text-sm sm:hidden"
            >
              <CircleUser size={18} />
            </button>
          </div>
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
