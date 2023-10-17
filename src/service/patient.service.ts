import { BadRequestException, Injectable } from '@nestjs/common';
import { createPatientSwagger } from 'src/common/doc/createPatientSwagger';
import {
  updateEmailSwagger,
  updatePatientSwagger,
} from 'src/common/doc/updatePatientSwagger';
import Patient from 'src/database/typeorm/Patient.entities';
import { PatientRepository } from 'src/database/infra/repositories/PatientRepositories';
import Consulta from 'src/database/typeorm/Consulta.entities';
import {
  IRequestDayPatient,
  IRequestMonth,
  IRequestMonthPatient,
} from 'src/common/types/types';

@Injectable()
export class PatientService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async createPatient(data: createPatientSwagger): Promise<Patient> {
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException('As senhas informadas não são iguais.');
    }

    const verify = await this.patientRepository.findEmailPatient(data.email);

    if (verify) {
      throw new BadRequestException('Este usuário já existe.');
    }

    const user = await this.patientRepository.createPatient(data);
    return user;
  }

  async findAllPatient(): Promise<Patient[]> {
    return await this.patientRepository.findAllPatient();
  }

  async findAppointmentById(id: string, patient_id: string): Promise<Consulta> {
    return await this.patientRepository.findAppointmentById(id, patient_id);
  }

  async myAppointments(id: string): Promise<Consulta[]> {
    return await this.patientRepository.myAppointments(id);
  }

  async myPaidAppointments(id: string): Promise<Consulta[]> {
    return await this.patientRepository.myPaidAppointments(id);
  }

  async myUnPaidAppointments(id: string): Promise<Consulta[]> {
    return await this.patientRepository.myUnPaidAppointments(id);
  }

  async findPatientById(id: string): Promise<Patient> {
    return await this.patientRepository.findPatientById(id);
  }

  async updatePatient(
    id: string,
    data: updatePatientSwagger,
  ): Promise<Patient> {
    return await this.patientRepository.updatePatient(id, data);
  }

  async updateEmailPatient(
    id: string,
    data: updateEmailSwagger,
  ): Promise<Patient> {
    return await this.patientRepository.updateEmailPatient(id, data);
  }

  async getAllAppointmentforMonth({
    month,
    year,
  }: IRequestMonth): Promise<Consulta[]> {
    return await this.patientRepository.getAllAppointmentforMonth({
      month,
      year,
    });
  }

  async getAppointmentforPatientMonth({
    patient_name,
    month,
    year,
  }: IRequestMonthPatient): Promise<Consulta[]> {
    return await this.patientRepository.getAppointmentforPatientMonth({
      patient_name,
      month,
      year,
    });
  }

  async getAppointmentforPatientDay({
    patient_name,
    month,
    year,
    day,
  }: IRequestDayPatient): Promise<Consulta[]> {
    return await this.patientRepository.getAppointmentforPatientDay({
      patient_name,
      month,
      year,
      day,
    });
  }

  async removePatient(id: string): Promise<void> {
    await this.patientRepository.deletePatient(id);
  }
}
