import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import Consulta from 'src/database/typeorm/Consulta.entities';
import { createConsultaSwagger } from 'src/common/doc/createConsultaSwagger';
import IConsultaRepository from '../interfaces/IConsultaRepository';
import Patient from 'src/database/typeorm/Patient.entities';
import { Role } from 'src/common/enum/enum';
import { handleError } from 'src/shared/error/handle-error.util';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import {
  IRequestDayPatient,
  IRequestMonth,
  IRequestMonthPatient,
} from 'src/common/types/types';
import { endOfDay, startOfDay, isBefore } from 'date-fns';

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
    const consultasImportadas = [];

    for (const consultaData of consultasData) {
      const appointmentDate = new Date(consultaData.data);

      if (isBefore(appointmentDate, Date.now())) {
        throw handleError(new Error('Agendamentos com datas passadas'));
      }
    }

    for (const consultaData of consultasData) {
      const appointmentDate = new Date(consultaData.data);

      if (isBefore(appointmentDate, Date.now())) {
        throw handleError(new Error('Agendamentos com datas passadas'));
      }
    }

    for (const consultaData of consultasData) {
      const { patient_name, ...consultaInfo } = consultaData;

      const user = await this.userRepository.findOne({
        where: {
          name: patient_name,
        },
      });

      delete user.accepted;
      delete user.refreshToken;
      delete user.active;
      delete user.is_first_time;

      if (!user) {
        const hashPassword = await bcrypt.hash(uuid(), 10);

        const newUser = new Patient();
        newUser.name = patient_name;
        newUser.role = Role.PATIENT;
        newUser.password = hashPassword;

        const consulta = new Consulta();
        consulta.patient = newUser;
        Object.assign(consulta, consultaInfo);
        const createdConsulta = await this.consultaRepository.save(consulta);
        consultasImportadas.push(createdConsulta);
      }

      const consulta = new Consulta();
      consulta.patient = user;
      Object.assign(consulta, consultaInfo);
      const createdConsulta = await this.consultaRepository.save(consulta);
      consultasImportadas.push(createdConsulta);
    }

    return consultasImportadas;
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

  async getTotalValueByMonth(month: number, year: number): Promise<number> {
    // Primeiro dia do mês
    const startDate = new Date(year, month - 1, 1);
    // Último dia do mês
    const endDate = new Date(year, month, 0);

    const consultas = await this.consultaRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
    });

    // Calcular o valor total das consultas do mês
    const totalValue = consultas.reduce(
      (total: number, consulta: Consulta) => total + parseFloat(consulta.preco),
      0,
    );

    return totalValue;
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

  async findOne(name: string): Promise<Patient> {
    const user = await this.userRepository.findOne({
      where: {
        name,
      },
    });

    delete user.refreshToken;
    delete user.is_first_time;
    delete user.accepted;
    delete user.active;

    return user;
  }
}
