

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  Stack,
  Typography,
  Button
} from '@mui/material';
import { sampleUsers } from '../../constants/sampleData.js';
import UserItem from '../shared/UserItem.jsx';






const AddMemberDialog = ({ addMember, isLoadingAddMember, chatId }) => {

  const [ members, setMembers ] = useState(sampleUsers);
  const [ selectedMembers, setSelectedMembers ] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) => prev.includes(id) ? prev.filter((currElem) => currElem !== id) : [...prev, id]);
  };
  const addMemberSubmitHandler = () => {
    closeHandler();
  }
  const closeHandler = () => {
    setMembers([]);
    setSelectedMembers([]);
  }

return (
  <Dialog open onClose={closeHandler}>
  <Stack p="2rem" maxWidth="20rem" spacing="2rem">
  <DialogTitle textAlign="center">Add Member</DialogTitle>
  <Stack spacing="1rem">
  {
    members.length > 0 ? (
      members.map((i) => {
      return (
        <UserItem key={i._id} user={i} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}/>
      )
    })
    ) : (
      <Typography textAlign="center">No Friends</Typography>
    )
  }
  </Stack>
  <Stack direction="row" alignItems="center" justifyContent="space-evenly">
  <Button color="error" onClick={closeHandler}>Cancel</Button>
  <Button variant="contained" disabled={isLoadingAddMember} onClick={addMemberSubmitHandler}>Submit Changes</Button>
  </Stack>
  </Stack>
  </Dialog>
);
}

export default AddMemberDialog;
