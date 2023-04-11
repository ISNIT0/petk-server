import { Injectable } from '@nestjs/common';
import { IToolProvider } from './tool-provider.service';
import { IAuthenticatedContext } from 'src/auth/auth.service';

interface WebhookToolConfig {
  url: string;
  method: 'GET' | 'POST';
  ['x-hook-secret']?: string;
}

@Injectable()
export class WebhookToolProvider implements IToolProvider<WebhookToolConfig> {
  async exec(
    authContext: IAuthenticatedContext,
    config: WebhookToolConfig,
    input: string,
  ) {
    const ret = await (
      await fetch(config.url, {
        method: config.method,
        body: JSON.stringify({ input }),
      })
    ).text();

    return ret;
  }
}
