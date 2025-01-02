import {
  CalendarMonth as CalenderIcon,
  Face as FaceIcon,
  AlternateEmail as UsernameIcon,
} from "@mui/icons-material";
import { Avatar, Stack, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import { transformImage } from "../../lib/features.js";

const Profile = ({ user }) => {
  return (
    <Stack spacing="2rem" direction="column" alignItems="center">
      <Avatar
        src={transformImage(user?.avatar?.url)}
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />
      <ProfileCard heading="Bio" text={user?.bio} />
      <ProfileCard
        heading="Username"
        text={user?.username}
        Icon={<UsernameIcon />}
      />
      <ProfileCard heading="Name" text={user?.name} Icon={<FaceIcon />} />
      <ProfileCard
        heading="Joined"
        text={moment(user?.createdAt).fromNow()}
        Icon={<CalenderIcon />}
      />
    </Stack>
  );
};

const ProfileCard = ({ text, Icon, heading }) => {
  return (
    <Stack
      direction="row"
      spacing="1rem"
      alignItems="center"
      color="white"
      textAlign="center"
    >
      {Icon && Icon}
      <Stack>
        <Typography variant="body1">{text}</Typography>
        <Typography variant="caption" color="gray">
          {heading}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Profile;
