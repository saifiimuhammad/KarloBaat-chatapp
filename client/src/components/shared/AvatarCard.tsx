import React from "react";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { transformImage } from "../../lib/features";

interface AvatarCardProps {
  avatar?: string[];
  max?: number;
  unreadCount?: number;
}

const AvatarCard: React.FC<AvatarCardProps> = ({
  avatar = [],
  max = 4,
  unreadCount = 0,
}) => {
  const avatarSize = 48;
  const overlap = 16;
  const badgeSize = 20;

  const visibleAvatars = avatar.slice(0, max);
  const lastIndex = visibleAvatars.length - 1;

  const width =
    visibleAvatars.length > 1
      ? avatarSize + (visibleAvatars.length - 1) * (avatarSize - overlap)
      : avatarSize;

  return (
    <Stack direction="row">
      <Box width={`${width}px`} height={`${avatarSize}px`} position="relative">
        {visibleAvatars.map((img, index) => {
          const left = index * (avatarSize - overlap);

          return (
            <Box key={index} position="absolute" left={`${left}px`} top={0}>
              {/* Avatar */}
              <Avatar
                src={transformImage(img)}
                sx={{
                  width: avatarSize,
                  height: avatarSize,
                  border: "2px solid white",
                  bgcolor: "background.paper",
                }}
              />

              {/* 🔥 Custom Badge on LAST avatar */}
              {index === lastIndex && unreadCount > 0 && (
                <Box
                  position="absolute"
                  top={-4}
                  right={-4}
                  width={badgeSize}
                  height={badgeSize}
                  bgcolor="#22c55e" // green
                  borderRadius="50%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border="2px solid white"
                >
                  <Typography
                    fontSize="11px"
                    fontWeight={600}
                    color="white"
                    lineHeight={1}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Stack>
  );
};

export default AvatarCard;
