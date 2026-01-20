import { useState, type ReactNode, type FC } from "react";
import { Close as CloseIcon, Menu as MenuIcon } from "@mui/icons-material";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Mail,
  MessageSquareText,
  Users,
  MessageCircleHeart as KarlobaatLogo,
} from "lucide-react";

import { adminLogout } from "../../redux/thunks/admin";
import type { RootState, AppDispatch } from "../../redux/store";

/* ---------------------------------- */
/* Tabs                               */
/* ---------------------------------- */

type AdminTab = {
  name: string;
  path: string;
  icon: ReactNode;
};

const adminTabs: AdminTab[] = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <Users size={18} />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <MessageSquareText size={18} />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <Mail size={18} />,
  },
];

/* ---------------------------------- */
/* Sidebar                             */
/* ---------------------------------- */

type SidebarProps = {
  width?: string;
};

const Sidebar: FC<SidebarProps> = ({ width = "w-full" }) => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const logoutHandler = (): void => {
    dispatch(adminLogout());
  };

  return (
    <aside
      className={`${width} flex flex-col gap-6 p-4 sm:p-8 text-text border-r border-zinc-200`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3">
        <div className="p-2 rounded-xl bg-primary text-white">
          <KarlobaatLogo size={20} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-4">Karlobaat</h1>
          <p className="text-[0.85rem] font-medium text-secondary">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {adminTabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 transition font-semibold
                ${
                  isActive
                    ? "bg-accent text-primary"
                    : "text-primary hover:bg-zinc-50"
                }`}
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

/* ---------------------------------- */
/* Admin Layout                        */
/* ---------------------------------- */

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const { isAdmin } = useSelector((state: RootState) => state.auth);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  if (!isAdmin) return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen flex relative">
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen((prev) => !prev)}
        className="fixed right-4 top-4 z-50 md:hidden bg-white p-2 rounded shadow"
        aria-label="Toggle menu"
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
