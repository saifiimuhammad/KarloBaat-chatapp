import { useNavigate } from "react-router-dom";
import { useEditProfileMutation } from "../redux/api/api";
import { useState, type FC } from "react";
import { toast } from "react-hot-toast";

type File = {
  url: string;
  public_id: string;
};

interface EditProfileProps {
  user: {
    avatar: File;
    name: string;
    username: string;
    bio: string;
    createdAt: string;
  };
}

const EditProfile: FC<EditProfileProps> = ({ user }) => {
  const navigate = useNavigate();

  const [editProfile, { isLoading }] = useEditProfileMutation();

  // local state
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [avatar, setAvatar] = useState<Blob | MediaSource | null>(null);

  const handleEditProfile = async () => {
    try {
      await editProfile({
        name,
        username,
        bio,
        avatar,
      }).unwrap();

      toast.success("Profile updated successfully");
      navigate(-1);
    } catch (err: any) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  return (
    <div className="w-full min-h-screen text-text bg-background-2 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 py-6 sm:py-8 md:py-12">
      {/* Header */}
      <div className="w-full">
        <h1 className="text-xl sm:text-2xl font-bold">Edit Profile</h1>
        <h3 className="text-sm sm:text-base text-text-light tracking-wide mt-1">
          Update your personal details and public info
        </h3>
      </div>

      <div className="flex flex-col gap-6 mt-8 sm:mt-10">
        {/* Avatar Section */}
        <div className="w-full rounded-xl bg-white border border-zinc-200 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img
                src={avatar ? URL.createObjectURL(avatar) : user.avatar.url}
                alt="user profile pic"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-primary"
              />

              <div className="text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-bold">{user.name}</h2>
                <h4 className="text-text-light text-sm mt-1">
                  @{user.username}
                </h4>
                <p className="text-text-light text-xs sm:text-sm mt-1">
                  JPG or PNG · Max 5MB
                </p>
              </div>
            </div>

            <label className="self-center sm:self-auto px-5 py-3 rounded-xl font-medium text-sm sm:text-base text-white bg-primary hover:bg-[#516839] cursor-pointer transition-colors">
              Update Avatar
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              />
            </label>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="w-full rounded-xl bg-white border border-zinc-200 p-4 sm:p-6 md:p-8">
          <h2 className="text-lg sm:text-xl font-bold pb-4 border-b border-zinc-200">
            Profile Information
          </h2>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label htmlFor="name" className="block font-medium mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 text-sm sm:text-base border bg-[#f6f8f4] border-zinc-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="username" className="block font-medium mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 text-sm sm:text-base border bg-[#f6f8f4] border-zinc-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6">
            <label htmlFor="bio" className="block font-medium mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a little about yourself..."
              rows={4}
              className="w-full px-4 py-3 text-sm sm:text-base border bg-[#f6f8f4] border-zinc-300 rounded-lg focus:outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full rounded-xl bg-white border border-zinc-200 p-4 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-3 rounded-xl font-medium text-sm sm:text-base bg-white hover:bg-accent transition-colors"
          >
            Cancel
          </button>

          <button
            disabled={isLoading}
            onClick={handleEditProfile}
            className="px-5 py-3 rounded-xl font-medium text-sm sm:text-base text-white bg-primary hover:bg-[#516839] transition-colors disabled:opacity-60"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditProfile;
