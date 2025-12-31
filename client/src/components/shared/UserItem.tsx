import { type FC, memo } from "react";
import { UserPlus, UserMinus } from "lucide-react";
import { transformImage } from "../../lib/features";

interface User {
  _id: string;
  name: string;
  avatar: string;
}

interface UserItemProps {
  user: User;
  handler: (id: string) => void;
  handlerIsLoading: boolean;
  isAdded?: boolean;
  styling?: Record<string, any>;
}

const UserItem: FC<UserItemProps> = ({
  user,
  handler,
  handlerIsLoading,
  isAdded = false,
  styling = {},
}) => {
  return (
    <li className="w-full" {...styling}>
      <div className="flex items-center justify-between gap-3 w-full p-2">
        <div className="flex items-center gap-3">
          <img
            src={transformImage(user.avatar)}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <p className="truncate w-40">{user.name}</p>
        </div>

        <button
          className={`p-3 rounded-full cursor-pointer ${
            isAdded
              ? "text-red-600 hover:bg-red-50"
              : "text-green-600 hover:bg-green-50"
          }`}
          onClick={() => handler(user._id)}
          disabled={handlerIsLoading}
        >
          {isAdded ? <UserMinus size={20} /> : <UserPlus size={20} />}
        </button>
      </div>
    </li>
  );
};

export default memo(UserItem);
