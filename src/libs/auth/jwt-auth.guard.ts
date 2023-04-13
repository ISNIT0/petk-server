import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ApiKeyService } from 'src/api-key/api-key.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private apiKeyService: ApiKeyService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization || '';
    const apiKey = authHeader.startsWith('Bearer api-')
      ? authHeader.replace('Bearer api-', '')
      : null;

    if (apiKey) {
      try {
        const authContext = await this.apiKeyService.getUserContextForApiKey(
          apiKey,
        );
        request.authContext = authContext;
        return true;
      } catch (err) {
        console.error(`Failed to verify API Key`, err);
        return false;
      }
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) return false;
    try {
      request.authContext = jwt.verify(token, process.env.JWT_SECRET);
      return true;
    } catch (err) {
      return false;
    }
  }
}

@Injectable()
export class JwtAuthGuardAllow implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return true;
    try {
      request.authContext = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {}
    return true;
  }
}
