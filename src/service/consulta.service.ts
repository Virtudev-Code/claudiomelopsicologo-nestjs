import { Injectable } from '@nestjs/common';
import { ConsultaRepository } from 'src/database/infra/repositories/ConsultaRepositories';
import { createConsultaSwagger } from 'src/common/doc/createConsultaSwagger';
import Consulta from 'src/database/typeorm/Consulta.entities';
import {
  IRequestMonth,
  IRequestMonthPatient,
  IRequestDayPatient,
} from 'src/common/types/types';

@Injectable()
export class ConsultaService {
  constructor(private readonly consultaRepository: ConsultaRepository) {}

  async createConsultas(data: createConsultaSwagger[]): Promise<Consulta[]> {
    const consulta = await this.consultaRepository.createConsultas(data);
    return consulta;
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

  async getAllAppointmentforMonth({
    month,
    year,
  }: IRequestMonth): Promise<Consulta[]> {
    return await this.consultaRepository.getAllAppointmentforMonth({
      month,
      year,
    });
  }

  async getCountByMonth(): Promise<Consulta[]> {
    return await this.consultaRepository.getCountByMonth();
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
}
