import { Injectable } from '@nestjs/common';
import { ToolIntegration } from 'src/database/entity/ToolIntegration.entity';
import { WebhookToolProvider } from './WebhookTool.provider';
import { SerpapiToolProvider } from './SerpapiTool.provider';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { EmailToolProvider } from './EmailTool.provider';
import { CalculatorToolProvider } from './CalculatorTool.provider';

export interface IToolProvider<TToolConfig> {
  exec(
    authContext: IAuthenticatedContext,
    config: TToolConfig,
    input: string,
  ): Promise<string>;
}

@Injectable()
export class ToolProviderService {
  private tools: Record<ToolIntegration['type'], IToolProvider<any>>;
  constructor(
    private webhookProvider: WebhookToolProvider,
    private serpapiProvider: SerpapiToolProvider,
    private emailProvider: EmailToolProvider,
    private calculatorProvider: CalculatorToolProvider,
  ) {
    this.tools = {
      webhook: webhookProvider,
      serpapi: serpapiProvider,
      email: emailProvider,
      calculator: calculatorProvider,
    };
  }

  getTool(type: ToolIntegration['type']) {
    return this.tools[type];
  }
}
