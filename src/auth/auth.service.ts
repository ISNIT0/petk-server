import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationService } from './verification/verification.service';
import { Profile } from 'src/database/entity/Profile.entity';

export interface IAuthenticatedContext {
  profile: { id: string; email: string; name: string };
  org: { id: string; name: string };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private verificationService: VerificationService,
    private jwtService: JwtService,
  ) {}
  async getProfile(profileId: string) {
    return this.profileRepository.findOneOrFail({
      where: { id: profileId },
      relations: { orgs: true },
    });
  }

  async sendEmail(email: string) {
    try {
      await this.profileRepository.findOneOrFail({ where: { email } });
    } catch (err) {
      let profile = new Profile();
      // TODO: nullable
      profile.name = '';
      profile.avatarUrl = '';
      profile.email = email;
      profile = await this.profileRepository.save(profile);
      // throw new Error(`User doesn't exist`);
    }
    await this.verificationService.start(email);
  }

  async validateEmailCode(email: string, code: string) {
    await this.verificationService.verify(email, code);
    return this.profileRepository.findOneOrFail({ where: { email } });
  }

  async login(_profile: Profile, orgId: string) {
    const { profile, org } = await this.getAuthenticatedContext(
      _profile,
      orgId,
    );
    const payload = {
      profile,
      org,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getAuthenticatedContext(
    _profile: Profile,
    orgId: string,
  ): Promise<IAuthenticatedContext> {
    // TODO: A better query that doesn't hit all orgs...
    const profile = await this.profileRepository.findOneOrFail({
      where: { id: _profile.id },
      relations: { orgs: true },
    });

    const org = profile.orgs.find((org) => org.id === orgId);

    if (!org)
      throw new Error(`Unable to authenticate profile for org [${orgId}]`);

    return {
      profile: { id: profile.id, email: profile.email, name: profile.name },
      org: { id: org.id, name: org.name },
    };
  }
}
