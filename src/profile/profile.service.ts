import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Profile } from 'src/database/entity/Profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}
  async updateProfile(
    actorEmail: string,
    body: { name: string; avatarUrl: string },
  ) {
    const actor = await this.profileRepository.findOneByOrFail({
      email: actorEmail,
    });

    Object.assign(actor, body);

    return await this.profileRepository.save(actor);
  }

  async getByAuthContext(authContext: IAuthenticatedContext) {
    return this.profileRepository.findOneOrFail({
      where: { id: authContext.profile.id },
    });
  }
}
