import {
  MicOutlined as AudioIcon,
  Image as ImageIcon,
  UploadFile as UploadFileIcon,
  VideoCameraFront as VideoIcon,
} from "@mui/icons-material";
import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useSendAttachmentsMutation } from "../../redux/api/api";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc";

const FileMenu = ({ anchorE1, chatId }) => {
  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const [sendAttachments] = useSendAttachmentsMutation();

  const closeHandler = () => {
    dispatch(setIsFileMenu(false));
  };

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);
    if (files.length <= 0) return;
    if (files.length > 5) return toast.error(`Only 5 ${key} allowed at a time`);

    dispatch(setUploadingLoader(true));

    const toastId = toast.loading(`Sending ${key}...`);

    closeHandler();

    try {
      const formData = new FormData();
      formData.append("chatId", chatId);
      files.forEach((file) => {
        formData.append("files", file);
      });
      const res = await sendAttachments(formData);

      if (res.data) toast.success(`${key} sent successfully`, { id: toastId });
      else toast.error(`Couldn't send ${key}`, { id: toastId });
    } catch (error) {
      toast.error(error, { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  return (
    <Menu anchorEl={anchorE1} open={isFileMenu} onClose={closeHandler}>
      <div
        style={{
          width: "10rem",
        }}
      >
        <MenuList>
          <MenuItem>
            <Tooltip title="Image">
              <ImageIcon />
            </Tooltip>
            <ListItemText sx={{ marginLeft: "0.5rem" }}>Image</ListItemText>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/gif"
              style={{
                opacity: 0,
                position: "absolute",
                width: "100%",
                height: "100%",
                cursor: "pointer",
              }}
              onChange={(e) => fileChangeHandler(e, "Images")}
            />
          </MenuItem>

          <MenuItem>
            <Tooltip title="Audio">
              <AudioIcon />
            </Tooltip>
            <ListItemText sx={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
            <input
              type="file"
              multiple
              accept="audio/mpeg, audio/wav, audio/ogg"
              style={{
                opacity: 0,
                position: "absolute",
                width: "100%",
                height: "100%",
                cursor: "pointer",
              }}
              onChange={(e) => fileChangeHandler(e, "Audios")}
            />
          </MenuItem>

          <MenuItem>
            <Tooltip title="Video">
              <VideoIcon />
            </Tooltip>
            <ListItemText sx={{ marginLeft: "0.5rem" }}>Video</ListItemText>
            <input
              type="file"
              multiple
              accept="video/mp4, video/webm, video/ogg"
              style={{
                opacity: 0,
                position: "absolute",
                width: "100%",
                height: "100%",
                cursor: "pointer",
              }}
              onChange={(e) => fileChangeHandler(e, "Videos")}
            />
          </MenuItem>

          <MenuItem>
            <Tooltip title="File">
              <UploadFileIcon />
            </Tooltip>
            <ListItemText sx={{ marginLeft: "0.5rem" }}>Document</ListItemText>
            <input
              type="file"
              multiple
              accept="*"
              style={{
                opacity: 0,
                position: "absolute",
                width: "100%",
                height: "100%",
                cursor: "pointer",
              }}
              onChange={(e) => fileChangeHandler(e, "Files")}
            />
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  );
};

export default FileMenu;
