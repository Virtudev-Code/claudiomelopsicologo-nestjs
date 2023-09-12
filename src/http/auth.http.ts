import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedUser } from 'src/common/decorators/user.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { Throttle } from '@nestjs/throttler';
import { Routes } from 'src/common/constant/constants';
import { AuthService } from 'src/service/auth.service';
import { loginSwagger } from 'src/common/doc/loginSwagger';
import { loginResponseSwagger } from 'src/common/doc/loginResponseSwagger';
import Patient from 'src/database/typeorm/Patient.entities';

@ApiTags(Routes.AUTH)
@Controller(Routes.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle(5, 60) // Permite no máximo 5 solicitações a cada 60 segundos
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Realizar login, recebendo um token de autenticação',
  })
  login(@Body() loginDto: loginSwagger): Promise<loginResponseSwagger> {
    return this.authService.login(loginDto);
  }

  @UseGuards(AccessTokenGuard)
  @Throttle(5, 60) // Permite no máximo 5 solicitações a cada 60 segundos
  @Get()
  @ApiOperation({
    summary: 'Retorna o usuário autenticado no momento',
  })
  @ApiBearerAuth()
  profileUser(@LoggedUser() user: Patient) {
    return user;
  }

  @Throttle(1000, 60) // Permite no máximo 100- solicitações a cada 60 segundos
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiOperation({
    summary: 'Realiza o Refresh Token',
  })
  @ApiBearerAuth()
  refreshTokens(@LoggedUser() user: Patient) {
    return this.authService.refreshTokens(user.id, user.refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Get('logout')
  @ApiOperation({
    summary: 'Realizar logout, recebe o id do usuário',
  })
  logout(@LoggedUser() user: Patient) {
    this.authService.logout(user.id);
  }
}
