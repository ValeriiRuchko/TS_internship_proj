// @/src/db/seeding/factories/image.factory.ts
import { setSeederFactory } from 'typeorm-extension';
import { Image } from 'src/images/entities/image.entity';

export const ImagesFactory = setSeederFactory(Image, (faker) => {
  const image = new Image();
  image.pathToImage = faker.image.url();
  return image;
});
