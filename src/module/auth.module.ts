import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/common/jwt/jwt';
import { RefreshTokenStrategy } from 'src/common/jwt/refreshToken.jwt';
import { AuthRepository } from 'src/database/infra/repositories/AuthRepositories';
import { AddressRepository } from 'src/database/infra/repositories/AddressRepositories';
import { AuthController } from 'src/http/auth.http';
import { AuthService } from 'src/service/auth.service';

import { TypeOrmFeaturedModule } from './typeorm.module';

@Module({
  imports: [
    TypeOrmFeaturedModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    RefreshTokenStrategy,
    AuthRepository,
    AddressRepository,
    AuthService,
  ],
  exports: [
    PassportModule,
    JwtModule,
    AuthRepository,
    AddressRepository,
    AuthService,
  ],
})
export class AuthModule {}
