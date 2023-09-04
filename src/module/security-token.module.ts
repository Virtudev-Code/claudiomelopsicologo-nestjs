import { Module } from '@nestjs/common';
import { SecurityTokenController } from 'src/http/security-token.http';
import { AuthModule } from './auth.module';
import { SecurityTokenRepository } from 'src/database/infra/repositories/SecurityRepositories';
import { SecurityTokenService } from 'src/service/security-token.service';
import { TypeOrmFeaturedModule } from './typeorm.module';
import { MailService } from 'src/common/mail/mailer.service';
import { MailModule } from 'src/common/mail/mailer.module';

@Module({
  imports: [AuthModule, TypeOrmFeaturedModule, MailModule],
  providers: [SecurityTokenRepository, SecurityTokenService, MailService],
  controllers: [SecurityTokenController],
  exports: [SecurityTokenRepository, SecurityTokenService],
})
export class SecurityTokenModule {}
