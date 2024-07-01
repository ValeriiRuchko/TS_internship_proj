import { Test, TestingModule } from '@nestjs/testing';
import { NotificationTimesController } from './notification_times.controller';
import { NotificationTimesService } from './notification_times.service';

describe('NotificationTimesController', () => {
  let controller: NotificationTimesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationTimesController],
      providers: [NotificationTimesService],
    }).compile();

    controller = module.get<NotificationTimesController>(NotificationTimesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
