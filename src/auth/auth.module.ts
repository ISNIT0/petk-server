import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { VerificationService } from './verification/verification.service';
import { LocalStrategy } from './email.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/libs/auth/jwt.strategy';
import { Profile } from 'src/database/entity/Profile.entity';
import { DatabaseModule } from 'src/database/database.module';
import { ApiKeyModule } from 'src/api-key/api-key.module';
import { OrgModule } from 'src/org/org.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Profile]),
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        //   expiresIn: '5d'
      },
    }),
    ApiKeyModule,
    OrgModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, VerificationService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
