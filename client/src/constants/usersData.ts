import { v4 as uuidv4 } from "uuid";

type UserDataType = {
  id: string;
  avatar: string;
  name: string;
  username: string;
  email: string;
  bio: string | undefined;
  createdAt: string;
  isBlocked: boolean;
};

const randomName = () => {
  const first = [
    "John",
    "Jane",
    "Alex",
    "Emily",
    "Chris",
    "Olivia",
    "Daniel",
    "Sophia",
    "Michael",
    "Ava",
  ];
  const last = [
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
  return `${first[Math.floor(Math.random() * first.length)]} ${
    last[Math.floor(Math.random() * last.length)]
  }`;
};

const randomUsername = (name: string) => {
  return (
    name.toLowerCase().replace(" ", "_") + Math.floor(Math.random() * 1000)
  );
};

const randomEmail = (username: string) => {
  const domains = ["example.com", "mail.com", "test.com", "demo.com"];
  return `${username}@${domains[Math.floor(Math.random() * domains.length)]}`;
};

const randomBio = () => {
  const bios = [
    "Love coding and coffee.",
    "Traveler and foodie.",
    "Fitness enthusiast.",
    "Passionate about technology.",
    "Music lover.",
    "Learning new things every day.",
    "Dreaming big.",
    "Explorer of life.",
    "Bookworm and writer.",
    "Just living the moment.",
  ];
  return bios[Math.floor(Math.random() * bios.length)];
};

const randomDate = () => {
  const start = new Date(2022, 0, 1).getTime();
  const end = Date.now();
  return new Date(start + Math.random() * (end - start)).toISOString();
};

const usersData: UserDataType[] = Array.from({ length: 100 }, () => {
  const name = randomName();
  const username = randomUsername(name);
  return {
    id: uuidv4(),
    avatar: `https://i.pravatar.cc/150?img=${
      Math.floor(Math.random() * 70) + 1
    }`,
    name,
    username,
    email: randomEmail(username),
    bio: randomBio(),
    createdAt: randomDate(),
    isBlocked: Math.random() < 0.2, // ~20% blocked
  };
});

export default usersData;
