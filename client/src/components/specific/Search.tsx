import { type FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInputValidation } from "6pp";
import { useAsyncMutation } from "../../hooks/hooks";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";
import { sampleUsers } from "../../constants/sampleData";
import { Search as SearchIcon } from "lucide-react";

interface User {
  _id: string;
  name: string;
  avatar: string;
}

interface RootState {
  misc: {
    isSearch: boolean;
  };
}

const Search: FC = () => {
  const { isSearch } = useSelector((state: RootState) => state.misc);
  const dispatch = useDispatch();

  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const search = useInputValidation("");
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [isActive, setIsActive] = useState(false);

  const addFriendHandler = useCallback(
    async (id: string) => {
      await sendFriendRequest("Sending friend request...", { userId: id });
    },
    [sendFriendRequest]
  );

  const handleSearchClose = () => dispatch(setIsSearch(false));

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search.value.trim() !== "") {
        searchUser(search.value)
          .then(({ data }) => setUsers(data?.users ?? []))
          .catch((err) => console.log(err));
      }
    }, 500);

    if (search.value.trim() === "") {
      setUsers([]);
    }

    return () => clearTimeout(timeoutId);
  }, [search.value, searchUser]);

  if (!isSearch) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-center mb-4">Find People</h2>

        <div className="relative w-full mb-4">
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
            value={search.value}
            onChange={search.changeHandler}
            placeholder="Search users..."
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
          />
        </div>

        <ul>
          {users.length > 0 ? (
            users.map((i) => (
              <UserItem
                key={i._id}
                user={i}
                handler={addFriendHandler}
                handlerIsLoading={isLoadingSendFriendRequest}
              />
            ))
          ) : (
            <p className="text-sm text-center mb-8 mt-4 text-text-light">
              Type a name to find new friends 👋
            </p>
          )}
        </ul>

        <button
          className="mt-4 w-full py-2 bg-background-2 rounded-xl hover:bg-accent cursor-pointer"
          onClick={handleSearchClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Search;
