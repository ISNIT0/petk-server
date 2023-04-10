import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerificationService {
  verificationService: any; // TODO: find this type
  constructor(private configService: ConfigService) {
    const twilio = new Twilio(
      configService.get('TWILIO_SID'),
      configService.get('TWILIO_TOKEN'),
    );

    this.verificationService = twilio.verify.services(
      configService.get('TWILIO_VERIFICATION_SERVICE_ID'),
    );
  }

  start(to: string) {
    // TODO: skip on dev
    return this.verificationService.verifications.create({
      to,
      channel: 'email',
      channelConfiguration: {
        substitutions: {
          host: this.configService.get('AUTH_HOST'),
          email: to,
          //   uId: profile.id,
        },
      },
    });
  }

  async verify(to: string, code: string) {
    const verification =
      await this.verificationService.verificationChecks.create({
        to,
        code,
      });
    if (verification.status !== 'approved') {
      console.warn({ verification });
      throw new Error(`Verification failed`);
    }
    return verification;
  }
}
