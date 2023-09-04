import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import Patient from 'src/database/typeorm/Patient.entities';
import { loginSwagger } from 'src/common/doc/loginSwagger';
import { loginResponseSwagger } from 'src/common/doc/loginResponseSwagger';
import IAuthRepository from '../interfaces/IAuthRepository';
import { Token } from 'src/common/types/types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(Patient)
    private readonly authRepository: Repository<Patient>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: loginSwagger): Promise<loginResponseSwagger> {
    const { email, password } = loginDto;

    // Procura e checa se o usuário existe usando o email
    const user = await this.authRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário e/ou senha inválidos!');
    }

    // Verifica se a conta do usuário está bloqueada
    if (user.active) {
      throw new UnauthorizedException(
        'Sua conta está desativada. Entre em contato com o administrador.',
      );
    }

    // Valida se a senha informada é correta
    const isHashValid = await bcrypt.compare(password, user.password);

    if (!isHashValid) {
      throw new UnauthorizedException('Usuário e/ou senha inválidos!');
    }

    // Login bem-sucedido, redefine o número de tentativas de login malsucedidas para 0
    await this.authRepository.save(user);

    const token = await this.getTokens(user.id, user.email);

    delete user.password;

    return {
      user,
      token,
    };
  }

  async logout(id: string): Promise<void> {
    const user = await this.authRepository.findOne({
      where: {
        id,
      },
    });
    if (user) {
      user.refresh_token = null;
      await this.authRepository.save(user);
    }
  }

  async refreshTokens(id: string, refreshToken: string): Promise<Token> {
    const user = await this.authRepository.findOne({
      where: {
        id,
      },
    });

    if (!user || !user.refresh_token) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refresh_token,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.email);

    user.refresh_token = tokens.refreshToken;
    await this.authRepository.save(user);

    return tokens;
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    const user = await this.authRepository.findOne({
      where: {
        id,
      },
    });
    if (user) {
      user.refresh_token = await bcrypt.hash(refreshToken, 10);
      await this.authRepository.save(user);
    }
  }

  async getTokens(id: string, email: string): Promise<Token> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        {
          id,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
