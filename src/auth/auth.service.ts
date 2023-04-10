import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationService } from './verification/verification.service';
import { Profile } from 'src/database/entity/Profile.entity';
import { Org } from 'src/database/entity/Org.entity';

export interface IAuthenticatedContext {
  profile: { id: string; email: string; name: string; avatarUrl: string };
  org: { id: string; name: string };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Org)
    private orgRepository: Repository<Org>,
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

  async generateJwt(authContext: IAuthenticatedContext) {
    const { profile, org } = await this.getAuthenticatedContext(
      { id: authContext.profile.id } as Profile,
      authContext.org.id,
    );
    const payload = {
      profile,
      org,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(_profile: Profile, orgId: string | 'unknown') {
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

    let org;

    if (!profile.orgs.length) {
      let _org = new Org();
      _org.name = 'Default';
      _org.orgUsers = [profile];
      _org = await this.orgRepository.save(_org);
      org = _org;
    } else {
      org =
        orgId === 'unknown'
          ? profile.orgs[0]
          : profile.orgs.find((org) => org.id === orgId);

      if (!org)
        throw new Error(`Unable to authenticate profile for org [${orgId}]`);
    }

    return {
      profile: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
      },
      org: { id: org.id, name: org.name },
    };
  }
}
