import { Test, TestingModule } from '@nestjs/testing';
import { EarningsController } from './earnings.controller';

describe('EarningsController', () => {
  let controller: EarningsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EarningsController],
    }).compile();

    controller = module.get<EarningsController>(EarningsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
