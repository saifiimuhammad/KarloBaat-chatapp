import { Plus, Users, LogOut, Menu, Bell, Search } from "lucide-react";
import axios from "axios";
import React, { Suspense, lazy } from "react";
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

import appLogo from "../../../public/assets/images/karlobaat.png";

const SearchDialog = lazy(() => import("../specific/Search"));
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
      className="relative p-2 rounded-full hover:bg-secondary/20 transition"
    >
      {value ? (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-xs rounded-full bg-red-500 text-white flex items-center justify-center">
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

  const isMobile = window.innerWidth <= 500;

  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state: any) => state.misc
  );
  const { notificationCount } = useSelector((state: any) => state.chat);

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Logout failed");
    }
  };

  return (
    <>
      <header className="h-16 px-4 bg-primary text-background flex items-center shadow-md">
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

          <img
            src={appLogo}
            alt="Karlobaat"
            className="h-9 object-contain cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right */}
        <div className="flex items-center gap-1 sm:gap-4">
          <IconBtn
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
          />

          <IconBtn
            title="Notifications"
            icon={<Bell size={20} />}
            value={notificationCount}
            onClick={() => {
              dispatch(setIsNotification(true));
              dispatch(resetNotificationCount());
            }}
          />

          <IconBtn
            title="Logout"
            icon={<LogOut size={20} />}
            onClick={logoutHandler}
          />
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
