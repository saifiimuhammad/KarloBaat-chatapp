

export const sampleChats = [
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "John Doe",
    _id: "1",
    groupChat: false,
    members: ["1", "2"],
  },
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "Muhammad Saif",
    _id: "2",
    groupChat: false,
    members: ["1", "2"],
  },
]

export const sampleUsers = [
  {
    avatar: "https://www.w3schools.com/howto/img_avatar.png",
    name: "John Doe",
    _id: "15"
  },
  {
    avatar: "https://www.w3schools.com/howto/img_avatar.png",
    name: "Muhammad Saif",
    _id: "16"
  },
]


export const sampleNotifications = [
  {
    sender: {
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      name: "John Doe"
    },
    _id: "1"
  },
  {
    sender: {
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      name: "Muhammad Saif"
    },
    _id: "2"
  }
]   


export const sampleMessage = [
  {
    attachments: [],
    content: "L'uda ka Message hai",
    _id: "sfnsdjkfsdnfkjsbnd",
    sender: {
      _id: "user._id",
      name: "Chaman"
    },
    chat: "chatId",
    createdAt: "2024-02-12T10:41:30.6302",
  },
  {
    attachments: [
      {
        public_id: "asdsad 2",
        url: "https://www.w3schools.com/howto/img_avatar.png",
      },
    ],
    content: "",
    _id: "sfnsdjkfsdxfjxjdjnfkjsbnd",
    sender: {
      _id: "fdfdfdfd",
      name: "Chaman 2",
    },
    chat: "chatId",
    createdAt: "2024-02-12T10:41:30.6302",
  },
];





export const dashboardData = {
  users: [
    {
      name: "John Doe",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      _id: "1",
      username: "johndoe",
      friends: 50,
      groups: 3,
    },
    {
      name: "Jane Smith",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      _id: "2",
      username: "janesmith",
      friends: 42,
      groups: 2,
    },
    {
      name: "Mike Johnson",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      _id: "3",
      username: "mikejohnson",
      friends: 60,
      groups: 5,
    },
  ],
  chats: [
  {
    name: "Study Group",
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    _id: "1",
    groupChat: true,
    members: [
      { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
      { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
      { _id: "3", avatar: "https://www.w3schools.com/howto/img_avatar.png" }
    ],
    totalMessages: 150,
    creator: {
      name: "Muhammad Saif",
      avatar: "https://www.w3schools.com/howto/img_avatar.png"
    }
  },
  {
    name: "Project Discussion",
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    _id: "2",
    groupChat: true,
    members: [
      { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
      { _id: "4", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
      { _id: "5", avatar: "https://www.w3schools.com/howto/img_avatar.png" }
    ],
    totalMessages: 220,
    creator: {
      name: "Ayesha Bano",
      avatar: "https://www.w3schools.com/howto/img_avatar.png"
    }
  },
  {
    name: "Friends Chat",
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    _id: "3",
    groupChat: true,
    members: [
      { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
      { _id: "6", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
      { _id: "7", avatar: "https://www.w3schools.com/howto/img_avatar.png" }
    ],
    totalMessages: 85,
    creator: {
      name: "Bilal Ahmad",
      avatar: "https://www.w3schools.com/howto/img_avatar.png"
    }
  }
],
  messages: [
  {
    attachments: [
      {
        public_id: "attachment1_id",
        url: "https://www.w3schools.com/howto/img_avatar.png"
      }
    ],
    content: "Hello! Here's the message content.",
    _id: "message1_id",
    sender: {
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      name: "John Doe"
    },
    chat: "chatId123",
    groupChat: false,
    createdAt: "2024-11-07T10:15:00Z"
  },
  {
    attachments: [],
    content: "This is another message without attachments.",
    _id: "message2_id",
    sender: {
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      name: "Jane Smith"
    },
    chat: "chatId123",
    groupChat: true,
    createdAt: "2024-11-07T10:16:00Z"
  }
],
  };
