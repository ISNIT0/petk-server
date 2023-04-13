import { Test, TestingModule } from '@nestjs/testing';
import { PiiDetectorService } from './pii-detector.service';

describe('PiiDetectorService', () => {
  let service: PiiDetectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PiiDetectorService],
    }).compile();

    service = module.get<PiiDetectorService>(PiiDetectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
