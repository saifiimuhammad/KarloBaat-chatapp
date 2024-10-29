

import React from 'react';
import Header from './Header.jsx';
import Title from '../shared/Title.jsx';
import ChatList from '../specific/ChatList.jsx';
import { sampleChats } from '../../constants/sampleData.js';

import { Grid } from '@mui/material';



const AppLayout = () => (WrappedComponent) => {

  return (props) => {
    return (
      <>
      <Title/>
      <Header/>

      <Grid container height="calc(100vh - 4rem)">
      <Grid item sm={4} md={3} height="100%" sx={{
        display: { xs: "none", sm: "block" },
      }}>
      <ChatList
      chats={sampleChats} chatId={"1"}
      newMessagesAlert={[{
        chatId: "1",
        count: 4
      }]}
      onlineUsers={["1","2"]}
      />
      </Grid>
      <Grid item xs={12} sm={8} md={5} lg={6}  height="100%">
      <WrappedComponent {...props} />
      </Grid>
      <Grid item md={4} lg={3} height="100%" sx={{
        display: {xs: "none", md:"block"},
          padding: "2rem",
          bgcolor: "rgba(0,0,0,0.85)",
      }}>Third</Grid>
      </Grid>
      </>
    );
  };
}


export default AppLayout;
