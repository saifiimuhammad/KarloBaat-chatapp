import { type FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInputValidation } from "6pp";
import { useAsyncMutation, useErrors } from "../../hooks/hooks";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { setIsNewGroup } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";
import toast from "react-hot-toast";
import { Search as SearchIcon } from "lucide-react";

interface User {
  _id: string;
  name: string;
  avatar: string;
}

interface RootState {
  misc: {
    isNewGroup: boolean;
  };
}

const NewGroup: FC = () => {
  const dispatch = useDispatch();
  const { isNewGroup } = useSelector((state: RootState) => state.misc);

  const { data, isLoading, isError, error } =
    useAvailableFriendsQuery(undefined);
  const [createGroup, isLoadingNewGroup] =
    useAsyncMutation(useNewGroupMutation);

  const groupName = useInputValidation("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false);

  useErrors([{ isError, error: error as any }]);

  const selectMemberHandler = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((curr) => curr !== id) : [...prev, id]
    );
  };

  const submitHandler = () => {
    if (!groupName.value.trim()) return toast.error("Group name is required");
    if (selectedMembers.length < 2)
      return toast.error("Please select at least 2 members");

    createGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });

    closeHandler();
  };

  const closeHandler = () => dispatch(setIsNewGroup(false));

  if (!isNewGroup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center">New Group</h2>

        <div className="relative w-full">
          <div
            className={`absolute left-3 top-5 -translate-y-1/2 text-[#9b988c] ${
              isActive ? "text-text/70" : ""
            }`}
          >
            <SearchIcon size={16} />
          </div>
          <input
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#f6f8f4] text-text 
                        placeholder:text-[#9b988c] placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            type="text"
            placeholder="Enter group name"
            value={groupName.value}
            onChange={groupName.changeHandler}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
          />
        </div>

        <p className="font-medium">Members</p>

        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          ) : (
            data?.friends?.map((friend: User) => (
              <UserItem
                key={friend._id}
                user={friend}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(friend._id)}
                handlerIsLoading={false}
              />
            ))
          )}
        </ul>

        <div className="flex justify-evenly gap-2">
          <button
            className="w-full px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 hover:cursor-pointer"
            onClick={closeHandler}
          >
            Cancel
          </button>
          <button
            className={`w-full px-4 py-2 rounded-xl text-green-600 hover:bg-green-50 hover:cursor-pointer ${
              isLoadingNewGroup ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewGroup;
