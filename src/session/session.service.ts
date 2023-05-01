import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Session } from 'src/database/entity/Session.entity';
import { ToolIntegration } from 'src/database/entity/ToolIntegration.entity';
import { OrgService } from 'src/org/org.service';
import { ProfileService } from 'src/profile/profile.service';
import { Repository } from 'typeorm';

export interface IInferenceRequest {
  prompt: string;
  model: string;
  promptTemplate: string;
  type: 'automated' | 'user';
  tools: string[];
  toolProfile?: {
    name: string;
    avatarUrl: string;
    provider: ToolIntegration['type'];
  };
}

export type ITestInferenceRequest = IInferenceRequest & {
  template: string;
  maxTokens: number;
  stopSequence: string;
  temperature: number;
};

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    private orgService: OrgService,
    private profileService: ProfileService,
  ) {}

  async createSession(
    authContext: IAuthenticatedContext,
    type: Session['type'],
    source: Session['source'],
  ) {
    const [org, profile] = await Promise.all([
      this.orgService.getByAuthContext(authContext),
      this.profileService.getByAuthContext(authContext),
    ]);

    let session = new Session();
    session.org = org;
    session.profile = profile;
    session.type = type;
    session.source = source;
    session.name = `New Session (${new Date().toTimeString()})`;
    session.inferences = [];
    session = await this.sessionRepository.save(session);

    return session;
  }

  async getSessions(
    authContext: IAuthenticatedContext,
    type?: Session['type'],
    source?: Session['source'],
  ) {
    return this.sessionRepository.find({
      where: { org: { id: authContext.org.id }, type, source },
    });
  }

  async getSessionById(
    authContext: IAuthenticatedContext,
    chatId: string,
    deep = false,
  ) {
    const session = await this.sessionRepository.findOneOrFail({
      where: {
        org: { id: authContext.org.id },
        // profile: authContext.profile,
        id: chatId,
      },
      relations: {
        inferences: deep
          ? {
              promptTemplateInstance: { template: true },
              model: true,
              profile: true,
              warnings: true,
              ratings: true,
            }
          : false,
      },
    });

    session.inferences = session.inferences.sort((a, b) =>
      a.createdAt < b.createdAt ? -1 : 1,
    );

    return session;
  }
}
