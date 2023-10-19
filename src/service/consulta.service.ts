import { Injectable } from '@nestjs/common';
import { ConsultaRepository } from 'src/database/infra/repositories/ConsultaRepositories';
import { createConsultaSwagger } from 'src/common/doc/createConsultaSwagger';
import Consulta from 'src/database/typeorm/Consulta.entities';
import {
  IRequestMonth,
  IRequestMonthPatient,
  IRequestDayPatient,
  IFilterConsulta,
} from 'src/common/types/types';
import Patient from 'src/database/typeorm/Patient.entities';

@Injectable()
export class ConsultaService {
  constructor(private readonly consultaRepository: ConsultaRepository) {}

  async createConsultas(data: createConsultaSwagger[]): Promise<Consulta[]> {
    const consulta = await this.consultaRepository.createConsultas(data);
    return consulta;
  }

  async findOne(patient_name: string): Promise<Patient> {
    return await this.consultaRepository.findOne(patient_name);
  }

  async findAllPaidAppointment(): Promise<Consulta[]> {
    return await this.consultaRepository.findAllPaidAppointment();
  }

  public async findAllUnPaidAppointment(): Promise<Consulta[]> {
    return await this.consultaRepository.findAllUnPaidAppointment();
  }

  async findAllAppointment(): Promise<Consulta[]> {
    return await this.consultaRepository.findAllAppointment();
  }

  async findAppointmentByPage(id: number): Promise<Consulta[]> {
    return await this.consultaRepository.findAppointmentByPage(id);
  }

  async deleteAppointment(id: string): Promise<void> {
    return await this.consultaRepository.deleteAppointment(id);
  }

  async getAllAppointmentforMonth({
    month,
    year,
  }: IRequestMonth): Promise<Consulta[]> {
    return await this.consultaRepository.getAllAppointmentforMonth({
      month,
      year,
    });
  }

  async getTotalValueByMonth({ month, year }: IRequestMonth): Promise<number> {
    return await this.consultaRepository.getTotalValueByMonth(month, year);
  }

  async getAppointmentforPatientMonth({
    patient_name,
    month,
    year,
  }: IRequestMonthPatient): Promise<Consulta[]> {
    return await this.consultaRepository.getAppointmentforPatientMonth({
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
    return await this.consultaRepository.getAppointmentforPatientDay({
      patient_name,
      month,
      year,
      day,
    });
  }

  async findAll(filters: IFilterConsulta): Promise<Consulta[]> {
    const consultas = await this.consultaRepository.findAll(filters);

    return consultas;
  }
}
