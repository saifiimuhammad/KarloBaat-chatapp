

import React, { memo } from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { Link } from '../styles/StyledComponents.jsx';
import AvatarCard from './AvatarCard.jsx';

const ChatItem = ({
  avatar=[],
  name,
  _id,
  groupChat=false,
  sameSender,
  isOnline,
  newMessageAlert,
  index=0,
  handleDeleteChat
}) => {
  return (
    <Link to={`/chat/${_id}`} onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)} sx={{
      padding: 0
    }}>
    <div style={{
      display: "flex",
        gap: "1rem",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: sameSender ? "black" : "unset",
        color: sameSender ? "white" : "unset",
        position: "relative",
    }}>


    <AvatarCard avatar={avatar} />

    <Stack>
    <Typography >{name}</Typography>
    {
      newMessageAlert && <Typography>
      {newMessageAlert.count} New Messages
      </Typography>
    }
    </Stack>

    {
      isOnline && <Box sx={{
        width: "10px",
        height: "10px",
          borderRadius: "50%",
          backgroundColor: "green",
          position: "absolute",
          top: "50%",
          right: "1rem",
          transform: "translateY(-50%)",
      }}/>
    }
    </div>
    </Link>
  );
}

export default memo(ChatItem);
