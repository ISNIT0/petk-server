import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { APIKey } from 'src/database/entity/APIKey.entity';
import { Profile } from 'src/database/entity/Profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
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
}
