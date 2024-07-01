import { Test, TestingModule } from '@nestjs/testing';
import { NotificationTimesService } from './notification_times.service';

describe('NotificationTimesService', () => {
  let service: NotificationTimesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationTimesService],
    }).compile();

    service = module.get<NotificationTimesService>(NotificationTimesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
