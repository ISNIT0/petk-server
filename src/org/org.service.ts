import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Org } from 'src/database/entity/Org.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrgService {
  constructor(
    @InjectRepository(Org)
    private orgRepository: Repository<Org>,
  ) {}

  async getByAuthContext(authContext: IAuthenticatedContext) {
    const org = await this.orgRepository.findOneOrFail({
      where: { id: authContext.org.id },
    });
    return org;
  }
}
