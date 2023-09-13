import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import Patient from 'src/database/typeorm/Patient.entities';
import { loginSwagger } from 'src/common/doc/loginSwagger';
import { loginResponseSwagger } from 'src/common/doc/loginResponseSwagger';
import { Token } from 'src/common/types/types';
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import { Role } from 'src/common/enum/enum';

@Injectable()
export class AuthRepository {
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
    if (user.active === false) {
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
    user.accepted = true;
    await this.authRepository.save(user);

    const token = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, token.refreshToken);
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
      user.refreshToken = null;
      await this.authRepository.save(user);
    }
  }

  async refreshTokens(id: string, refreshToken: string): Promise<Token> {
    const user = await this.authRepository.findOne({
      where: {
        id,
      },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    const user = await this.authRepository.findOne({
      where: {
        id,
      },
    });
    const hashedRefreshToken = await argon2.hash(refreshToken);
    if (user) {
      user.refreshToken = hashedRefreshToken;
      await this.authRepository.save(user);
    }
  }

  async getTokens(id: string, email: string, role: Role): Promise<Token> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id,
          email,
          role,
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
