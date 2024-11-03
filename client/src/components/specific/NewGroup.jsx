

import React, { useState } from 'react';
import { Dialog, Stack, DialogTitle, Typography, TextField, Button } from '@mui/material';
import { sampleUsers } from '../../constants/sampleData.js';
import UserItem from '../shared/UserItem.jsx';
import { useInputValidation } from '6pp';


const NewGroup = () => {

  const [ members, setMembers ] = useState(sampleUsers);
  const [ selectedMembers, setSelectedMembers ] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) => prev.includes(id) ? prev.filter((currElem) => currElem !== id) : [...prev, id]);
  };
  const submitHandler = () => {};

  const closeHandler = () => {};
  
  const groupName = useInputValidation("");

  return (
    <Dialog open onClose={closeHandler}>
    <Stack p={{ xs: "1rem", sm: "2rem" }} width="25rem" spacing="2rem">
    <DialogTitle textAlign="center" variant="h4">New Group</DialogTitle>

    <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler}/>

    <Typography variant="body1">Members</Typography>

    <Stack>
    {
      members.map((i) => {
        return (
          <UserItem user={i} key={i._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)} />
        );
      })
    }
    </Stack>

    <Stack direction="row" justifyContent="space-evenly">
    <Button variant="text" color="error" size="large">Cancel</Button>
    <Button variant="contained" size="large" onClick={submitHandler}>Create</Button>
    </Stack>

    </Stack>
    </Dialog>
  );
}

export default NewGroup;
