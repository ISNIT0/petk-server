import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Inference } from 'src/database/entity/Inference.entity';
import {
  InferenceWarning,
  InferenceWarningType,
} from 'src/database/entity/InferenceWarning.entity';
import { InferenceWarningAction } from 'src/database/entity/InferenceWarning.entity';
import { Model } from 'src/database/entity/Model.entity';
import { Org } from 'src/database/entity/Org.entity';
import { SentinelSetting } from 'src/database/entity/SentinelSetting.entity';
import {
  IPIIInstance,
  PIICategory,
  PiiDetectorService,
} from 'src/pii-detector/pii-detector.service';
import { Repository } from 'typeorm';

export interface ISentinelResult {
  action: InferenceWarningAction;
  string: string;
  type: InferenceWarningType;
  category: PIICategory | 'other'; // TODO: add other categories
  replaceWith?: string;
}

export interface IInferenceWarning {
  type: InferenceWarningType;
  category: ISentinelResult['category'];
}

@Injectable()
export class InferenceSentinelService {
  constructor(
    @InjectRepository(Model)
    private modelRepository: Repository<Model>,
    @InjectRepository(SentinelSetting)
    private sentinelSettingRepository: Repository<SentinelSetting>,
    @InjectRepository(InferenceWarning)
    private inferenceWarningRepository: Repository<InferenceWarning>,
    private piiDetectorService: PiiDetectorService,
  ) {}

  async checkForPII(
    piiConfig: SentinelSetting['promptPiiConfig'],
    input: string,
    inferences: Inference[],
  ): Promise<{
    results: ISentinelResult[];
    substitutions: Record<string, string>;
  }> {
    const substitutions: Partial<Record<PIICategory, Record<string, string>>> =
      {};

    const inferencesDetectedPii = (
      await Promise.all(
        inferences.map(async (inference) => {
          const promptDetectedPii = await this.piiDetectorService.detectPII(
            inference.prompt,
          );
          const responseDetectedPii = await this.piiDetectorService.detectPII(
            inference.response,
          );

          return promptDetectedPii.concat(responseDetectedPii);
        }),
      )
    ).flat();
    const promptDetectedPii = await this.piiDetectorService.detectPII(input);

    // Populate substitutions
    await this.replaceDetectedPII(
      piiConfig,
      substitutions,
      inferencesDetectedPii,
    );
    const results = await this.replaceDetectedPII(
      piiConfig,
      substitutions,
      promptDetectedPii,
    );

    return {
      results,
      substitutions: Object.assign({}, ...Object.values(substitutions)),
    };
  }

  replaceDetectedPII(
    piiConfig: SentinelSetting['promptPiiConfig'],
    substitutions: Partial<Record<PIICategory, Record<string, string>>>,
    piiInstances: IPIIInstance[],
  ) {
    return piiInstances
      .map((pii) => {
        const actionToTake = piiConfig?.[pii.category];
        if (!actionToTake) return;
        if (actionToTake === 'replace') {
          const categorySubstitutions = (substitutions[pii.category] =
            substitutions[pii.category] || {});
          const replacementCount = Object.keys(categorySubstitutions).length;
          const replacement = (categorySubstitutions[pii.string] =
            categorySubstitutions[pii.string] ||
            `__${pii.category}_${replacementCount}__`); // TODO: more robust replacement

          return {
            action: actionToTake,
            string: pii.string,
            replaceWith: replacement,
            type: 'pii',
            category: pii.category,
          };
        }

        return {
          action: actionToTake,
          string: pii.string,
          type: 'pii',
          category: pii.category,
        };
      })
      .filter((it) => it) as ISentinelResult[];
  }

