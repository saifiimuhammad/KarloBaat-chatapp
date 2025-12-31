import moment from "moment";

type FileType = "video" | "audio" | "image" | "file";

const fileFormat = (url: string = ""): FileType => {
  const fileExt = url.split(".").pop()?.toLowerCase();

  if (!fileExt) return "file";

  if (["mp4", "webm", "ogg"].includes(fileExt)) return "video";
  if (["mp3", "wav"].includes(fileExt)) return "audio";
  if (["png", "jpg", "jpeg", "gif"].includes(fileExt)) return "image";

  return "file";
};

const transformImage = (url: string = "", width: number = 100): string => {
  if (!url) return "";

  return url.replace("upload/", `upload/dpr_auto/w_${width}/`);
};

const getLast7Days = (): string[] => {
  const currentDate = moment();
  const last7Days: string[] = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    last7Days.unshift(dayDate.format("dddd"));
  }

  return last7Days;
};

interface StorageOptions<T> {
  key: string;
  value?: T;
  get?: boolean;
}

const getorSaveFromStorage = <T>({
  key,
  value,
  get,
}: StorageOptions<T>): T | null | void => {
  if (get) {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : null;
  }

  localStorage.setItem(key, JSON.stringify(value));
};

export { fileFormat, transformImage, getLast7Days, getorSaveFromStorage };
