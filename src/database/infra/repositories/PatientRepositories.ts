import { Between, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createPatientSwagger } from 'src/common/doc/createPatientSwagger';
import {
  updateEmailSwagger,
  updatePatientSwagger,
} from 'src/common/doc/updatePatientSwagger';
import { AuthRepository } from './AuthRepositories';
import { Role } from 'src/common/enum/enum';
import Patient from 'src/database/typeorm/Patient.entities';
import * as bcrypt from 'bcrypt';
import Consulta from 'src/database/typeorm/Consulta.entities';
import {
  IRequestDayPatient,
  IRequestMonth,
  IRequestMonthPatient,
} from 'src/common/types/types';
import { endOfDay, startOfDay } from 'date-fns';
import { AddressRepository } from './AddressRepositories';

@Injectable()
export class PatientRepository {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Consulta)
    private readonly consultaRepository: Repository<Consulta>,
    private readonly authRepository: AuthRepository,
    private readonly addressRepository: AddressRepository,
  ) {}

  async createPatient(data: createPatientSwagger): Promise<Patient> {
    const hashPassword = await bcrypt.hash(data.password, 10);

    const patient = new Patient();

    patient.name = data.name;
    patient.email = data.email;
    patient.identificador = data.identificador;
    patient.telefone = data.telefone;
    patient.refreshToken = '';
    patient.role = Role.PATIENT;
    patient.password = hashPassword;
    patient.active = true;
    patient.accepted = true;

    const savedPatient = await this.patientRepository.save(patient);

    await this.addressRepository.createAddress({
      cep: data.address.cep,
      logradouro: data.address.logradouro,
      numero: data.address.numero,
      complemento: data.address.complemento,
      bairro: data.address.bairro,
      cidade: data.address.cidade,
      uf: data.address.uf,
      patient_id: savedPatient.id,
    });

    const tokens = await this.authRepository.getTokens(
      savedPatient.id,
      savedPatient.name,
      savedPatient.role,
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
      relations: ['address'],
    });
  }

  async findAllPatient(): Promise<Patient[]> {
    return this.patientRepository.find({
      where: {
        role: Role.PATIENT,
      },
      relations: ['address'],
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
      relations: ['address'],
    });
  }

  async updatePatient(
    id: string,
    data: updatePatientSwagger,
  ): Promise<Patient> {
    await this.patientRepository.update(id, data);
    await this.addressRepository.updateAddress(data.address.id, data.address);
    return this.findPatientById(id);
  }

  async updateEmailPatient(
    id: string,
    data: updateEmailSwagger,
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

  public async getAllAppointmentforMonth({
    month,
    year,
  }: IRequestMonth): Promise<Consulta[]> {
    // Primeiro dia do mês
    const startDate = new Date(year, month - 1, 1);
    // Último dia do mês
    const endDate = new Date(year, month, 0);

    return await this.consultaRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
    });
  }

  public async getAppointmentforPatientMonth({
    patient_name,
    month,
    year,
  }: IRequestMonthPatient): Promise<Consulta[]> {
    // Primeiro dia do mês
    const startDate = new Date(year, month - 1, 1);
    // Último dia do mês
    const endDate = new Date(year, month, 0);

    return await this.consultaRepository.find({
      where: {
        patient_name,
        date: Between(startDate, endDate),
      },
    });
  }

  public async getAppointmentforPatientDay({
    patient_name,
    month,
    year,
    day,
  }: IRequestDayPatient): Promise<Consulta[]> {
    const startDate = startOfDay(new Date(year, month - 1, day));
    const endDate = endOfDay(new Date(year, month - 1, day));

    return await this.consultaRepository.find({
      where: {
        patient_name,
        date: Between(startDate, endDate),
      },
      relations: ['patient'],
    });
  }

  async deletePatient(id: string): Promise<void> {
    await this.patientRepository.delete(id);
  }
}
