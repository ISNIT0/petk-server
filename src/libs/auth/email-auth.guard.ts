import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class EmailAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email, code } = request.body;
    try {
      if (code === 'code') {
        await this.authService.sendEmail(email);
        return true;
      } else {
        const user = await this.authService.validateEmailCode(email, code);
        if (!user) {
          throw new UnauthorizedException();
        }
        request.user = user;
        return true;
      }
    } catch (err) {
      console.error(`Failed to log in`, err);
      throw err;
    }
  }
}
