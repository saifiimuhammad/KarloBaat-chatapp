


import React from 'react';
import { Stack, Avatar, Typography } from '@mui/material';
import { Face as FaceIcon, AlternateEmail as UsernameIcon, CalendarMonth as CalenderIcon } from '@mui/icons-material';
import moment from 'moment';

const Profile = () => {
return (

  <Stack spacing="2rem" direction="column" alignItems="center">
  <Avatar sx={{
    width: 200,
      height: 200,
      objectFit: "contain",
      marginBottom: "1rem",
      border: "5px solid white"
  }}/>
    <ProfileCard heading="Bio" text="My name is Saif"/>
    <ProfileCard heading="Username" text="_saifff_mohd_" Icon={<UsernameIcon/>}/>
    <ProfileCard heading="Name" text="Muhammad Saif" Icon={<FaceIcon/>}/>
    <ProfileCard heading="Joined" text={moment("2024-10-31T10:23:42.675Z").fromNow()} Icon={<CalenderIcon/>}/>
  </Stack>
);
}

const ProfileCard = ({ text, Icon, heading }) => {
  return (
    <Stack direction="row" spacing="1rem" alignItems="center" color="white" textAlign="center">
    { Icon && Icon }
    <Stack>
      <Typography variant="body1">{text}</Typography>
    <Typography variant="caption" color="gray">{heading}</Typography>
    </Stack>
    </Stack>
  );
}

export default Profile;
