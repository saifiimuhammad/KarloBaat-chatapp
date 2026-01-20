import { User } from "../models/user.js";
import { Chat } from "../models/chat.js";
import { faker, simpleFaker } from "@faker-js/faker";
import { Message } from "../models/message.js";

const createSingleChats = async (numChats) => {
  try {
    const users = await User.find().select("_id");
    const chatsPromise = [];

    let count = 0;
    for (let i = 0; i < users.length && count < numChats; i++) {
      for (let j = i + 1; j < users.length && count < numChats; j++) {
        chatsPromise.push(
          Chat.create({
            name: faker.lorem.words(2),
            members: [users[i]._id, users[j]._id],
          })
        );
        count++;
      }
    }

    await Promise.all(chatsPromise);

    console.log("Chats created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createGroupChats = async (numChats) => {
  try {
    const users = await User.find().select("_id");
    const chatsPromise = [];

    for (let i = 0; i < numChats; i++) {
      const numMembers = simpleFaker.number.int({ min: 3, max: users.length });
      const members = [];

      for (let j = 0; j < numMembers; j++) {
        const randomIndex = Math.floor(Math.random() * users.length);
        const randomUser = users[randomIndex];

        // Ensuring that the same user is not added twice
        if (!members.includes(randomUser)) {
          members.push(randomUser);
        }
      }

      const chat = Chat.create({
        groupChat: true,
        name: faker.lorem.words(1),
        members,
        creator: members[0]._id,
      });
      chatsPromise.push(chat);
    }

    await Promise.all(chatsPromise);

    console.log("Group chats created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createMessages = async (numMessages) => {
  try {
    const chats = await Chat.find().select("_id");
    const users = await User.find().select("_id");

    const messagesPromise = [];

    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomChat = chats[Math.floor(Math.random() * chats.length)];

      messagesPromise.push(
        Message.create({
          chat: randomChat._id,
          sender: randomUser._id,
          content: faker.lorem.sentence(),
        })
      );
    }

    await Promise.all(messagesPromise);

    console.log("Messages created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createMessagesInAChat = async (chatId, numMessages) => {
  try {
    const chat = await Chat.findById(chatId).select("_id");
    const users = await User.find().select("_id");

    if (!chat) {
      console.error("Chat not found");
      process.exit(1);
    }

    const messagesPromise = [];

    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      messagesPromise.push(
        Message.create({
          chat: chat._id,
          sender: randomUser._id,
          content: faker.lorem.sentence(),
        })
      );
    }

    await Promise.all(messagesPromise);

    console.log(`Messages created successfully in chat ${chatId}`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export {
  createSingleChats,
  createGroupChats,
  createMessages,
  createMessagesInAChat,
};
