import "./style.css";
import { type FC, Suspense, lazy, useEffect, useRef } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";
import { LayoutLoader } from "./components/layout/Loaders";
import axios from "axios";
import { server } from "./constants/config";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./socket";
import Header from "./components/layout/Header";
import EditProfile from "./pages/EditProfile";
import type { RootState, AppDispatch } from "./redux/store";
import ChangePassword from "./pages/ChangePassword";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/NotFound"));

const Landing = lazy(() => import("./pages/landing/Landing"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));
const Features = lazy(() => import("./pages/landing/Features"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"));
const MessageManagement = lazy(() => import("./pages/admin/MessageManagement"));

type AvatarFile = {
  url: string;
  public_id: string;
};

interface User {
  _id: string;
  avatar: AvatarFile;
  name: string;
  username: string;
  bio: string;
  createdAt: string;
}

const App: FC = () => {
  const { user, loader } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();

  const { pathname } = useLocation();

  const hideHeader =
    /^\/(admin|welcome|features|login|not-found|verify-email|forgot-password|change-password)/.test(
      pathname,
    );

  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, {
        withCredentials: true,
      })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch(() => dispatch(userNotExists()));
  }, [dispatch]);

  if (loader) return <LayoutLoader />;

  return (
    <>
      {!hideHeader && <Header />}
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          <Route
            element={
              <SocketProvider>
                <ProtectRoute user={user} />
              </SocketProvider>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/edit-profile" element={<EditProfile user={user} />} />
          </Route>

          <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <ProtectRoute user={!user} redirect="/">
                <VerifyOtp />
              </ProtectRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />

          <Route path="/welcome" element={<Landing />} />
          <Route path="/features" element={<Features />} />

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/chats" element={<ChatManagement />} />
          <Route path="/admin/messages" element={<MessageManagement />} />

          <Route path="*" element={<Navigate to="/not-found" replace />} />
          <Route path="/not-found" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Toaster position="bottom-center" />
    </>
  );
};

export default App;
