import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { addHours, isAfter } from 'date-fns';
import { MailService } from 'src/common/mail/mailer.service';
import { IEmail, IReset } from 'src/common/types/types';
import { SecurityTokenRepository } from 'src/database/infra/repositories/SecurityRepositories';

@Injectable()
export class SecurityTokenService {
  constructor(
    private readonly securityTokenRepository: SecurityTokenRepository,
    private readonly mailerService: MailService,
  ) {}

  async sendForgotPasswordEmail({ email }: IEmail): Promise<void> {
    const user = await this.securityTokenRepository.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException('User does not exist.');
    }

    const securityToken = await this.securityTokenRepository.generate(user.id);

    await this.mailerService.sendRecoverPassord(
      user.name,
      user.email,
      securityToken.token,
    );
  }

  async resetPassword({ token, password }: IReset): Promise<void> {
    const userToken = await this.securityTokenRepository.findByToken(token);

    if (!userToken) {
      throw new BadRequestException('User Token does not exist.');
    }

    const user = await this.securityTokenRepository.findUserById(
      userToken.user_id,
    );

    if (!user) {
      throw new BadRequestException('User does not exist.');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new HttpException('Token expired.', HttpStatus.BAD_REQUEST);
    }

    // Verificar se a nova senha é igual a alguma senha antiga
    await this.securityTokenRepository.resetPassword(user.id, password);
  }
}
