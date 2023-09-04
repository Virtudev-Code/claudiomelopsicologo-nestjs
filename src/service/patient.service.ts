import { BadRequestException, Injectable } from '@nestjs/common';
import { createPatientSwagger } from 'src/common/doc/createPatientSwagger';
import { updatePatientSwagger } from 'src/common/doc/updatePatientSwagger';
import Patient from 'src/database/typeorm/Patient.entities';
import { PatientRepository } from 'src/database/infra/repositories/PatientRepositories';
import Consulta from 'src/database/typeorm/Consulta.entities';

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
}
