import { v4 as uuidv4 } from "uuid";

type ChatType = {
  id: string;
  avatar: string | string[];
  name: string;
  isGroupChat: boolean;
  totalMembers: number;
  members: string[];
  admin?: {
    avatar: string;
    name: string;
  };
  createdAt: string;
};

const names = [
  "Alex",
  "Sarah",
  "John",
  "Emily",
  "Daniel",
  "Sophia",
  "Michael",
  "Ava",
  "Chris",
  "Olivia",
  "Ryan",
  "Noah",
  "Emma",
  "Liam",
  "Mason",
  "Isabella",
  "Ethan",
  "Mia",
];

const surnames = [
  "Smith",
  "Johnson",
  "Brown",
  "Williams",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Wilson",
  "Taylor",
];

const groupNames = [
  "Frontend Devs",
  "Startup Team",
  "Marketing Squad",
  "Design Hub",
  "College Friends",
  "Family Group",
  "Project Alpha",
  "Crypto Bros",
  "Gym Buddies",
  "Weekend Plan",
];

const randomName = () =>
  `${names[Math.floor(Math.random() * names.length)]} ${
    surnames[Math.floor(Math.random() * surnames.length)]
  }`;

const randomAvatar = () =>
  `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`;

const randomDate = () => {
  const start = new Date(2022, 0, 1).getTime();
  const end = Date.now();
  return new Date(start + Math.random() * (end - start)).toISOString();
};

const randomMembers = (count: number) =>
  Array.from({ length: count }, () => uuidv4());

const chatsData: ChatType[] = Array.from({ length: 500 }, () => {
  const isGroupChat = Math.random() < 0.35; // ~35% groups

  if (isGroupChat) {
    const membersCount = Math.floor(Math.random() * 15) + 3;

    return {
      id: uuidv4(),
      isGroupChat: true,
      name: groupNames[Math.floor(Math.random() * groupNames.length)]!,
      totalMembers: membersCount,
      members: randomMembers(membersCount),
      avatar: Array.from({ length: Math.min(4, membersCount) }, randomAvatar),
      admin: {
        name: randomName(),
        avatar: randomAvatar(),
      },
      createdAt: randomDate(),
    };
  }

  // 1-to-1 chat
  const userName = randomName();

  return {
    id: uuidv4(),
    isGroupChat: false,
    name: userName,
    totalMembers: 2,
    members: randomMembers(2),
    avatar: randomAvatar(),
    createdAt: randomDate(),
  };
});

export default chatsData;
