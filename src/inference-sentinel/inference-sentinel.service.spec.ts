import { Test, TestingModule } from '@nestjs/testing';
import { InferenceSentinelService } from './inference-sentinel.service';

describe('InferenceSentinelService', () => {
  let service: InferenceSentinelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InferenceSentinelService],
    }).compile();

    service = module.get<InferenceSentinelService>(InferenceSentinelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
