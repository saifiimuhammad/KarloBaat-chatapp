import React from "react";
import { User, Settings, LogOut, ChevronRight } from "lucide-react";
import { transformImage } from "../../lib/features";
import { useDispatch } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import { server } from "../../constants/config";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface ProfileProps {
  user: any;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

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
    <div className="w-full max-w-sm mx-auto px-4 py-6 pt-0">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-4">My Profile</h2>

      {/* Avatar + Status */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <img
            src={transformImage(user?.avatar?.url)}
            alt={user?.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          {/* Online dot */}
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
        </div>

        <div className="text-center">
          <p className="font-semibold text-lg">{user?.name}</p>
          <p className="text-sm text-text-light/70">@{user?.username}</p>
        </div>
      </div>

      {/* Bio Card */}
      <div className="bg-background-2 rounded-2xl p-4 mt-4">
        <h4 className="uppercase text-xs font-medium text-text-light/70">
          Bio
        </h4>
        <p className="mt-2 text-sm text-gray-700">
          {user?.bio || "No bio available"}
        </p>
      </div>

      {/* Actions */}
      <div className="my-4 pb-2 flex flex-col gap-2 border-b border-accent">
        <ActionItem
          icon={<User size={16} />}
          label="Edit Profile"
          onClick={() => navigate(`/edit-profile`)}
        />
        <ActionItem icon={<Settings size={16} />} label="Settings" />
      </div>

      {/* Logout */}
      <button
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition text-sm cursor-pointer"
        onClick={logoutHandler}
      >
        <LogOut size={16} />
        Log Out
      </button>
    </div>
  );
};

export default Profile;

/* ------------------ Components ------------------ */

interface ActionItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const ActionItem: React.FC<ActionItemProps> = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white hover:bg-zinc-100/80 transition cursor-pointer"
    >
      <div className="flex items-center gap-3 text-gray-700">
        <span className="p-3 rounded-full bg-background-2 text-text-light/70">
          {icon}
        </span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-text-light/70">
        <ChevronRight size={16} />
      </span>
    </button>
  );
};
