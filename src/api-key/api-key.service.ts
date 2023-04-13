import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { APIKey } from 'src/database/entity/APIKey.entity';
import { Org } from 'src/database/entity/Org.entity';
import { Profile } from 'src/database/entity/Profile.entity';
import { Repository } from 'typeorm';
import * as md5 from 'md5';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Org)
    private orgRepository: Repository<Org>,
    @InjectRepository(APIKey)
    private apiKeyRepository: Repository<APIKey>,
  ) {}
  // TODO: Cache
  async getUserContextForApiKey(key: string) {
    const apiKey = await this.apiKeyRepository.findOneOrFail({
      where: { key },
      relations: { profile: true, org: true },
    });

    return { profile: apiKey.profile, org: apiKey.org };
  }

  async create(authContext: IAuthenticatedContext) {
    const profile = await this.profileRepository.findOneOrFail({
      where: { id: authContext.profile.id },
    });
    const org = await this.orgRepository.findOneOrFail({
      where: { id: authContext.org.id },
    });

    let apiKey = new APIKey();
    apiKey.key = md5(`${profile.id}-${org.id}-${new Date().getTime()}`);
    apiKey.profile = profile;
    apiKey.org = org;
    apiKey = await this.apiKeyRepository.save(apiKey);
    return apiKey;
  }

  async getAllObfuscated(authContext: IAuthenticatedContext) {
    const keys = await this.apiKeyRepository.find({
      where: {
        profile: { id: authContext.profile.id },
        org: { id: authContext.org.id },
      },
    });

    return keys.map((key) => {
      const keyLength = key.key.length;
      key.key = '*'.repeat(keyLength - 5) + key.key.slice(keyLength - 5);
      return key;
    });
  }

  async deleteById(authContext: IAuthenticatedContext, id: string) {
    return this.apiKeyRepository.delete({
      profile: { id: authContext.profile.id },
      org: { id: authContext.org.id },
      id,
    });
  }
}
