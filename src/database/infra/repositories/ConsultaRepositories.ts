import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import Consulta from 'src/database/typeorm/Consulta.entities';
import { createConsultaSwagger } from 'src/common/doc/createConsultaSwagger';
import IConsultaRepository from '../interfaces/IConsultaRepository';
import Patient from 'src/database/typeorm/Patient.entities';
import { Role } from 'src/common/enum/enum';
import { handleError } from 'src/shared/error/handle-error.util';
import { isBefore } from 'date-fns';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import {
  IRequestDayPatient,
  IRequestMonth,
  IRequestMonthPatient,
} from 'src/common/types/types';
import { endOfDay, startOfDay } from 'date-fns';

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
        const hashPassword = await bcrypt.hash(uuid(), 10);

        user = new Patient();
        user.name = patient_name;
        user.role = Role.PATIENT;
        user.password = hashPassword;
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

  public async findAppointmentByPage(id: number): Promise<Consulta[]> {
    const take = 5;
    const skip = (id - 1) * id;
    return await this.consultaRepository.find({
      relations: ['patient'],
      take,
      skip,
      order: {
        created_at: 'ASC',
      },
    });
  }

  public async deleteAppointment(id: string): Promise<void> {
    const consulta = await this.consultaRepository.findOne({
      where: {
        id,
      },
    });

    if (!consulta) {
      throw new NotFoundException('Appointment not found');
    }

    await this.consultaRepository.remove(consulta);
  }

  public async findAllAppointment(): Promise<Consulta[]> {
    return await this.consultaRepository.find({
      relations: ['patient'],
    });
  }

  public async findAllPaidAppointment(): Promise<Consulta[]> {
    return await this.consultaRepository.find({
      where: {
        situacaoDoPagamento: true,
      },
      relations: ['patient'],
    });
  }

  public async findAllUnPaidAppointment(): Promise<Consulta[]> {
    return await this.consultaRepository.find({
      where: {
        situacaoDoPagamento: false,
      },
      relations: ['patient'],
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

  public async getCountAndTotalValueByMonth(): Promise<any[]> {
    const query = `
      SELECT
        EXTRACT(YEAR FROM date) as year,
        EXTRACT(MONTH FROM date) as month,
        COUNT(*) as count,
        SUM(CAST(preco AS numeric)) as totalValue
      FROM
        consulta
      WHERE
        date IS NOT NULL
      GROUP BY
        year, month
      ORDER BY
        year, month
    `;

    const result = await this.consultaRepository.query(query);
    return result;
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
}
