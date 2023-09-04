import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Routes } from 'src/common/constant/constants';
import {
  EmailSwagger,
  ResetPasswordSwagger,
} from 'src/common/doc/securitySwagger';
import { SecurityTokenService } from 'src/service/security-token.service';
import { Response } from 'express';

@ApiTags(Routes.SECURITY)
@Controller(Routes.SECURITY)
export class SecurityTokenController {
  constructor(private readonly securityTokenService: SecurityTokenService) {}

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Recuperação de senha do usuário',
  })
  async sendForgotPasswordEmail(@Body() email: EmailSwagger): Promise<void> {
    await this.securityTokenService.sendForgotPasswordEmail(email);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Digite sua nova senha',
  })
  async resetPassword(
    @Body() data: ResetPasswordSwagger,
    @Res() res: Response,
  ): Promise<Response> {
    const { token, password } = data;

    await this.securityTokenService.resetPassword({ token, password });

    return res.status(204).json();
  }
}
