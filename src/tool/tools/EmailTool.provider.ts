import { Injectable } from '@nestjs/common';
import { IToolProvider } from './tool-provider.service';
import { IAuthenticatedContext } from 'src/auth/auth.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Email } = require('email');

interface EmailToolConfig {
  from: string;
}

@Injectable()
export class EmailToolProvider implements IToolProvider<EmailToolConfig> {
  async exec(
    authContext: IAuthenticatedContext,
    config: EmailToolConfig,
    input: string,
  ) {
    const msg = new Email({
      from: config.from,
      to: authContext.profile.email,
      subject: 'A message from the AI...',
      body: input.slice(1, -1).split(',').slice(1).join(',').trim(),
    });

    await new Promise((resolve) => {
      msg.send((err: any) => {
        if (err) console.error('Failed to send', err);
        resolve(0);
      });
    });

    return 'Email sent';
  }
}
