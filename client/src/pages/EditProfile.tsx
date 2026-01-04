import { useNavigate } from "react-router-dom";

interface EditProfileProps {
  user: {
    avatar: {
      url: string;
      public_id: string;
    };
    name: string;
    username: string;
    bio: string;
    createdAt: string;
  };
}

const EditProfile = ({ user }) => {
  const navigate = useNavigate();

  const handleEditProfile = () => {};

  return (
    <div className="w-full h-full text-text bg-background-2 px-32 py-12">
      <div className="w-full">
        <h1 className="text-[1.75rem] font-bold">Edit Profile</h1>
        <h3 className="text-text-light tracking-wide mt-[0.3rem]">
          Update your personal details and public info
        </h3>
      </div>
      <div className="flex items-start justify-start flex-col gap-4 mt-10">
        {/* Avatar Section */}
        <div className="w-full rounded-xl bg-white flex items-center justify-between p-8 border border-zinc-200">
          <div className="flex items-center justify-center gap-8">
            <img
              src={user.avatar.url}
              alt="user profile pic"
              className="w-28 h-28 rounded-full object-cover border-4 border-primary"
            />
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <h4 className="text-text-light mt-[0.15rem]">@{user.username}</h4>
              <p className="text-text-light">
                Allowed formats: JPG, PNG. Max size: 5MB
              </p>
            </div>
          </div>

          <button className="px-5 py-3 rounded-xl font-medium text-lg text-white bg-primary hover:bg-[#516839] transition-colors cursor-pointer">
            Update Avatar
          </button>
        </div>

        {/* Profile Info Section */}
        <div className="w-full rounded-xl bg-white p-8 border border-zinc-200">
          <h2 className="text-xl font-bold pb-4 border-b border-zinc-200">
            Profile Information
          </h2>

          <div className="w-full flex items-center justify-between gap-8">
            <div className="w-full">
              <label htmlFor="name" className="block font-medium mt-6 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                defaultValue={user.name}
                className="w-full px-4 py-3 border bg-[#f6f8f4] border-zinc-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div className="w-full">
              <label htmlFor="username" className="block font-medium mt-6 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                defaultValue={user.username}
                className="w-full px-4 py-3 border bg-[#f6f8f4] border-zinc-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <div className="w-full">
              <label htmlFor="username" className="block font-medium mt-6 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                defaultValue={user.bio}
                placeholder="Tell us a real about yourself..."
                className="w-full px-4 py-3 border bg-[#f6f8f4] border-zinc-300 rounded-lg focus:outline-none focus:border-primary"
                rows={4}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="w-full rounded-xl bg-white p-8 py-6 border border-zinc-200 flex items-center justify-end gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-3 rounded-xl font-medium text-lg bg-white hover:bg-accent transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleEditProfile}
            className="px-5 py-3 rounded-xl font-medium text-lg text-white bg-primary hover:bg-[#516839] transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditProfile;
