

import React, { memo } from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const ChatItem = ({
  avatar=[],
  name,
  _id,
  groupChat=false,
  sameSender,
  isOnline,
  newMessageAlert,
  index=0,
  handleDeleteChatOpen
}) => {
  return (
    <Link to={`/chat/${_id}`} onContextMenu={(e) => handleDeleteChatOpen(e, _id, groupChat)} sx={{
      padding: "0"
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


    {/* Avatar */}

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
        backgroundColor: "red"
      }}/>
    }
    </div>
    </Link>
  );
}

export default memo(ChatItem);
