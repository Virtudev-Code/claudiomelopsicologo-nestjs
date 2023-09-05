import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createPatientSwagger } from 'src/common/doc/createPatientSwagger';
import { updatePatientSwagger } from 'src/common/doc/updatePatientSwagger';
import { AuthRepository } from './AuthRepositories';
import { Role } from 'src/common/enum/enum';
import Patient from 'src/database/typeorm/Patient.entities';
import * as bcrypt from 'bcrypt';
import Consulta from 'src/database/typeorm/Consulta.entities';

@Injectable()
export class PatientRepository {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Consulta)
    private readonly consultaRepository: Repository<Consulta>,
    private readonly authRepository: AuthRepository,
  ) {}

  async createPatient(data: createPatientSwagger): Promise<Patient> {
    const hashPassword = await bcrypt.hash(data.password, 10);

    const patient = new Patient();

    patient.name = data.name;
    patient.email = data.email;
    patient.refresh_token = '';
    patient.role = Role.PATIENT;
    patient.frequency = data.frequency;
    patient.password = hashPassword;
    patient.active = true;
    patient.accepted = true;

    const savedPatient = await this.patientRepository.save(patient);

    const tokens = await this.authRepository.getTokens(
      savedPatient.id,
      savedPatient.name,
    );

    await this.authRepository.updateRefreshToken(
      savedPatient.id,
      tokens.refreshToken,
    );

    return savedPatient;
  }

  async findEmailPatient(email: string): Promise<Patient> {
    return this.patientRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findAllPatient(): Promise<Patient[]> {
    return this.patientRepository.find({
      where: {
        role: Role.PATIENT,
      },
    });
  }

  async findPatientByEmail(email: string): Promise<Patient> {
    return this.patientRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findPatientById(id: string): Promise<Patient> {
    return this.patientRepository.findOne({
      where: {
        id,
        role: Role.PATIENT,
      },
    });
  }

  async updatePatient(
    id: string,
    data: updatePatientSwagger,
  ): Promise<Patient> {
    await this.patientRepository.update(id, data);
    return this.findPatientById(id);
  }

  async findAppointmentById(id: string, patient_id: string): Promise<Consulta> {
    return await this.consultaRepository.findOne({
      where: {
        id,
        patient: {
          id: patient_id,
        },
      },
    });
  }

  async myAppointments(patient_id: string): Promise<Consulta[]> {
    return await this.consultaRepository.find({
      where: {
        patient: {
          id: patient_id,
        },
      },
    });
  }

  async myPaidAppointments(patient_id: string): Promise<Consulta[]> {
    return await this.consultaRepository.find({
      where: {
        situacaoDoPagamento: true,
        patient: {
          id: patient_id,
        },
      },
    });
  }

  async myUnPaidAppointments(patient_id: string): Promise<Consulta[]> {
    return await this.consultaRepository.find({
      where: {
        situacaoDoPagamento: false,
        patient: {
          id: patient_id,
        },
      },
    });
  }
}