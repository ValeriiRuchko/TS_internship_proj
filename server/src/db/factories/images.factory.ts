import { setSeederFactory } from 'typeorm-extension';
import { Image } from '../../images/entities/image.entity';

export const ImagesFactory = setSeederFactory(Image, (faker) => {
  const image = new Image();
  image.pathToImage = faker.image.url();
  return image;
});
