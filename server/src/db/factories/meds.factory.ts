
import { setSeederFactory } from 'typeorm-extension';
import { Med } from '../../meds/entities/meds.entity';

export const MedsFactory = setSeederFactory(Med, (faker) => {
  const med = new Med();
  med.name = faker.lorem.word();
  med.description = faker.lorem.lines({ min: 1, max: 5 });
  med.pillsAmount = faker.number.int({ min: 10, max: 40 });
  med.expirationDate = faker.date.future({ years: 3 });
  return med;
});
