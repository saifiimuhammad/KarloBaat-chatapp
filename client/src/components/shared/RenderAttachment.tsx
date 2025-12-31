import { type ReactNode } from "react";
import { FileText } from "lucide-react";
import { transformImage } from "../../lib/features";

type FileType = "video" | "image" | "audio" | "file";

const RenderAttachment = (file: FileType, url: string): ReactNode => {
  switch (file) {
    case "video":
      return (
        <video src={url} preload="none" controls className="w-50">
          <track kind="captions" />
        </video>
      );

    case "image":
      return (
        <img
          src={transformImage(url, 200)}
          alt="attachment"
          className="max-w-25 h-auto object-contain"
        />
      );

    case "audio":
      return (
        <audio src={url} preload="none" controls>
          <track kind="captions" />
        </audio>
      );

    default:
      return <FileText className="w-8 h-8 text-text-light" />;
  }
};

export default RenderAttachment;
