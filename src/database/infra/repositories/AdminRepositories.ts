import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createPatientSwagger } from 'src/common/doc/createPatientSwagger';
import { AuthRepository } from './AuthRepositories';
import Patient from 'src/database/typeorm/Patient.entities';
import { Role } from 'src/common/enum/enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectRepository(Patient)
    private readonly adminRepository: Repository<Patient>,
    private readonly authRepository: AuthRepository,
  ) {}

  public async createPatient(data: createPatientSwagger): Promise<Patient> {
    const hashPassword = await bcrypt.hash(data.password, 10);

    const patient = new Patient();

    patient.name = data.name;
    patient.email = data.email;
    patient.refresh_token = '';
    patient.role = Role.PATIENT;
    patient.password = hashPassword;
    patient.active = true;

    const newPatient = await this.adminRepository.save(patient);

    const tokens = await this.authRepository.getTokens(
      newPatient.id,
      newPatient.name,
    );

    await this.authRepository.updateRefreshToken(
      newPatient.id,
      tokens.refreshToken,
    );

    return newPatient;
  }

  public async updateOnePatient(user: Patient): Promise<Patient> {
    const updateUser = await this.adminRepository.save(user);

    return updateUser;
  }

  public async getAllPatients(): Promise<Patient[]> {
    return await this.adminRepository.find({
      where: {
        role: Role.PATIENT,
      },
    });
  }

  public async findPatientByEmail(email: string): Promise<Patient> {
    return await this.adminRepository.findOne({
      where: {
        email,
      },
    });
  }

  public async findPatientById(id: string): Promise<Patient> {
    return await this.adminRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async getPatientWithoutEmail(): Promise<Patient[]> {
    return await this.adminRepository.find({
      where: {
        email: null,
      },
    });
  }
}
