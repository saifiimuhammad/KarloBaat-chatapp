import { Calendar, User, AtSign, Info } from "lucide-react";
import moment from "moment";
import React from "react";
import { transformImage } from "../../lib/features.js";

interface ProfileProps {
  user: any;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="w-full flex flex-col items-center gap-8">
      {/* Avatar */}
      <img
        src={transformImage(user?.avatar?.url)}
        alt={user?.name}
        className="w-48 h-48 rounded-full object-cover border-4 border-background shadow-lg"
      />

      {/* Info */}
      <div className="w-full flex flex-col gap-4 pt-4">
        <ProfileCard
          icon={<User size={20} />}
          heading="Name"
          text={user?.name}
        />

        <Divider />

        <ProfileCard
          icon={<AtSign size={20} />}
          heading="Username"
          text={user?.username}
        />

        <Divider />

        <ProfileCard
          icon={<Info size={20} />}
          heading="Bio"
          text={user?.bio || "No bio"}
        />

        <Divider />

        <ProfileCard
          icon={<Calendar size={20} />}
          heading="Joined"
          text={moment(user?.createdAt).fromNow()}
        />
      </div>
    </div>
  );
};

export default Profile;

interface ProfileCardProps {
  icon: React.ReactNode;
  heading: string;
  text: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ icon, heading, text }) => {
  return (
    <div className="flex items-center gap-4 text-text">
      <div className="text-primary">{icon}</div>

      <div className="flex flex-col">
        <span className="text-base font-medium">{text}</span>
        <span className="text-sm text-text/60">{heading}</span>
      </div>
    </div>
  );
};

const Divider = () => <div className="h-px w-full bg-secondary/40" />;
