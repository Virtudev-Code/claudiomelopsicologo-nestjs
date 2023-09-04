import { Injectable } from '@nestjs/common';
import { ConsultaRepository } from 'src/database/infra/repositories/ConsultaRepositories';
import { createConsultaSwagger } from 'src/common/doc/createConsultaSwagger';
import Consulta from 'src/database/typeorm/Consulta.entities';

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
}
