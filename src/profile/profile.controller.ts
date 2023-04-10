import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}
  @Post('/update')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Req() req, @Body() body: { name: string; avatarUrl: string }) {
    const email = req.user.email;
    return this.profileService.updateProfile(email, body);
  }
}
