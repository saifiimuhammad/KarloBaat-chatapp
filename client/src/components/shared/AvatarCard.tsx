import React from "react";
import { Avatar, AvatarGroup, Box, Stack } from "@mui/material";
import { transformImage } from "../../lib/features";

interface AvatarCardProps {
  avatar?: string[];
  max?: number;
}

const AvatarCard: React.FC<AvatarCardProps> = ({ avatar = [], max = 4 }) => {
  const avatarSize = 48; // 3rem in px
  const overlap = 16; // how much each avatar overlaps in px

  // Calculate dynamic width
  const width =
    avatar.length > 1
      ? avatarSize + (avatar.length - 1) * (avatarSize - overlap)
      : avatarSize;

  return (
    <Stack direction="row" spacing={0.5}>
      <AvatarGroup max={max} sx={{ position: "relative" }}>
        <Box
          width={`${width}px`}
          height={`${avatarSize}px`}
          position="relative"
        >
          {avatar.map((img, index) => (
            <Avatar
              key={index}
              src={transformImage(img)}
              alt={`Avatar ${index}`}
              sx={{
                width: `${avatarSize}px`,
                height: `${avatarSize}px`,
                position: "absolute",
                left: `${index * (avatarSize - overlap)}px`,
              }}
            />
          ))}
        </Box>
      </AvatarGroup>
    </Stack>
  );
};

export default AvatarCard;
