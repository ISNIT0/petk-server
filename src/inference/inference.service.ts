import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Inference } from 'src/database/entity/Inference.entity';
import { PromptTemplateInstance } from 'src/database/entity/PromptTemplateInstance.entity';
import { Session } from 'src/database/entity/Session.entity';
import { ModelProviderService } from 'src/model-provider/model-provider.service';
import { ModelService } from 'src/model/model.service';
import { ProfileService } from 'src/profile/profile.service';
import { PromptTemplateService } from 'src/prompt-template/prompt-template.service';
import { IInferenceRequest } from 'src/session/session.service';
import { Repository } from 'typeorm';

@Injectable()
export class InferenceService {
  constructor(
    @Inject(forwardRef(() => ModelService))
    private modelService: ModelService,
    @Inject(forwardRef(() => PromptTemplateService))
    private promptTemplateService: PromptTemplateService,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Inference)
    private inferenceRepository: Repository<Inference>,
    private modelProvider: ModelProviderService,
    private profileService: ProfileService,
  ) {}

  async getInferenceParameters(
    authContext: IAuthenticatedContext,
    inferenceRequest: IInferenceRequest,
  ) {
    const [model, promptTemplate] = await Promise.all([
      this.modelService.getById(authContext, inferenceRequest.model),
      this.promptTemplateService.getById(
        authContext,
        inferenceRequest.promptTemplate,
      ),
    ]);
    return { model, promptTemplate };
  }

  async testInfer(
    authContext: IAuthenticatedContext,
    inferenceRequest: IInferenceRequest,
    templateInstance: PromptTemplateInstance,
    session: Session,
  ) {
    const [profile] = await Promise.all([
      this.profileService.getByAuthContext(authContext),
    ]);
    const model = await this.modelService.getById(
      authContext,
      inferenceRequest.model,
    );

    const ret = await this.modelProvider.infer(
      authContext,
      model,
      inferenceRequest,
      templateInstance,
      session,
    );

    const inference = new Inference();

    inference.model = model;
    // inference.previousInference; // TODO
    inference.profile = profile;
    inference.prompt = inferenceRequest.prompt;
    inference.promptTemplateInstance = templateInstance;
    inference.response = ret.response;
    inference.session = new Session();
    inference.type = inferenceRequest.type;

    return inference;
  }

  async infer(
    authContext: IAuthenticatedContext,
    inferenceRequest: IInferenceRequest,
    session: Session,
  ) {
    const [profile] = await Promise.all([
      this.profileService.getByAuthContext(authContext),
    ]);

    const { model, promptTemplate } = await this.getInferenceParameters(
      authContext,
      inferenceRequest,
    );

    const ret = await this.modelProvider.infer(
      authContext,
      model,
      inferenceRequest,
      promptTemplate,
      session,
    );

    let inference = new Inference();

    inference.model = model;
    // inference.previousInference; // TODO
    inference.profile = profile;
    inference.prompt = inferenceRequest.prompt;
    inference.promptTemplateInstance = promptTemplate;
    inference.response = ret.response;
    inference.session = session;
    inference.type = inferenceRequest.type;

    inference = await this.inferenceRepository.save(inference);

    await this.sessionRepository.update(session.id, {
      description: inference.response,
    });

    return inference;
  }

  async getPrompt(
    authContext: IAuthenticatedContext,
    inferenceRequest: IInferenceRequest,
    session: Session,
  ) {
    const { model, promptTemplate } = await this.getInferenceParameters(
      authContext,
      inferenceRequest,
    );

    const inferences = await this.getInferencesForSession(authContext, session);
    session.inferences = inferences;

    return this.modelProvider.getPrompt(
      authContext,
      model,
      inferenceRequest,
      promptTemplate,
      session,
    );
  }

  async getInferencesForSession(
    authContext: IAuthenticatedContext,
    session: Session,
  ) {
    const { inferences } = await this.sessionRepository.findOneOrFail({
      where: { id: session.id },
      relations: { inferences: true },
    });

    return inferences;
  }
}
