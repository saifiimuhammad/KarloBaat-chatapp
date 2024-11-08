

import React, {
  Suspense, 
  lazy, 
  useState, 
  memo, 
  useEffect
} from 'react';
import { 
  Grid, 
  Tooltip, 
  IconButton, 
  Box, 
  Drawer, 
  Stack, 
  Typography, 
  TextField, 
  Button, 
  Backdrop 
} from '@mui/material';
import { 
  KeyboardBackspace as KeyboardBackspaceIcon, 
  Menu as MenuIcon, 
  Edit as EditIcon, 
  Done as DoneIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon 
} from '@mui/icons-material';
import { matteBlack } from '../constants/colors.js';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from '../components/styles/StyledComponents.jsx';
import AvatarCard from '../components/shared/AvatarCard.jsx';
import { sampleChats, sampleUsers } from '../constants/sampleData.js';
import UserItem from '../components/shared/UserItem.jsx';

const ConfirmDeleteDialog = lazy(() => import("../components/dialogs/ConfirmDeleteDialog.jsx"));
const AddMemberDialog = lazy(() => import("../components/dialogs/AddMemberDialog.jsx"));

const isAddMember = false;

const Groups = () => {

  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();

  const navigateBack = () => navigate('/');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  const handleMobileClose = () => setIsMobileMenuOpen(false);
  const updateGroupName = () => {
    setIsEdit(false);
    console.log(groupNameUpdatedValue);
  }
  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  }
  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  }
  const openAddMemberHandler = () => {}
  const deleteHandler = () => {
    closeConfirmDeleteHandler();
  }
  const removeMemberHandler = (id) => {}

  useEffect(() => {
    if(chatId) {
    setGroupName(`Group Name ${chatId}`);
    setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    }
  }, [chatId])

  const IconBtns = <>

    <Box sx={{
      display: {
        xs: "block",
          sm: "none"
      },
        position: "fixed",
        right: "1rem",
        top: "1rem"
    }}>
    <Tooltip title="Groups list">
    <IconButton onClick={handleMobile}>
    <MenuIcon/>
    </IconButton>
    </Tooltip>
    </Box>

    <Tooltip title="Go Back">
    <IconButton sx={{
      position: "absolute",
        top: "2rem",
        left: "2rem",
        bgcolor: matteBlack,
        color: "white",
        ":hover": {
          bgcolor: "rgba(0,0,0,0.7)"
        }
    }} onClick={navigateBack}>
    <KeyboardBackspaceIcon/>
    </IconButton>
    </Tooltip>
    </>

    const GroupName = (
      <Stack direction="row" alignItems="center" justifyContent="center" spacing="1rem" padding="3rem">
      {
        isEdit ? (<>
          <TextField value={groupNameUpdatedValue} onChange={(e) => setGroupNameUpdatedValue(e.target.value)}/>
          <IconButton onClick={updateGroupName}>
          <DoneIcon/>
          </IconButton>
          </>) : (<>
            <Typography variant="h5">{groupName}</Typography>
            <IconButton onClick={() => setIsEdit(true)}>
            <EditIcon/>
            </IconButton>
            </>)
      }
      </Stack>
    );

  const ButtonGroup = (
    <Stack
    direction={{
      xs: "column-reverse",
        sm: "row"
    }}
    spacing="1rem"
    p={{
      xs: "0",
        sm: "1rem",
        md: "1rem 4rem"
    }}
    >
    <Button size="large" color="error" startIcon={<DeleteIcon/>} onClick={openConfirmDeleteHandler}>Delete Group</Button>
    <Button size="large" variant="contained" startIcon={<AddIcon/>} onClick={openAddMemberHandler}>Add Member</Button>
    </Stack>
  );

  return (
    <Grid container height="100vh">
    <Grid item sm={4} sx={{
      display: {
        xs: "none",
          sm: "block"
      }
    }}
    >
    <GroupsList myGroups={sampleChats} chatId={chatId}/>
    </Grid>

    <Grid xs={12} sm={8} sx={{
      display: "flex",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        padding: "1rem 3rem"
    }}>
    {IconBtns}
    {
      groupName && <>
        {GroupName}

        <Typography margin="2rem" alignSelf="flex-start" variant="body1">Members</Typography>

        <Stack
      maxWidth="45rem"
      width="100%"
      boxSizing="border-box"
      padding={{
        xs: "0",
          sm: "1rem",
          md: "1rem 4rem"
      }}
      spacing="2rem"
      height="50vh"
      overflow="auto"
        >
        {
          sampleUsers.map((i) => (
            <UserItem key={i._id} user={i} isAdded styling={{
              boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                padding: "1rem 2rem",
                borderRadius: "1rem"
            }} handler={removeMemberHandler}/>
          )) 
        }
        </Stack>

        {ButtonGroup}
        </>
    }
    </Grid>

    {
      isAddMember && (
        <Suspense fallback={<Backdrop open/>}>
        <AddMemberDialog/>
        </Suspense>
      )
    }

    {
      confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open/>}>
          <ConfirmDeleteDialog open={confirmDeleteDialog} handleClose={closeConfirmDeleteHandler} deleteHandler={deleteHandler}/>
        </Suspense>
      )
    }

    <Drawer sx={{
      display: {
        xs: "block",
          sm: "none"
      }
    }} open={isMobileMenuOpen} onClose={handleMobileClose}>
    <GroupsList w="70vw" myGroups={sampleChats} chatId={chatId}/>
    </Drawer>
    </Grid>
  );
}

const GroupsList = ({ w="100%", myGroups=[], chatId }) => (
  <Stack width={w} sx={{
      height: "100%",
      overflow: "auto"
  }}>
  {
    myGroups.length > 0 ?  myGroups.map((group) => <GroupsListItem key={group._id} group={group} chatId={chatId}/>) : <Typography textAlign="center" padding="1rem">No groups</Typography>
  }
  </Stack>
);

const GroupsListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;

  return (
    <Link to={`?group=${_id}`} onClick={
      (e) => {
        if(chatId === _id) e.preventDefault();
      }
    }>
    <Stack direction="row" spacing="1rem" alignItems="center">
    <AvatarCard avatar={avatar}/>
    <Typography>{name}</Typography>
    </Stack>
    </Link>
  );
});

export default Groups;
