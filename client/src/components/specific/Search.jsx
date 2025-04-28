import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sampleUsers } from "../../constants/sampleData.js";
import { useAsyncMutation } from "../../hooks/hooks.jsx";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api.js";
import { setIsSearch } from "../../redux/reducers/misc.js";
import UserItem from "../shared/UserItem.jsx";

const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);

  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const dispatch = useDispatch();

  const search = useInputValidation("");

  const [users, setUsers] = useState(sampleUsers);

  const addFriendHandler = useCallback(
    async (id) => {
      await sendFriendRequest("Sending friend request...", { userId: id });
    },
    [sendFriendRequest]
  );

  const handleSearchClose = () => dispatch(setIsSearch(false));

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search.value.trim() !== "") {
        searchUser(search.value)
          .then(({ data }) => setUsers(data.users))
          .catch((err) => console.log(err));
      }
    }, 500);

    if (search.value.trim() === "") {
      setUsers([]);
      return;
    }

    return () => clearTimeout(timeoutId);
  }, [search.value, searchUser]);

  return (
    <Dialog open={isSearch} onClose={handleSearchClose}>
      <Stack p="2rem" direction="column" width="25rem">
        <DialogTitle textAlign="center">Find People</DialogTitle>
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <List>
          {users.length > 0 ? (
            users.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={addFriendHandler}
                handlerIsLoading={isLoadingSendFriendRequest}
              />
            ))
          ) : (
            <p style={{ textAlign: "center", marginTop: "1rem" }}>
              Search for users 🔍
            </p>
          )}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
