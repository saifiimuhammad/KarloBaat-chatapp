import { User } from "../models/user.js";
import { faker } from "@faker-js/faker";
const createUser = async (numOfUsers = 10) => {
    try {
        const users = [];
        for (let i = 0; i < numOfUsers; i++) {
            users.push({
                name: faker.person.fullName(),
                username: faker.internet.userName() +
                    faker.number.int({ min: 1000, max: 9999 }),
                email: faker.internet.email().toLowerCase(),
                bio: faker.lorem.sentence(),
                password: "password123",
                avatar: {
                    url: faker.image.avatar(),
                    public_id: faker.string.uuid(),
                },
                role: faker.helpers.arrayElement(["user", "admin"]),
            });
        }
        await User.insertMany(users);
        console.log(`✅ ${numOfUsers} users created`);
        process.exit(0); // SUCCESS
    }
    catch (error) {
        console.error("❌ Seeder error:", error);
        process.exit(1); // FAILURE
    }
};
export { createUser };
//# sourceMappingURL=user.js.map