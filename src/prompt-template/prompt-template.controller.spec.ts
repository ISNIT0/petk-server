import { Test, TestingModule } from '@nestjs/testing';
import { PromptTemplateController } from './prompt-template.controller';

describe('PromptTemplateController', () => {
  let controller: PromptTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromptTemplateController],
    }).compile();

    controller = module.get<PromptTemplateController>(PromptTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