  async checkInferencePrompt(
    authContext: IAuthenticatedContext,
    prompt: Inference,
    inferences: Inference[],
  ): Promise<
    | {
        sanitizedPrompt: string;
        sanitizedInferences: Inference[];
        substitutions: Record<string, string>;
        results: ISentinelResult[];
      }
    | { block: true; results: ISentinelResult[] }
  > {
    const { sentinelSetting } = await this.modelRepository.findOneOrFail({
      where: { id: prompt.model.id },
      relations: { sentinelSetting: true },
    });
    if (!sentinelSetting)
      return {
        sanitizedPrompt: prompt.prompt,
        sanitizedInferences: inferences,
        substitutions: {},
        results: [],
      };

    const { results: piiResults, substitutions: piiSubstitutions } =
      await this.checkForPII(
        sentinelSetting.promptPiiConfig,
        prompt.prompt,
        inferences,
      );

    const results = piiResults;
    const substitutions = piiSubstitutions;

    this.logInferenceIncidents(authContext, 'prompt', results, prompt);

    const blockReason = piiResults.find((result) => result.action === 'block');

    if (blockReason) {
      return {
        block: true,
        results,
      };
    }

    let sanitizedPrompt = prompt.prompt;
    const sanitizedInferences = inferences.slice();

    for (const [originalString, replaceWith] of Object.entries(substitutions)) {
      sanitizedPrompt = sanitizedPrompt.replaceAll(originalString, replaceWith);
      substitutions[replaceWith] = originalString;
      for (const inference of sanitizedInferences) {
        inference.prompt = inference.prompt.replaceAll(
          originalString,
          replaceWith,
        );
        inference.response = inference.response?.replaceAll(
          originalString,
          replaceWith,
        );
      }
    }

    return {
      sanitizedPrompt,
      sanitizedInferences,
      substitutions,
      results,
    };
  }

  async checkInferenceResult(
    response: string,
    substitutions: Record<string, string>,
    modelId: string,
  ): Promise<
    | {
        unsanitizedResponse: string;
        results: ISentinelResult[];
      }
    | { block: true; results: ISentinelResult[] }
  > {
    const { sentinelSetting } = await this.modelRepository.findOneOrFail({
      where: { id: modelId },
      relations: { sentinelSetting: true },
    });
    if (!sentinelSetting)
      return {
        unsanitizedResponse: response,
        results: [],
      };

    const { results: piiResults } = await this.checkForPII(
      sentinelSetting.responsePiiConfig,
      response,
      [],
    );

    const results = piiResults;

    const blockReasons = piiResults.filter(
      (result) => result.action === 'block',
    );

    if (blockReasons.length) {
      return {
        block: true,
        results,
      };
    }

    const replaceReasons = piiResults.filter(
      (result) => result.action === 'replace',
    );

    const { response: sanitizedResponse } = replaceReasons.reduce(
      (acc, result) => {
        return {
          response: acc.response.replaceAll(result.string, result.replaceWith),
        };
      },
      { response: response },
    );

    const unsanitizedResponse = Object.entries(substitutions).reduce(
      (response, [replaceWith, originalString]) => {
        return response.replaceAll(replaceWith, originalString);
      },
      sanitizedResponse,
    );

    return {
      unsanitizedResponse,
      results,
    };
  }

  async logInferenceIncidents(
    authContext: IAuthenticatedContext,
    warningOn: 'prompt' | 'response',
    sentinelResults: ISentinelResult[],
    inference: Inference,
  ) {
    const inferenceWarnings = sentinelResults.map((result) => {
      const inferenceWarning = new InferenceWarning();
      inferenceWarning.type = result.type;
      inferenceWarning.detail = `Detected ${result.category}`;
      inferenceWarning.badString = result.string;
      inferenceWarning.actionTaken = result.action;
      inferenceWarning.warningOn = warningOn;
      inferenceWarning.inference = inference;
      inferenceWarning.model = inference.model;
      inferenceWarning.org = { id: authContext.org.id } as Org;
      return inferenceWarning;
    });

    await this.inferenceWarningRepository.save(inferenceWarnings);
  }

  async getAllWarnings(authContext: IAuthenticatedContext) {
    return this.inferenceWarningRepository.find({
      where: { org: { id: authContext.org.id } },
      relations: { model: true },
    });
  }

  async getWarningById(authContext: IAuthenticatedContext, id: string) {
    return this.inferenceWarningRepository.findOneOrFail({
      where: { org: { id: authContext.org.id }, id },
      relations: { model: true, inference: { session: true } },
    });
  }
}
