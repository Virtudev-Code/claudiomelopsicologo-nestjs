import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Consulta from 'src/database/typeorm/Consulta.entities';
import { createConsultaSwagger } from 'src/common/doc/createConsultaSwagger';
import IConsultaRepository from '../interfaces/IConsultaRepository';
import Patient from 'src/database/typeorm/Patient.entities';
import { Role } from 'src/common/enum/enum';
import { handleError } from 'src/shared/error/handle-error.util';
import { isBefore } from 'date-fns';

@Injectable()
export class ConsultaRepository implements IConsultaRepository {
  constructor(
    @InjectRepository(Consulta)
    private readonly consultaRepository: Repository<Consulta>,
    @InjectRepository(Patient)
    private readonly userRepository: Repository<Patient>,
  ) {}

  public async createConsultas(
    consultasData: createConsultaSwagger[],
  ): Promise<Consulta[]> {
    const createdConsultas = [];
    for (const consultaData of consultasData) {
      const appointmentDate = new Date(consultaData.data);

      if (isBefore(appointmentDate, Date.now())) {
        throw handleError(new Error('Agendamentos com datas passadas'));
      }
    }

    for (const consultaData of consultasData) {
      const { patient_name, ...consultaInfo } = consultaData;

      let user = await this.userRepository.findOne({
        where: { name: patient_name },
      });

      if (!user) {
        user = new Patient();
        user.name = patient_name;
        user.role = Role.PATIENT;
        await this.userRepository.save(user);
      }

      const consulta = new Consulta();
      consulta.patient = user;
      consulta.patient_name = patient_name;
      Object.assign(consulta, consultaInfo);

      const createdConsulta = await this.consultaRepository.save(consulta);
      createdConsultas.push(createdConsulta);
    }
    return createdConsultas;
  }

  public async findAllAppointment(): Promise<Consulta[]> {
    return await this.consultaRepository.find();
  }

  public async findAllPaidAppointment(): Promise<Consulta[]> {
    return await this.consultaRepository.find({
      where: {
        situacaoDoPagamento: true,
      },
    });
  }

  public async findAllUnPaidAppointment(): Promise<Consulta[]> {
    return await this.consultaRepository.find({
      where: {
        situacaoDoPagamento: false,
      },
    });
  }
}
