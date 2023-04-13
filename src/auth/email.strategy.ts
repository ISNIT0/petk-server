import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, code: 'code' | string): Promise<any> {
    if (code === 'code') {
      await this.authService.sendEmail(email);
      throw new Error('Code Sent');
    } else {
      const user = await this.authService.validateEmailCode(email, code);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    }
  }
}
