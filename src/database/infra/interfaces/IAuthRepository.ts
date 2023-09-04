import { loginResponseSwagger } from 'src/common/doc/loginResponseSwagger';
import { loginSwagger } from 'src/common/doc/loginSwagger';
import { Token } from 'src/common/types/types';

export default interface IAuthRepository {
  login(loginDto: loginSwagger): Promise<loginResponseSwagger>;
  logout(id: string): Promise<void>;
  getTokens(id: string, email: string): Promise<Token>;
  refreshTokens(id: string, refreshToken: string): Promise<Token>;
  updateRefreshToken(id: string, refreshToken: string): Promise<void>;
}
