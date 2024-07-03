// @/src/db/seeding/factories/user.factory.ts
import { setSeederFactory } from 'typeorm-extension';
import { User } from 'src/users/entities/users.entity';
import { genSalt } from 'bcrypt';

export const UserFactory = setSeederFactory(User, async (faker) => {
  const user = new User();
  user.name = faker.person.firstName();
  user.surname = faker.person.lastName();
  user.email = faker.internet.email();
  user.isPremium = false;
  user.password = faker.internet.password();
  user.salt = await genSalt();
  return user;
});
