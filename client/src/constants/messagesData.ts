import { v4 as uuidv4 } from "uuid";

type MessageData = {
  id: string;
  sender: {
    name: string;
    avatar: string;
  };
  reciever: string;
  groupId?: string;
  content: string;
  attachments: string[];
  createdAt: string;
  isFlagged: boolean;
};

const names = [
  "Saif",
  "Ali",
  "Ahmed",
  "Usman",
  "Hamza",
  "Ayesha",
  "Fatima",
  "Zainab",
  "Hira",
  "Sara",
];

const messages = [
  "Hello, how are you?",
  "Did you check the update?",
  "Please review this ASAP.",
  "Meeting at 5 PM.",
  "This looks good to me.",
  "Can you fix this bug?",
  "I’ve pushed the changes.",
  "Let’s deploy tonight.",
  "Any updates on this?",
  "Thanks, received.",
];

const avatars = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5",
];

const randomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]!;

export const generateMockMessages = (count = 100): MessageData[] => {
  return Array.from({ length: count }, () => {
    const isGroup = Math.random() > 0.7;

    return {
      id: uuidv4(),
      sender: {
        name: randomItem(names),
        avatar: randomItem(avatars),
      },
      reciever: uuidv4(),
      ...(isGroup && { groupId: uuidv4() }),
      content: randomItem(messages),
      attachments:
        Math.random() > 0.8
          ? [`https://files.example.com/${uuidv4()}.pdf`]
          : [],
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 10_000_000_000)
      ).toISOString(),
      isFlagged: Math.random() > 0.9,
    };
  });
};

// usage
export const messagesData = generateMockMessages(120);
