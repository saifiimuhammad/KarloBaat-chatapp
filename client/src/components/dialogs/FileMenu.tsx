import React, { type ChangeEvent } from "react";
import { Image, Mic, Video, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useSendAttachmentsMutation } from "../../redux/api/api";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc";

/* ---------------- types ---------------- */

interface FileMenuProps {
  anchorEl: HTMLElement | null;
  chatId: string;
}

type RootState = {
  misc: {
    isFileMenu: boolean;
  };
};

/* ---------------- component ---------------- */

const FileMenu: React.FC<FileMenuProps> = ({ anchorEl, chatId }) => {
  const { isFileMenu } = useSelector((state: RootState) => state.misc);
  const dispatch = useDispatch();

  const [sendAttachments] = useSendAttachmentsMutation();

  const closeHandler = () => {
    dispatch(setIsFileMenu(false));
  };

  const fileChangeHandler = async (
    e: ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
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

      const res: any = await sendAttachments(formData);

      if (res?.data) {
        toast.success(`${key} sent successfully`, { id: toastId });
      } else {
        toast.error(`Couldn't send ${key}`, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.message || "Upload failed", { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  if (!isFileMenu || !anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();

  return (
    <div
      className="fixed z-50"
      style={{
        top: rect.top - 220,
        left: rect.left,
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-48 p-2 space-y-1">
        {/* Image */}
        <label className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-accent">
          <Image size={18} className="text-primary" />
          <span className="text-sm text-text">Image</span>
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg, image/gif"
            hidden
            onChange={(e) => fileChangeHandler(e, "Images")}
          />
        </label>

        {/* Audio */}
        <label className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-accent">
          <Mic size={18} className="text-primary" />
          <span className="text-sm text-text">Audio</span>
          <input
            type="file"
            multiple
            accept="audio/mpeg, audio/wav, audio/ogg"
            hidden
            onChange={(e) => fileChangeHandler(e, "Audios")}
          />
        </label>

        {/* Video */}
        <label className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-accent">
          <Video size={18} className="text-primary" />
          <span className="text-sm text-text">Video</span>
          <input
            type="file"
            multiple
            accept="video/mp4, video/webm, video/ogg"
            hidden
            onChange={(e) => fileChangeHandler(e, "Videos")}
          />
        </label>

        {/* Document */}
        <label className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-accent">
          <FileText size={18} className="text-primary" />
          <span className="text-sm text-text">Document</span>
          <input
            type="file"
            multiple
            accept="*"
            hidden
            onChange={(e) => fileChangeHandler(e, "Files")}
          />
        </label>
      </div>
    </div>
  );
};

export default FileMenu;
