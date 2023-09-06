import { BadRequestException, Injectable } from '@nestjs/common';
import { createPatientSwagger } from 'src/common/doc/createPatientSwagger';
import Patient from 'src/database/typeorm/Patient.entities';
import { AdminRepository } from 'src/database/infra/repositories/AdminRepositories';
import { updatePatientSwagger } from 'src/common/doc/updatePatientSwagger';
import { UpdateUser } from 'src/common/types/types';
import { createAdminSwagger } from 'src/common/doc/createAdminSwagger';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  public async createPatient(data: createPatientSwagger): Promise<Patient> {
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException('As senhas informadas não são iguais.');
    }

    const verifyUserExist = await this.adminRepository.findPatientByEmail(
      data.email,
    );

    if (verifyUserExist) {
      throw new BadRequestException('Este usuário já existe.');
    }

    const user = await this.adminRepository.createPatient(data);
    return user;
  }

  public async createAdmin(data: createAdminSwagger): Promise<Patient> {
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException('As senhas informadas não são iguais.');
    }

    const verifyUserExist = await this.adminRepository.findPatientByEmail(
      data.email,
    );

    if (verifyUserExist) {
      throw new BadRequestException('Este usuário já existe.');
    }

    const user = await this.adminRepository.createAdmin(data);
    return user;
  }

  public async findPatientByEmail(email: string): Promise<Patient> {
    return await this.adminRepository.findPatientByEmail(email);
  }

  public async findPatientById(id: string): Promise<Patient> {
    return await this.adminRepository.findPatientById(id);
  }

  public async getPatientWithoutEmail(): Promise<Patient[]> {
    return await this.adminRepository.getPatientWithoutEmail();
  }

  public async updatePatientWithoutEmail({
    id,
    patient,
  }: UpdateUser): Promise<Patient> {
    if (!patient.email) {
      throw new BadRequestException('User email do not exist');
    }

    return await this.adminRepository.updatePatientWithoutEmail({
      id,
      patient,
    });
  }

  public async getAllPatients(): Promise<Patient[]> {
    return await this.adminRepository.getAllPatients();
  }

  public async updateOnePatient(
    id: string,
    data: updatePatientSwagger,
  ): Promise<Patient> {
    const user = await this.adminRepository.findPatientById(id);

    if (!user) {
      throw new BadRequestException('Este usuário não existe.');
    }

    Object.assign(user, data);

    return await this.adminRepository.updateOnePatient(user);
  }

  public async updateEmailPatient(
    id: string,
    data: updatePatientSwagger,
  ): Promise<Patient> {
    const user = await this.adminRepository.findPatientById(id);

    if (!user) {
      throw new BadRequestException('Este usuário não existe.');
    }

    Object.assign(user, data);

    return await this.adminRepository.updateOnePatient(user);
  }
}
