import React, { useRef } from 'react';
import AppLayout from '../components/layout/AppLayout.jsx';
import { Stack, IconButton } from '@mui/material';
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';

import { InputBox } from '../components/styles/StyledComponents.jsx';
import { grayColor, orange } from '../constants/colors.js';

import FileMenu from '../components/dialogs/FileMenu.jsx';
import { sampleMessage } from '../constants/sampleData.js';
import MessageComponent from '../components/shared/MessageComponent.jsx'


const user = {
  _id: "fdfdfdfd",
  name: "Muhammad Saif"
}

const Chat = () => {

  const containerRef = useRef(null);

  return (
    <>
    <Stack 
    ref={containerRef} 
    boxSizing="border-box"
    padding="1rem"
    spacing="1rem"
    bgcolor={grayColor}
    height="90%"
    sx={{
      overflowX: "hidden",
        overflowY: "auto"
    }}
    >
    
    {
      sampleMessage.map((i) => {
        return (
          <MessageComponent key={i._id} message={i} user={user}/>
        );
      })
    }


    </Stack>

    <form style={{
      height: "10%"
    }}>
    <Stack direction="row" height="100%" padding="1rem" alignItems="center" position="relative">

    <IconButton sx={{
      position: "absolute",
        left: "1.5rem",
        rotate: "30deg"
    }}
    >
    <AttachFileIcon/>
    </IconButton>

    <InputBox placeholder="Type message here..."/>

    <IconButton type="submit" sx={{
      bgcolor: orange,
        marginLeft: "1rem",
        padding: "0.5rem",
        "&:hover": {
          bgcolor: "error.dark"
        },
        rotate: "-30deg"
    }}>
    <SendIcon/>
    </IconButton>
    </Stack>
    </form>

    <FileMenu/>

    </>
  );
}

export default AppLayout()(Chat);
