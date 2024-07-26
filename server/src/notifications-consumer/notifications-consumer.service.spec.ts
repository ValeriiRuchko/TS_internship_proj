import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsConsumerService } from './notifications-consumer.service';

describe('NotificationsConsumerService', () => {
  let service: NotificationsConsumerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsConsumerService],
    }).compile();

    service = module.get<NotificationsConsumerService>(NotificationsConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
