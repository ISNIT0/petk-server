import { Test, TestingModule } from '@nestjs/testing';
import { ModelProviderService } from './model-provider.service';

describe('ModelProviderService', () => {
  let service: ModelProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelProviderService],
    }).compile();

    service = module.get<ModelProviderService>(ModelProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
