import { type FC, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hooks";
import { transformImage } from "../../lib/features";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";
import { Check as CheckIcon, X as CrossIcon } from "lucide-react";

// =================== Notification Item ===================

interface Sender {
  avatar: string;
  name: string;
}

interface NotificationItemProps {
  sender: Sender;
  _id: string;
  handler: (data: { _id: string; accept: boolean }) => void;
}

const NotificationItem: FC<NotificationItemProps> = memo(
  ({ sender, _id, handler }) => {
    return (
      <div className="flex items-center justify-between gap-4 w-full p-2 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src={transformImage(sender.avatar)}
            alt={sender.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <p className="truncate w-40">{`${sender.name} sent you a friend request`}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-1">
          <button
            className="p-3 text-green-600 rounded-full hover:bg-green-50"
            onClick={() => handler({ _id, accept: true })}
          >
            <CheckIcon size={20} />
          </button>
          <button
            className="p-3 text-red-600 rounded-full hover:bg-red-50"
            onClick={() => handler({ _id, accept: false })}
          >
            <CrossIcon size={20} />
          </button>
        </div>
      </div>
    );
  }
);

// =================== Notifications ===================

interface RootState {
  misc: {
    isNotification: boolean;
  };
}

const Notifications: FC = () => {
  const { isLoading, data, error, isError } =
    useGetNotificationsQuery(undefined);

  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const { isNotification } = useSelector((state: RootState) => state.misc);

  const dispatch = useDispatch();

  const friendRequestHandler = async ({
    _id,
    accept,
  }: {
    _id: string;
    accept: boolean;
  }) => {
    dispatch(setIsNotification(false));
    await acceptRequest("Accepting Request...", { requestId: _id, accept });
  };

  const closeHandler = () => dispatch(setIsNotification(false));

  useErrors([{ error: error as any, isError }]);

  if (!isNotification) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-4">Notifications</h2>

        {isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <>
            {data?.requests?.length > 0 ? (
              data.requests.map((req: any) => (
                <NotificationItem
                  key={req._id}
                  sender={req.sender}
                  _id={req._id}
                  handler={friendRequestHandler}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">No notifications</p>
            )}
          </>
        )}

        <button
          className="mt-4 w-full py-2 bg-background-2 rounded-xl hover:bg-accent cursor-pointer"
          onClick={closeHandler}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Notifications;
