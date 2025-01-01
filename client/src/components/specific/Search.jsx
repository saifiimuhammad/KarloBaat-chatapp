import React, { useState } from "react";
import {
  Dialog,
  Stack,
  DialogTitle,
  TextField,
  InputAdornment,
  List,
} from "@mui/material";
import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from "../shared/UserItem.jsx";
import { sampleUsers } from "../../constants/sampleData.js";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../redux/reducers/misc.js";

const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);

  const dispatch = useDispatch();

  const search = useInputValidation("");

  const [users, setUsers] = useState(sampleUsers);

  let isLoadingSendFriendRequest = false;

  const addFriendHandler = (id) => {
    console.log(id);
  };

  const handleSearchClose = () => dispatch(setIsSearch(false));

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
