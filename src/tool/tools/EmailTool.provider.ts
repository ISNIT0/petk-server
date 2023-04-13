import { Injectable } from '@nestjs/common';
import { IToolProvider } from './tool-provider.service';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import * as sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    await sgMail.send({
      to: authContext.profile.email,
      from: 'ai@alphaiota.io',
      templateId: 'd-67ac7eced4b74061bdcb74a357e3a701',
      dynamicTemplateData: {
        message: input.slice(1, -1),
      },
    });

    return 'Email sent';
  }
}
