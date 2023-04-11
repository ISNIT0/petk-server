import { Injectable } from '@nestjs/common';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Inference } from 'src/database/entity/Inference.entity';
import { Session } from 'src/database/entity/Session.entity';
import { InferenceService } from 'src/inference/inference.service';
import { IInferenceRequest } from 'src/session/session.service';
import { ToolService } from 'src/tool/tool.service';

@Injectable()
export class InstructionService {
  constructor(
    private inferenceService: InferenceService,
    private toolService: ToolService,
  ) {}
  async infer(
    authContext: IAuthenticatedContext,
    inferenceRequest: IInferenceRequest,
    session: Session,
  ) {
    const result = await this.inferenceService.infer(
      authContext,
      inferenceRequest,
      session,
    );

    session.inferences.push(result);

    const action = this.getAction(result);
    if (action) {
      const { result: toolResult, tool } = await this.toolService.executeTool(
        authContext,
        action.action,
        action.actionInput,
      );

      session.inferences.push(result);

      return this.infer(
        authContext,
        {
          ...inferenceRequest,
          prompt: `Observation: ${toolResult}`,
          type: 'automated',
          toolProfile: {
            name: tool.integration.name,
            avatarUrl: tool.integration.iconUrl,
            provider: tool.integration.type,
          },
        },
        session,
      );
    }

    if (this.isFinalAnswer(result)) {
      return session.inferences;
    }

    return session.inferences;
  }

  getAction(inference: Inference) {
    const action = inference.response
      .split('Action:')[1]
      ?.split('Action Input:')[0]
      ?.trim();
    const actionInput = inference.response.split('Action Input:')[1]?.trim();

    if (action && actionInput) return { action, actionInput };
    else return null;
  }

  isFinalAnswer(inference: Inference) {
    return inference.response.trim().startsWith('Final Answer:');
  }
}
