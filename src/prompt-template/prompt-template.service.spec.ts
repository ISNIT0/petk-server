import { Test, TestingModule } from '@nestjs/testing';
import { PromptTemplateService } from './prompt-template.service';

describe('PromptTemplateService', () => {
  let service: PromptTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromptTemplateService],
    }).compile();

    service = module.get<PromptTemplateService>(PromptTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
