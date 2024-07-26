// @/src/db/seeding/factories/user.factory.ts
import { setSeederFactory } from 'typeorm-extension';
import { User } from 'src/users/entities/users.entity';
import { genSalt, hash } from 'bcrypt';

export const UserFactory = setSeederFactory(User, async (faker) => {
  const user = new User();
  user.name = faker.person.firstName();
  user.surname = faker.person.lastName();
  user.email = 'maxcaulfield710@gmail.com';
  user.isPremium = false;
  const salt = await genSalt();
  const pass = '1234f';
  user.password = await hash(pass, salt);
  user.salt = salt;
  return user;
});
