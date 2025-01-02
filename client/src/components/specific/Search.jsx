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
import React, { useEffect, useState } from "react";
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

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
  };

  const handleSearchClose = () => dispatch(setIsSearch(false));

  useEffect(() => {
    const timeoutId = setTimeout(() => {}, 1000);
    searchUser(search.value)
      .then(({ data }) => setUsers(data.users))
      .catch((err) => console.log(err));
    return () => {
      clearTimeout(timeoutId);
    };
  }, [search.value]);

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
          {users.map((i) => {
            return (
              <UserItem
                user={i}
                key={i._id}
                handler={addFriendHandler}
                handlerIsLoading={isLoadingSendFriendRequest}
              />
            );
          })}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
