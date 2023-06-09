import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from 'src/database/entity/Session.entity';
import { OrgModule } from 'src/org/org.module';
import { ProfileModule } from 'src/profile/profile.module';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { ApiKeyModule } from 'src/api-key/api-key.module';
import { InferenceModule } from 'src/inference/inference.module';
import { InstructionModule } from 'src/instruction/instruction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
    OrgModule,
    ProfileModule,
    ApiKeyModule,
    forwardRef(() => InferenceModule),
    InstructionModule,
  ],
  providers: [SessionService],
  exports: [SessionService],
  controllers: [SessionController],
})
export class SessionModule {}
