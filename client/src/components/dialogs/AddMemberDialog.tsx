import { type FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type RootState from "../../redux/store";

import UserItem from "../shared/UserItem";
import { useAsyncMutation, useErrors } from "../../hooks/hooks";
import {
  useAddGroupMembersMutation,
  useAvailableFriendsQuery,
} from "../../redux/api/api";
import { setIsAddMember } from "../../redux/reducers/misc";

type AddMemberDialogProps = {
  chatId: string;
};

const AddMemberDialog: FC<AddMemberDialogProps> = ({ chatId }) => {
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state: typeof RootState) => state.misc);

  const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);

  const [addMember, isLoadingAddMember] = useAsyncMutation(
    useAddGroupMembersMutation
  );

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const selectMemberHandler = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((memberId) => memberId !== id)
        : [...prev, id]
    );
  };

  const closeHandler = () => {
    dispatch(setIsAddMember(false));
  };

  const addMemberSubmitHandler = () => {
    addMember("Adding Members...", {
      members: selectedMembers,
      chatId,
    });
    closeHandler();
  };

  useErrors([{ isError, error }]);

  if (!isAddMember) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-center text-lg font-semibold text-gray-900">
          Add Member
        </h2>

        <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="h-10 animate-pulse rounded bg-gray-200" />
          ) : data?.friends?.length > 0 ? (
            data.friends.map((user: any) => (
              <UserItem
                key={user._id}
                user={user}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(user._id)}
              />
            ))
          ) : (
            <p className="text-center text-sm text-gray-500">No Friends</p>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={closeHandler}
            className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            disabled={isLoadingAddMember}
            onClick={addMemberSubmitHandler}
            className="rounded-lg text-green-600 px-4 py-2 text-sm font-medium bg-white hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
          >
            Submit Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberDialog;
