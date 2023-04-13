import { Test, TestingModule } from '@nestjs/testing';
import { InferenceSentinelController } from './inference-sentinel.controller';

describe('InferenceSentinelController', () => {
  let controller: InferenceSentinelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InferenceSentinelController],
    }).compile();

    controller = module.get<InferenceSentinelController>(InferenceSentinelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
