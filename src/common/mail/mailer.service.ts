import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    SendGrid.setApiKey(this.configService.get<string>('SEND_GRID_KEY'));
  }

  // async updateEmailByAdmin(name: string, email: string) {
  //   const templatePath = path.join(__dirname, 'templates/updated-email.hbs');
  //   const templateSource = fs.readFileSync(templatePath, 'utf8');
  //   const template = handlebars.compile(templateSource);
  //   const html = template({ name, email });

  //   const msg = {
  //     to: email,
  //     from: `"No Reply" <${process.env.MAIL_FROM}>`,
  //     subject: 'Psicólogo - Dados de acesso',
  //     html,
  //   };

  //   await SendGrid.send(msg);
  // }

  async sendRecoverPassword(name: string, email: string) {
    const templatePath = path.join(__dirname, 'templates/updated-email.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    const html = template({ name, email });

    const msg = {
      to: email,
      from: `"No Reply" <${process.env.MAIL_FROM}>`,
      subject: 'Claudio Melo - Psicólogo',
      html,
    };

    await SendGrid.send(msg);
  }

  async recoverPassword(name: string, email: string, token: string) {
    const templatePath = path.join(__dirname, 'templates/recover-password.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    const html = template({ name, token });

    const msg = {
      to: email,
      from: `"No Reply" <${process.env.MAIL_FROM}>`,
      subject: 'Claudio Melo - Recuperação de senha',
      html,
    };

    await SendGrid.send(msg);
  }
}
