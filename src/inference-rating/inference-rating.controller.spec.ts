import { Test, TestingModule } from '@nestjs/testing';
import { InferenceRatingController } from './inference-rating.controller';

describe('InferenceRatingController', () => {
  let controller: InferenceRatingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InferenceRatingController],
    }).compile();

    controller = module.get<InferenceRatingController>(InferenceRatingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
