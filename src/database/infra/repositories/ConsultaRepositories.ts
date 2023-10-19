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
  IFilterConsulta,
  IRequestDayPatient,
  IRequestMonth,
  IRequestMonthPatient,
} from 'src/common/types/types';
import { endOfDay, startOfDay, isBefore } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
const saoPauloTimeZone = 'America/Sao_Paulo';

@Injectable()
export class ConsultaRepository implements IConsultaRepository {
  constructor(
    @InjectRepository(Consulta)
    private readonly consultaRepository: Repository<Consulta>,
    @InjectRepository(Patient)
    private readonly userRepository: Repository<Patient>,
  ) {}

  async findAll(filters: IFilterConsulta): Promise<Consulta[]> {
    const {
      patient_name,
      servicos,
      convenio,
      preco,
      situacaoDoPagamento,
      estado,
      startDate,
      endDate,
    } = filters;

    const saoPauloTimeZone = 'America/Sao_Paulo';
    const start = utcToZonedTime(
      startOfDay(new Date(startDate)),
      saoPauloTimeZone,
    );
    const end = utcToZonedTime(endOfDay(new Date(endDate)), saoPauloTimeZone);

    const query = this.consultaRepository
      .createQueryBuilder('consulta')
      .leftJoinAndSelect('consulta.patient', 'patient');

    if (startDate && endDate) {
      query.andWhere('consulta.date BETWEEN :start AND :end', { start, end });
    }
    if (patient_name) {
      query.andWhere('patient.name ILike :patient_name', {
        patient_name: `%${patient_name}%`,
      });
    }
    if (servicos) {
      query.andWhere('consulta.servicos = :servicos', { servicos });
    }
    if (convenio) {
      query.andWhere('consulta.convenio = :convenio', { convenio });
    }
    if (preco) {
      query.andWhere('consulta.preco = :preco', { preco });
    }
    if (situacaoDoPagamento !== undefined) {
      query.andWhere('consulta.situacaoDoPagamento = :situacaoDoPagamento', {
        situacaoDoPagamento,
      });
    }
    if (estado) {
      query.andWhere('consulta.estado = :estado', { estado });
    }

    return await query.getMany();
  }
  public async createConsultas(
    consultasData: createConsultaSwagger[],
  ): Promise<Consulta[]> {
    const consultasImportadas = [];

    for (const consultaData of consultasData) {
      const appointmentDate = utcToZonedTime(
        new Date(consultaData.data),
        saoPauloTimeZone,
      );

      if (
        isBefore(appointmentDate, utcToZonedTime(Date.now(), saoPauloTimeZone))
      ) {
        throw handleError(new Error('Agendamentos com datas passadas'));
      }
    }

    for (const consultaData of consultasData) {
      const appointmentDate = utcToZonedTime(
        new Date(consultaData.data),
        saoPauloTimeZone,
      );

      if (
        isBefore(appointmentDate, utcToZonedTime(Date.now(), saoPauloTimeZone))
      ) {
        throw handleError(new Error('Agendamentos com datas passadas'));
      }
    }

    for (const consultaData of consultasData) {
      const { patient_name, ...consultaInfo } = consultaData;

      const getConsulta = await this.consultaRepository.findOne({
        where: {
          patient: {
            name: patient_name,
          },
          convenio: consultaInfo.convenio,
          servicos: consultaInfo.servicos,
          date: consultaInfo.data,
          preco: consultaInfo.preco,
        },
        relations: ['patient'],
      });

      if (getConsulta) {
        continue;
      }

      const user = await this.userRepository.findOne({
        where: {
          name: patient_name,
        },
      });

      if (user) {
        const consulta = new Consulta();

        consulta.patient = user;
        Object.assign(consulta, consultaInfo);
        console.log('====================================');
        console.log('Tem usuário -->', consulta);
        console.log('====================================');
        const createdConsulta = await this.consultaRepository.save(consulta);
        delete createdConsulta.patient.accepted;
        delete createdConsulta.patient.is_first_time;
        delete createdConsulta.patient.active;
        delete createdConsulta.patient.refreshToken;
        consultasImportadas.push(createdConsulta);
      }

      if (!user) {
        const hashPassword = await bcrypt.hash(uuid(), 10);

        const newUser = new Patient();
        newUser.name = patient_name;
        newUser.role = Role.PATIENT;
        newUser.password = hashPassword;
        const createdUser = await this.userRepository.save(newUser);

        const consulta = new Consulta();

        consulta.patient = createdUser;
        Object.assign(consulta, consultaInfo);

        console.log('====================================');
        console.log('não tem usuário -->', consulta);
        console.log('====================================');
        const createdConsulta = await this.consultaRepository.save(consulta);
        delete createdConsulta.patient.accepted;
        delete createdConsulta.patient.is_first_time;
        delete createdConsulta.patient.active;
        delete createdConsulta.patient.refreshToken;
        consultasImportadas.push(createdConsulta);
      }
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
