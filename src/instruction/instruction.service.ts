import { Injectable } from '@nestjs/common';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Inference } from 'src/database/entity/Inference.entity';
import { Profile } from 'src/database/entity/Profile.entity';
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
    calls = 0,
  ) {
    if (calls === 0) {
      session.inferences = [];
    }

    if (calls > 5) {
      const { model, promptTemplate } =
        await this.inferenceService.getInferenceParameters(
          authContext,
          inferenceRequest,
        );
      let result = new Inference();
      result.prompt = 'Runaway Protection.';
      result.response = 'Ending Session';
      result.profile = authContext.profile as Profile;
      result.session = session;
      result.promptTemplateInstance = promptTemplate;
      result.toolProfile = {
        provider: 'webhook',
        name: 'Runaway Protection',
        avatarUrl:
          'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn0.iconfinder.com%2Fdata%2Ficons%2Fcrime-protection-people-rounded-1%2F110%2FPoliceman-2-4096.png&f=1&nofb=1&ipt=3c62adf20b9e9fd6fe9bed709ac57fc76e29572e108a8d3fc35b0d95e30ef6f3&ipo=images',
      };
      result.type = 'automated';
      result.model = model;
      result = await this.inferenceService.save(result);
      session.inferences.push(result);
      return session.inferences;
    }

    const result = await this.inferenceService.infer(
      authContext,
      inferenceRequest,
      session,
    );

    session.inferences.push(result.inference);

    const action = this.getAction(result.inference);
    if (action) {
      let toolResult;
      let tool;

      try {
        const ret = await this.toolService.executeTool(
          authContext,
          action.action,
          action.actionInput,
        );
        tool = ret.tool;
        toolResult = ret.result;
      } catch (err) {
        console.error(`Failed to execute tool ${action.action}`, err);
        toolResult = `Failed to perform requested action`;
      }
      session.inferences.push(result.inference);

      return this.infer(
        authContext,
        {
          ...inferenceRequest,
          prompt: `Observation: ${toolResult}`,
          type: 'automated',
          toolProfile: {
            name: tool?.integration.name,
            avatarUrl: tool?.integration.iconUrl,
            provider: tool?.integration.type,
          },
        },
        session,
        calls + 1,
      );
    }

    if (this.isFinalAnswer(result.inference)) {
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
