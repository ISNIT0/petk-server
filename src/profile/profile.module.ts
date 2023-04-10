import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/database/entity/Profile.entity';
import { ApiKeyModule } from 'src/api-key/api-key.module';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), ApiKeyModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
