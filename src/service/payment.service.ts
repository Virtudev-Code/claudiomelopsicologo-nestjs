import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosResponse } from 'axios';
import { URL_PAYMENT_CONTSELF } from 'src/common/constant/constants';
import { PaymentSwagger } from 'src/common/doc/paymentSwagger';
import Consulta, { TypePayment } from 'src/database/typeorm/Consulta.entities';
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

  async makePayment(
    user_id: string,
    appointment_id: string,
    data: PaymentSwagger,
  ): Promise<Consulta> {
    const appointment = await this.findAppointmentValidation(
      user_id,
      appointment_id,
    );

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
        const transacaoData: AxiosResponse = response.data;

        try {
          const transacao = new Transacao();
          transacao.infoPayment = transacaoData;

          if (!appointment.transacao) {
            transacao.consulta = appointment;
          }

          await this.transactionRepository.save(transacao);

          appointment.type = TypePayment.CARD;
          appointment.situacaoDoPagamento = true;
          appointment.transacao = transacao;

          await this.consultaRepository.save(appointment);

          const result = await this.findAppointmentStatus(
            user_id,
            appointment_id,
          );

          return result;
        } catch (error) {
          throw error;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  public async paymentInquiry(user_id: string, appointment_id: string) {
    const findAppointment = await this.consultaRepository.findOne({
      where: {
        id: appointment_id,
        patient: {
          id: user_id,
        },
      },
      relations: ['transacao'],
    });

    if (!findAppointment) {
      throw new BadRequestException('Appointment do not exists');
    }

    const URL_INQUIRY_CONTSELF = `http://apphml.contself.com.br/ApiEcommerce/ConsultaPagamento?&ChavePessoa=${process.env.CHAVE_PESSOA}&ChaveERP=${findAppointment.chaveERP}`;

    const AuthToken = `fKW9LXv8BJBCVFuZvO3q6uh1YV/5NhEjvbUa1kLHj4LqWhZFZhlVFVEZRlk8PRyt`;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${AuthToken}`,
    };

    try {
      const response = await axios.get(URL_INQUIRY_CONTSELF, {
        headers,
      });

      const transacaoData: AxiosResponse = response.data;

      if (transacaoData) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async cancelPay(user_id: string, appointment_id: string) {
    const findAppointment = await this.consultaRepository.findOne({
      where: {
        id: appointment_id,
        patient: {
          id: user_id,
        },
      },
      relations: ['transacao'],
    });

    if (!findAppointment) {
      throw new BadRequestException('Appointment do not exists');
    }

    const URL_CANCEL_CONTSELF = `http://apphml.contself.com.br/ApiEcommerce/CancelaPagamento?&ChavePessoa=${process.env.CHAVE_PESSOA}&ChaveERP=${findAppointment.chaveERP}`;

    const AuthToken = `fKW9LXv8BJBCVFuZvO3q6uh1YV/5NhEjvbUa1kLHj4LqWhZFZhlVFVEZRlk8PRyt`;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${AuthToken}`,
    };

    try {
      const response = await axios.get(URL_CANCEL_CONTSELF, {
        headers,
      });

      const transacaoData: AxiosResponse = response.data;

      if (transacaoData) {
        try {
          findAppointment.situacaoDoPagamento = false;
          findAppointment.transacao.cancelPayment = transacaoData;

          await this.consultaRepository.save(findAppointment);

          return transacaoData;
        } catch (error) {
          throw error;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  public async findAppointmentValidation(
    user_id: string,
    appointment_id: string,
  ) {
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

    if (appointment.situacaoDoPagamento === true) {
      throw new BadRequestException('Pagamento já foi concluido');
    }

    return appointment;
  }

  public async findAppointmentStatus(user_id: string, appointment_id: string) {
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

  async updateStatusPayment(
    user_id: string,
    appointment_id: string,
    status: boolean,
  ): Promise<Consulta> {
    const appointment = await this.findAppointmentStatus(
      user_id,
      appointment_id,
    );

    if (!appointment) {
      throw new BadRequestException('Agendamento não encontrado');
    }

    appointment.type = TypePayment.OUTRO;
    appointment.situacaoDoPagamento = status;
    await this.consultaRepository.save(appointment);

    return appointment;
  }

  async emiteBoleto(user_id: string, appointment_id: string, data: any) {
    const appointment = await this.findAppointmentStatus(
      user_id,
      appointment_id,
    );

    if (!appointment) {
      throw new BadRequestException('Agendamento não encontrado');
    }

    const AuthToken = `fKW9LXv8BJBCVFuZvO3q6uh1YV/5NhEjvbUa1kLHj4LqWhZFZhlVFVEZRlk8PRyt`;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${AuthToken}`,
    };

    const URL_BOLETO_CONTSELF = `http://apiecommerce.contself.com.br/ApiBoleto/EmiteBoleto`;

    const paymentPayload = {
      urlretorno: `https://www.urlcliente.com.br?chaveerp=${appointment.chaveERP}`,
      chavepessoa: process.env.chaveERP,
      chaveerp: appointment.chaveERP,
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
      const response = await axios.post(URL_BOLETO_CONTSELF, paymentPayload, {
        headers,
      });

      if (response.data) {
        const transacaoData: AxiosResponse = response.data;
        return transacaoData;
      }
    } catch (error) {
      throw error;
    }
  }

  async consultaBoleto(user_id: string, appointment_id: string) {
    const appointment = await this.findAppointmentStatus(
      user_id,
      appointment_id,
    );

    if (!appointment) {
      throw new BadRequestException('Agendamento não encontrado');
    }

    const URL_FIND_BOLETO_CONTSELF = `http://apphml.contself.com.br/ApiEcommerce/ConsultaBoleto?&ChavePessoa=${process.env.CHAVE_PESSOA}&ChaveERP=${appointment.chaveERP}`;

    const AuthToken = `fKW9LXv8BJBCVFuZvO3q6uh1YV/5NhEjvbUa1kLHj4LqWhZFZhlVFVEZRlk8PRyt`;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${AuthToken}`,
    };

    try {
      const response = await axios.get(URL_FIND_BOLETO_CONTSELF, {
        headers,
      });

      const transacaoData: AxiosResponse = response.data;

      if (transacaoData) {
        return transacaoData;
      }
    } catch (error) {
      throw error;
    }
  }
}
