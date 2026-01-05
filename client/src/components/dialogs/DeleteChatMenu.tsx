import { type FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAsyncMutation } from "../../hooks/hooks";
import {
  useDeleteChatMutation,
  useLeaveGroupMutation,
} from "../../redux/api/api";
import { setIsDeleteMenu } from "../../redux/reducers/misc";
import { type Dispatch } from "redux";
import { LogOut, Trash2 } from "lucide-react";

interface DeleteChatMenuProps {
  dispatch: Dispatch;
  deleteMenuAnchor: React.RefObject<HTMLDivElement>;
}

const DeleteChatMenu: FC<DeleteChatMenuProps> = ({
  dispatch,
  deleteMenuAnchor,
}) => {
  const navigate = useNavigate();

  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state: any) => state.misc
  );

  const [deleteChat, , deleteChatData] = useAsyncMutation(
    useDeleteChatMutation
  );
  const [leaveGroup, , leaveGroupData] = useAsyncMutation(
    useLeaveGroupMutation
  );

  const isGroup = selectedDeleteChat?.groupChat;

  const closeHandler = () => {
    dispatch(setIsDeleteMenu(false));
    if (deleteMenuAnchor.current) deleteMenuAnchor.current = null;
  };

  const leaveGroupHandler = () => {
    closeHandler();
    leaveGroup("Leaving Group...", selectedDeleteChat.chatId);
  };

  const deleteChatHandler = () => {
    closeHandler();
    deleteChat("Deleting Chat...", selectedDeleteChat.chatId);
  };

  useEffect(() => {
    if (deleteChatData || leaveGroupData) navigate("/");
  }, [deleteChatData, leaveGroupData, navigate]);

  if (!isDeleteMenu || !deleteMenuAnchor.current) return null;

  const rect = deleteMenuAnchor.current.getBoundingClientRect();

  return (
    <div
      className="absolute z-50 bg-white shadow-md rounded-md w-40 p-2"
      style={{ top: rect.bottom + window.scrollY, left: rect.right - 160 }}
    >
      <div
        className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded cursor-pointer"
        onClick={isGroup ? leaveGroupHandler : deleteChatHandler}
      >
        {isGroup ? (
          <LogOut className="text-lg" />
        ) : (
          <Trash2 className="text-lg" />
        )}
        <span className="text-sm font-medium">
          {isGroup ? "Leave Group" : "Delete Chat"}
        </span>
      </div>
    </div>
  );
};

export default DeleteChatMenu;
