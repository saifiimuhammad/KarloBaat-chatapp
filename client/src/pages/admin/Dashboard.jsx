


import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import {
  Container,
  Paper,
  Stack,
  Typography,
  Box
} from '@mui/material';
import { 
  AdminPanelSettings as AdminPanelSettingsIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import moment from 'moment';
import { SearchField, CurveButton } from '../../components/styles/StyledComponents.jsx';
import { matteBlack } from '../../constants/colors.js';
import { LineChart, DoughnutChart } from '../../components/specific/Charts.jsx';



const Dashboard = () => {

  const Appbar = <Paper elevation={3} sx={{
    padding: "2rem",
      margin: "2rem 0",
      borderRadius: "1rem"
  }}>
    <Stack direction="row" alignItems="center" spacing="1rem">
    <AdminPanelSettingsIcon sx={{ fontSize: "3rem" }}/>
    <SearchField placeholder="Search..."/>
    <CurveButton><SearchIcon/></CurveButton>
    <Box flexGrow={1}/>
    <Typography 
  display={{
    xs: "none",
      lg: "block"
  }} 
  color="rgba(0,0,0,0.7)" 
  textAlign="center">
    {moment().format("dddd, D MMMM YYYY")}
    </Typography>
    <NotificationsIcon sx={{
      position: {
        xs: "fixed",
          sm: "initial"
      },
        right: "4rem",
        top: "1.5rem",
        zIndex: 1000
    }}/>
    </Stack>
    </Paper>

    const Widgets = (
      <Stack
      direction={{
      xs: "column",
        sm: "row"
    }}
      spacing="2rem"
      justifyContent="space-between"
      alignItems="center"
      margin="2rem 0"
      >
  <Widget title="Users" value={33} Icon={<PersonIcon/>}/>
      <Widget title="Chats" value={5} Icon={<GroupIcon/>}/>
      <Widget title="Messages" value={678} Icon={<MessageIcon/>}/>
    </Stack>
    );

    return (
      <AdminLayout>
      <Container component="main" sx={{
        paddingTop: {
          xs: "2.35rem",
            sm: 0
        }
      }}>
      {Appbar}
      
      <Stack direction={{
        xs: "column",
          lg: "row"
      }} flexWrap="wrap" justifyContent="center" alignItems={{
        xs: "center",
          lg: "stretch"
      }} sx={{
        gap: "2rem"
      }}>
      <Paper
      elevation={3}
      sx={{
        padding: "2rem 3.5rem",
          borderRadius: "1rem",
          width: "100%",
          maxWidth: "45rem",
      }}
      >
      <Typography margin="2rem 0" variant="h4">
      {" "}
      Last Messages
      </Typography>
      <LineChart value={[0,2,3,7,4,9,8]}/>
      </Paper>

      <Paper
      elevation={3}
      sx={{
        padding: "1rem",
          borderRadius: "1rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: {
            xs: "100%",
              sm: "50%"
          },
          position: "relative",
          maxWidth: "25rem",
      }}
      >
      <DoughnutChart value={[23,66]} labels={["Single Chat", "Group Chats"]} />

      <Stack
      position="absolute"
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing="0.5rem"
      width="100%"
      height="100%"
      >
      <GroupIcon/> 
      <Typography>VS</Typography>
      <PersonIcon/>
      </Stack>
      </Paper>
      </Stack>

      {Widgets}
      </Container>
      </AdminLayout>
    );
}

const Widget = ({ title, value, Icon }) => {
  return (
    <Paper
    elevation={3}
    sx={{
      padding: "2rem",
        margin: "2rem 0",
        borderRadius: "1.5rem",
        width: "20rem"
    }}>
    <Stack alignItems="center" spacing="1rem">
    <Typography sx={{
      color: "rgba(0,0,0,0.7)",
        borderRadius: "50%",
        border:`5px solid ${matteBlack}`,
        width: "5rem",
        height: "5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }}>{value}</Typography>
    <Stack direction="row" spacing="1rem" alignItems="center">
    {Icon}
    <Typography>{title}</Typography>
    </Stack>
    </Stack>
    </Paper>
  );
}

export default Dashboard;
