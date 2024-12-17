import { User } from "../models/user.js";
import { faker } from "@faker-js/faker";

const createUser = async (numOfUsers) => {
  try {
    const usersPromise = [];

    for (let i = 0; i < numOfUsers; i++) {
      const tempUsers = User.create({
        name: faker.person.fullName(),
        username: faker.internet.username(),
        bio: faker.lorem.sentence(),
        password: "password",
        avatar: {
          url: faker.image.avatar(),
          public_id: faker.system.fileName(),
        },
      });
      usersPromise.push(tempUsers);
    }

    await Promise.all(usersPromise);
    console.log("Users created", numOfUsers);
    process.exit(1);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};


export { createUser };
