/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosResponse } from 'axios';
import {
  URL_CANCEL_PAYMENT_CONTSELF,
  URL_PAYMENT_CONTSELF,
} from 'src/common/constant/constants';
import { PaymentSwagger } from 'src/common/doc/paymentSwagger';
import Consulta from 'src/database/typeorm/Consulta.entities';
import Transacao from 'src/database/typeorm/Transacao.entities';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Consulta)
    private readonly consultaRepository: Repository<Consulta>,
    @InjectRepository(Transacao)
    private readonly transactionRepository: Repository<Transacao>,
  ) {}

  public async findAppointment(user_id: string, appointment_id: string) {
    const appointment = await this.consultaRepository.findOne({
      where: {
        id: appointment_id,
        patient: {
          id: user_id,
        },
      },
      relations: ['transacao'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with id: ${user_id} not found`);
    }

    if (
      appointment.transacao &&
      typeof appointment.transacao.infoPayment === 'string'
    ) {
      appointment.transacao.infoPayment = JSON.parse(
        appointment.transacao.infoPayment,
      );
    }

    return appointment;
  }

  async returnPayment(
    user_id: string,
    appointment_id: string,
  ): Promise<Consulta> {
    if (!appointment_id) {
      throw new BadRequestException('Agendamento não encontrado');
    }

    const appointment = await this.findAppointment(user_id, appointment_id);

    if (appointment.situacaoDoPagamento === true) {
      throw new BadRequestException('Pagamento já foi concluído');
    }

    const AuthToken = `fKW9LXv8BJBCVFuZvO3q6uh1YV/5NhEjvbUa1kLHj4LqWhZFZhlVFVEZRlk8PRyt`;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${AuthToken}`,
    };

    try {
      const response = await axios.get(URL_CANCEL_PAYMENT_CONTSELF, {
        headers,
      });

      if (response.data) {
        const cancelData: AxiosResponse = response.data; // Dados do CANCELAMENTO recebidos

        try {
          if (!appointment.transacao) {
            appointment.transacao = new Transacao();
          }

          appointment.transacao.cancelPayment = cancelData;

          await this.consultaRepository.save(appointment);

          const result = await this.findAppointment(user_id, appointment_id);

          return result;
        } catch (error) {
          throw error;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async cancelPayment(
    user_id: string,
    appointment_id: string,
  ): Promise<Consulta> {
    if (!appointment_id) {
      throw new BadRequestException('Agendamento não encontrado');
    }

    const appointment = await this.findAppointment(user_id, appointment_id);

    if (appointment.situacaoDoPagamento === true) {
      throw new BadRequestException('Pagamento já foi concluído');
    }

    const AuthToken = `fKW9LXv8BJBCVFuZvO3q6uh1YV/5NhEjvbUa1kLHj4LqWhZFZhlVFVEZRlk8PRyt`;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${AuthToken}`,
    };

    try {
      const response = await axios.get(URL_CANCEL_PAYMENT_CONTSELF, {
        headers,
      });

      if (response.data) {
        const cancelData: AxiosResponse = response.data; // Dados do CANCELAMENTO recebidos

        try {
          if (!appointment.transacao) {
            appointment.transacao = new Transacao();
          }

          appointment.transacao.cancelPayment = cancelData;

          await this.consultaRepository.save(appointment);

          const result = await this.findAppointment(user_id, appointment_id);

          return result;
        } catch (error) {
          throw error;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async makePayment(
    user_id: string,
    appointment_id: string,
    data: PaymentSwagger,
  ): Promise<Consulta> {
    if (!appointment_id) {
      throw new BadRequestException('Agendamento não encontrado');
    }

    const appointment = await this.findAppointment(user_id, appointment_id);

    if (appointment.situacaoDoPagamento === true) {
      throw new BadRequestException('Pagamento já foi concluido');
    }

    const AuthToken = `fKW9LXv8BJBCVFuZvO3q6uh1YV/5NhEjvbUa1kLHj4LqWhZFZhlVFVEZRlk8PRyt`;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${AuthToken}`,
    };

    const paymentPayload: PaymentSwagger = {
      urlretorno: data.urlretorno,
      chaveerp: data.chaveerp,
      valor: data.valor,
      numeroparcela: data.numeroparcela,
      nome: data.nome,
      identificador: data.identificador,
      email: data.email,
      telefone: data.telefone,
      uf: data.uf,
      cidade: data.cidade,
      logradouro: data.logradouro,
      bairro: data.bairro,
      numero: data.numero,
      complemento: data.complemento,
      cep: data.cep,
      nomebeneficiario: data.nomebeneficiario,
      cpfbeneficiario: data.cpfbeneficiario,
      listadivisao: data.listadivisao,
      permitepagamentocartao: data.permitepagamentocartao,
      permitepagamentoboleto: data.permitepagamentoboleto,
      permitepagamentodebito: data.permitepagamentodebito,
      permitepagamentopix: data.permitepagamentopix,
      tokenizacartao: data.tokenizacartao,
      cartaonome: data.cartaonome,
      cartaonumero: data.cartaonumero,
      cartaovencimento: data.cartaovencimento,
      cartaocodigoseguranca: data.cartaocodigoseguranca,
      ippagamento: data.ippagamento,
    };

    try {
      const response = await axios.post(URL_PAYMENT_CONTSELF, paymentPayload, {
        headers,
      });

      if (response.data) {
        const transacaoData: AxiosResponse = response.data; // Dados da transação recebidos

        try {
          const transacao = new Transacao();
          transacao.infoPayment = transacaoData; // Convert to JSON string

          if (!appointment.transacao) {
            transacao.consulta = appointment;
          }

          await this.transactionRepository.save(transacao);

          appointment.situacaoDoPagamento = true;
          appointment.transacao = transacao; // Atualizar a referência no appointment

          await this.consultaRepository.save(appointment);

          const result = await this.findAppointment(user_id, appointment_id);

          return result;
        } catch (error) {
          throw error;
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
