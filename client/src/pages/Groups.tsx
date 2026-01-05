import React, {
  Suspense,
  lazy,
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Check,
  Trash2,
  Search,
  Pen,
  Users,
  UserPlus,
  UserMinus,
  Flag,
} from "lucide-react";

import AvatarCard from "../components/shared/AvatarCard";
import { LayoutLoader } from "../components/layout/Loaders";
import { useAsyncMutation, useErrors } from "../hooks/hooks";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMembersMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { setIsAddMember } from "../redux/reducers/misc";
import { transformImage } from "../lib/features";

const ConfirmDeleteDialog = lazy(
  () => import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(
  () => import("../components/dialogs/AddMemberDialog")
);

const Groups = () => {
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);

  const myGroups = useMyGroupsQuery();
  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const [renameGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );
  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMembersMutation
  );
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const errors = [
    { isError: myGroups.isError, error: myGroups.error },
    { isError: groupDetails.isError, error: groupDetails.error },
  ];
  useErrors(errors);

  useEffect(() => {
    if (groupDetails.data) {
      setGroupName(groupDetails.data.chat.name);
      setGroupNameUpdatedValue(groupDetails.data.chat.name);
      setGroupMembers(groupDetails.data.chat.members);
    }
    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setGroupMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  const handleMobile = () => setIsMobileMenuOpen((prev) => !prev);
  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const updateGroupName = () => {
    setIsEdit(false);
    renameGroup("Updating Group Name...", {
      chatId,
      name: groupNameUpdatedValue,
    });
  };

  const openConfirmDeleteHandler = () => setConfirmDeleteDialog(true);
  const closeConfirmDeleteHandler = () => setConfirmDeleteDialog(false);

  const openAddMemberHandler = () => dispatch(setIsAddMember(true));
  const removeMemberHandler = (userId) =>
    removeMember("Removing Member...", { chatId, userId });

  const deleteHandler = () => {
    deleteGroup("Deleting group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/groups");
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filtered groups based on debounced query
  const filteredGroups = useMemo(() => {
    if (!myGroups?.data?.groups) return [];
    if (!debouncedQuery) return myGroups.data.groups;

    return myGroups.data.groups.filter((group) =>
      group.name.toLowerCase().includes(debouncedQuery)
    );
  }, [debouncedQuery, myGroups]);

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }
    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);

  const GroupName = (
    <div className="flex flex-col sm:flex-row items-center justify-start gap-4 w-full">
      {isEdit ? (
        <div className="relative w-82">
          <input
            className="px-4 py-3 rounded-xl bg-white text-text 
        placeholder:text-[#9b988c] placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
            type="text"
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
          />
          <button
            onClick={updateGroupName}
            disabled={isLoadingGroupName}
            className="absolute top-[0.45rem] right-2 p-2 bg-white text-green-500 hover:bg-green-50 rounded-full disabled:opacity-50"
          >
            <Check size={18} />
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-4xl font-bold text-text">{groupName}</h2>
          <button
            onClick={() => setIsEdit(true)}
            disabled={isLoadingGroupName}
            className="p-3 rounded-full hover:bg-secondary hover:text-white disabled:opacity-50 cursor-pointer"
          >
            <Pen size={18} />
          </button>
        </>
      )}
    </div>
  );

  if (myGroups.isLoading) return <LayoutLoader />;

  return (
    <div className="flex h-screen gap-4 bg-background-light">
      {/* Groups List */}
      <div className="hidden sm:flex sm:flex-col sm:w-1/3 h-screen px-4 pt-4 bg-[#F4EFE6] border-r border-zinc-300">
        <div className="relative w-full">
          <div
            className={`absolute left-3 top-5 -translate-y-1/2 text-[#9b988c] ${
              isActive ? "text-text/70" : ""
            }`}
          >
            <Search size={16} />
          </div>
          <input
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white text-text 
        placeholder:text-[#9b988c] placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            type="text"
            name="search"
            id="search"
            value={searchQuery}
            placeholder="Search groups..."
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
          />
        </div>

        <h2 className="uppercase text-xs text-text-light font-medium my-4">
          All Groups
        </h2>
        <GroupsList myGroups={filteredGroups} chatId={chatId} />
      </div>

      {/* Group Details */}
      <div className="flex-1 flex flex-col items-center relative sm:px-12">
        {groupName ? (
          <>
            <div className="w-full px-12 pt-18 pb-8">
              {GroupName}
              <div className="flex items-center justify-start gap-3 text-primary py-2">
                <Users size={18} /> {groupMembers.length} Members{" "}
                <span className="w-[0.4rem] h-[0.4rem] rounded-full bg-primary"></span>{" "}
                Online
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              <div className="md:col-span-2">
                <div className="mb-2 flex items-center justify-between w-full">
                  <h3 className="self-start text-lg text-text font-semibold flex items-center justify-center gap-2">
                    Members{" "}
                    <span className="text-primary text-[1rem] font-normal">
                      ({groupMembers.length})
                    </span>
                  </h3>
                  <button
                    onClick={openAddMemberHandler}
                    className="flex items-center gap-2 text-primary hover:text-secondary cursor-pointer text-sm"
                  >
                    <UserPlus size={18} /> Add Member
                  </button>
                </div>

                <div
                  className={`w-full ${
                    groupMembers.length <= 5 ? "" : "h-86"
                  } overflow-y-auto no-scrollbar flex flex-col border border-zinc-300 rounded-xl bg-white divide-y divide-zinc-300`}
                >
                  {isLoadingRemoveMember
                    ? "Loading..."
                    : groupMembers.map((i) => (
                        <GroupMember
                          key={i._id}
                          user={i}
                          handler={removeMemberHandler}
                          isAdded
                        />
                      ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white p-5 pt-3 rounded-xl border border-zinc-300">
                  <h4 className="font-semibold text-text text-sm mb-2">
                    Settings
                  </h4>

                  <hr className="border-zinc-300 my-2" />
                  <button
                    onClick={openConfirmDeleteHandler}
                    className="w-full flex items-center gap-3 text-red-600 hover:text-red-700 text-sm font-medium p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={18} />
                    Delete Group
                  </button>
                  <button className="w-full flex items-center gap-3 text-text-muted hover:text-black text-sm font-medium p-2 mt-1 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <Flag size={18} />
                    Report Group
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="pt-16 flex flex-col items-center gap-2 text-center">
            <p className="text-xl font-semibold text-text">No group selected</p>
            <p className="text-sm text-text-light">
              Choose a group to see messages
            </p>
          </div>
        )}
      </div>

      {/* Add Member Dialog */}
      {isAddMember && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50" />}>
          <AddMemberDialog chatId={chatId} />
        </Suspense>
      )}

      {/* Confirm Delete Dialog */}
      {confirmDeleteDialog && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50" />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 sm:hidden z-50">
          <div className="bg-white w-4/5 h-full p-4">
            <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
            <button
              onClick={handleMobileClose}
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const GroupsList = ({ myGroups = [] }) => (
  <div className="flex flex-col gap-2 h-full flex-1 overflow-y-auto no-scrollbar rounded">
    {myGroups.length > 0 ? (
      myGroups.map((group) => <GroupsListItem key={group._id} group={group} />)
    ) : (
      <div className="flex-1 flex items-center justify-center text-center p-4 text-text-light">
        No groups
      </div>
    )}
  </div>
);

const GroupsListItem = memo(({ group }) => {
  const { name, avatar, _id } = group;
  return (
    <Link to={`?group=${_id}`}>
      <div className="flex items-center gap-3 w-full px-3 py-4 rounded-xl hover:bg-[#FBF9F5] cursor-pointer border border-transparent hover:border-zinc-300 outline-none">
        <AvatarCard avatar={avatar} />
        <div className="flex flex-col items-start justify-center gap-1 w-full">
          <div className="w-full flex items-center justify-between">
            <h3 className="font-semibold">{name}</h3>

            <p className="text-xs text-text-light">Yesterday</p>
          </div>
          <p className="text-xs text-text-light">Mom: Family dinner at 9pm?</p>
        </div>
        <div className="py-1 px-2 rounded-full text-xs text-white bg-primary">
          3
        </div>
      </div>
    </Link>
  );
});

const GroupMember = memo(
  ({ user, handler, handlerIsLoading, isAdded = false }) => {
    return (
      <div className="flex items-center justify-between p-4 hover:bg-background-light transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <img
            src={transformImage(user.avatar)}
            className="size-10 rounded-full bg-cover bg-center"
            alt={user.name}
          />

          <div className="flex items-start justify-center flex-col gap-[.15rem]">
            <p className="text-sm font-semibold text-text flex items-center gap-2">
              {user.name}

              {user.isAdmin && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-secondary text-text font-bold tracking-wide uppercase">
                  Admin
                </span>
              )}
            </p>

            <p className="text-xs text-text-light">
              {user.status ?? "Offline"}
            </p>
          </div>
        </div>

        <button
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            isAdded
              ? "text-red-600 hover:bg-red-50"
              : "text-green-600 hover:bg-green-50"
          }`}
          onClick={() => handler(user._id)}
          disabled={handlerIsLoading}
        >
          {isAdded ? <UserMinus size={18} /> : <UserPlus size={18} />}
        </button>
      </div>
    );
  }
);

export default Groups;
