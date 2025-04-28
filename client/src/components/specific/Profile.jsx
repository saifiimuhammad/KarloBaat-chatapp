import {
  CalendarMonth as CalenderIcon,
  Face as FaceIcon,
  AlternateEmail as UsernameIcon,
  InfoRounded as BioIcon,
} from "@mui/icons-material";
import { Avatar, Stack, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import { transformImage } from "../../lib/features.js";

const Profile = ({ user }) => {
  return (
    <Stack spacing="2rem" direction="column" alignItems="center" width={"100%"}>
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
      <Stack
        direction="column"
        spacing="1rem"
        alignItems="flex-start"
        justifyContent={"center"}
        color="white"
        width={"100%"}
        sx={{
          paddingTop: "1rem",
        }}
      >
        <ProfileCard heading="Name" text={user?.name} Icon={<FaceIcon />} />
        <hr className="line-divider" />
        <ProfileCard
          heading="Username"
          text={user?.username}
          Icon={<UsernameIcon />}
        />
        <hr className="line-divider" />
        <ProfileCard
          heading="Bio"
          text={user?.bio || "No bio"}
          Icon={<BioIcon />}
        />
        <hr className="line-divider" />
        <ProfileCard
          heading="Joined"
          text={moment(user?.createdAt).fromNow()}
          Icon={<CalenderIcon />}
        />
      </Stack>
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
      width={"100%"}
    >
      {Icon && Icon}
      <Stack
        direction="column"
        alignItems="flex-start"
        color="white"
        textAlign="center"
        width={"100%"}
      >
        <Typography variant="body1">{text}</Typography>
        <Typography variant="caption" color="gray">
          {heading}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Profile;
