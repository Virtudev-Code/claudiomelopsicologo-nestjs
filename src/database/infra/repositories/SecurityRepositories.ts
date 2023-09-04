import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Patient from 'src/database/typeorm/Patient.entities';

import SecurityToken from 'src/database/typeorm/SecurityToken.entities';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SecurityTokenRepository {
  constructor(
    @InjectRepository(SecurityToken)
    private readonly userTokenRepository: Repository<SecurityToken>,
    @InjectRepository(Patient)
    private readonly userRepository: Repository<Patient>,
  ) {}

  public async findUserById(id: string): Promise<Patient | undefined> {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async findUserByEmail(email: string): Promise<Patient | undefined> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  public async findByToken(
    token: string,
  ): Promise<SecurityToken | undefined | null> {
    return await this.userTokenRepository.findOne({
      where: {
        token,
      },
    });
  }

  public async generate(user_id: string): Promise<SecurityToken> {
    const userToken = this.userTokenRepository.create({ user_id });
    await this.userTokenRepository.save(userToken);
    return userToken;
  }

  public async resetPassword(id: string, password: string): Promise<Patient> {
    const user = await this.findUserById(id);

    if (!user) {
      throw new BadRequestException('patient not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await this.userRepository.save(user);

    return user;
  }
}
