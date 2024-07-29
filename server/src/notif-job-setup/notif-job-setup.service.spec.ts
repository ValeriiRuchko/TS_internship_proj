import { Test, TestingModule } from '@nestjs/testing';
import { NotifJobSetupService } from './notif-job-setup.service';

describe('NotifJobSetupService', () => {
  let service: NotifJobSetupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotifJobSetupService],
    }).compile();

    service = module.get<NotifJobSetupService>(NotifJobSetupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
