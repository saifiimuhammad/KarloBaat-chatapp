import React, { useState } from "react";
import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  Groups as GroupsIcon,
  ManageAccounts as ManageAccountsIcon,
  Menu as MenuIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../redux/thunks/admin";
import { grayColor, matteBlack } from "../../constants/colors";
import {
  MessageCircleHeart as KarlobaatLogo,
  LayoutDashboard,
  Mail,
  MessageSquare,
  MessageSquareText,
  Users,
} from "lucide-react";

const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <Users />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <MessageSquareText />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <Mail />,
  },
];

const Sidebar = ({ width = "w-full" }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(adminLogout());
  };

  return (
    <aside
      className={`${width} flex flex-col gap-6 p-4 sm:p-8 text-text border-r border-zinc-200`}
    >
      <div className="flex items-center justify-start gap-2 w-full px-3">
        <div className="p-2 rounded-xl bg-primary text-white">
          <KarlobaatLogo />
        </div>
        <div className="w-full">
          <h1 className="font-bold text-lg leading-4">Karlobaat</h1>
          <h4 className="text-[0.85rem] font-medium w-full text-secondary">
            Admin Panel
          </h4>
        </div>
      </div>
      <nav className="flex flex-col gap-2">
        {adminTabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 transition text-primary font-semibold
                ${isActive ? "bg-accent hover:bg-accent" : "hover:bg-zinc-50"}`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

const AdminLayout = ({ children }) => {
  const { isAdmin } = useSelector((state) => state.auth);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!isAdmin) return <Navigate to="/admin" />;

  return (
    <div className="min-h-screen flex relative">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen((prev) => !prev)}
        className="fixed right-4 top-4 z-50 md:hidden bg-white p-2 rounded shadow"
      >
        {isMobileOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden md:block md:w-1/3 lg:w-1/5">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="w-full md:w-2/3 lg:w-4/5 bg-background-light text-text">
        {children}
      </main>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            className="h-full bg-white w-[70vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar width="w-[70vw]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
