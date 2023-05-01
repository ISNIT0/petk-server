import { Test, TestingModule } from '@nestjs/testing';
import { InferenceRatingService } from './inference-rating.service';

describe('InferenceRatingService', () => {
  let service: InferenceRatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InferenceRatingService],
    }).compile();

    service = module.get<InferenceRatingService>(InferenceRatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
