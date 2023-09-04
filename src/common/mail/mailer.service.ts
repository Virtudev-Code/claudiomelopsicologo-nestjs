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

  async sendRecoverPassord(name: string, email: string, token: string) {
    const templatePath = path.join(__dirname, 'templates/recover-password.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    const html = template({ name, token });

    const msg = {
      to: email,
      from: `"No Reply" <${process.env.MAIL_FROM}>`,
      subject: 'Telemedicina - Change your Password',
      html,
    };

    await SendGrid.send(msg);
  }

  async recoverPassord(email: string, token: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `"No Reply" <${process.env.MAIL_FROM}>`,
      subject: 'Change your Passord',
      template: './recover-password', // `.hbs` extension is appended automatically
      context: {
        token,
      },
    });
  }
}
