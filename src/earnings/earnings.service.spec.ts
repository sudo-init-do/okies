import { Test, TestingModule } from '@nestjs/testing';
import { EarningsService } from './earnings.service';

describe('EarningsService', () => {
  let service: EarningsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EarningsService],
    }).compile();

    service = module.get<EarningsService>(EarningsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
