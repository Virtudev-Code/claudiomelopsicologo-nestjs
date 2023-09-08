import { Injectable } from '@nestjs/common';
import { loginSwagger } from 'src/common/doc/loginSwagger';
import { loginResponseSwagger } from 'src/common/doc/loginResponseSwagger';
import { AuthRepository } from 'src/database/infra/repositories/AuthRepositories';
import { Role } from 'src/common/enum/enum';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async login(loginDto: loginSwagger): Promise<loginResponseSwagger> {
    return this.authRepository.login(loginDto);
  }

  async logout(id: string) {
    return this.authRepository.logout(id);
  }

  async refreshTokens(id: string, refreshToken: string) {
    return this.authRepository.refreshTokens(id, refreshToken);
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    return this.authRepository.updateRefreshToken(id, refreshToken);
  }

  async getTokens(id: string, email: string, role: Role) {
    return this.authRepository.getTokens(id, email, role);
  }
}
