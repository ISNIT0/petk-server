import {
  Controller,
  Request,
  Post,
  Get,
  UseGuards,
  Param,
} from '@nestjs/common';
import { IsEmail, IsString } from 'class-validator';
import { AuthService } from './auth.service';
import { Profile } from 'src/database/entity/Profile.entity';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { EmailAuthGuard } from 'src/libs/auth/email-auth.guard';

export class SendAuthEmailDto {
  @IsEmail() email: string;
}
export class ValidateAuthCodeDto {
  @IsEmail() email: string;
  @IsString() code: string;
}

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req): Promise<Profile> {
    const user = await this.authService.getProfile(req.user.id);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('jwt')
  getJwt(@Request() req): { jwt: string } {
    throw new Error(`TODO: getJWT Update`);
    return { jwt: this.jwtService.sign(req.user) };
  }

  @UseGuards(EmailAuthGuard)
  @Post('/:orgId/login')
  async login(@Request() req, @Param('orgId') orgId: string) {
    if (req.user) return this.authService.login(req.user, orgId);
    else {
      return { ok: true };
    }
  }
}
