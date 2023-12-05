import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ClienteDTO } from 'src/common/doc/paymentBoletoSwagger';
import { PaymentSwagger } from 'src/common/doc/paymentSwagger';
import Consulta, { TypePayment } from 'src/database/typeorm/Consulta.entities';
import Transacao from 'src/database/typeorm/Transacao.entities';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Consulta)
    private readonly consultaRepository: Repository<Consulta>,
    @InjectRepository(Transacao)
    private readonly transactionRepository: Repository<Transacao>,
  ) {}

  private async authenticateWithContself(): Promise<string> {
    const loginUser = {
      username: process.env.USER_CONTSELF,
      password: process.env.PASSWORD_CONTSELF,
    };

    // const loginUser = {
    //   username: 'medicoteste@contself.com.br',
    //   password: 'med123',
    // };

    try {
      const response = await axios.post(
        'https://app.contself.com.br/ApiMobile/Login',
        loginUser,
      );

      // const response = await axios.post(
      //   'http://apphml.contself.com.br/ApiMobile/Login',
      //   loginUser,
      // );

      console.log(response.data);

      return response.data.Token;
    } catch (error) {
      throw new Error('Erro na autenticação com Contself');
    }
  }

  private async sendPaymentRequest(
    authToken: string,
    paymentPayload: PaymentSwagger,
    keyERP: string,
  ): Promise<AxiosResponse> {
    const URL_PAYMENT_CONTSELF = `https://app.contself.com.br/ApiEcommerce/SolicitaPagamentoTransparente?ChavePessoa=${process.env.CHAVE_PESSOA}&chaveERP=${keyERP}`;
    //const URL_PAYMENT_CONTSELF_TEST = `http://apphml.contself.com.br/ApiEcommerce/SolicitaPagamentoTransparente?ChavePessoa=f6ed13da-a4e5-4bc0-965e-df2a67d2e59e&chaveERP=${keyERP}`;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authToken}`,
    };

    try {
      return await axios.post(URL_PAYMENT_CONTSELF, paymentPayload, {
        headers,
      });
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        console.log('Status:', axiosError.response.status);
        console.log('Data:', axiosError.response.data);
        console.log('Headers:', axiosError.response.headers);
      } else if (axiosError.request) {
        console.log('Request:', axiosError.request);
      } else {
        console.error('Error:', axiosError.message);
      }
      throw new Error('Erro ao enviar solicitação de pagamento para Contself');
    }
  }

  async makePayment(
    user_id: string,
    appointment_id: string,
    data: PaymentSwagger,
  ) {
    const appointment = await this.findAppointmentValidation(
      user_id,
      appointment_id,
    );

    const keyERP = uuidv4(); // Gera um UUID para a chave ERP
    const authToken = await this.authenticateWithContself();

    const paymentPayload: PaymentSwagger = {
      urlretorno: data.urlretorno,
      chaveerp: keyERP,
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
      const response = await this.sendPaymentRequest(
        authToken,
        paymentPayload,
        keyERP,
      );

      const transacaoData = response.data;

      if (transacaoData?.descricaoStatusTransacao === 'Não aprovada') {
        throw new BadRequestException('Pagamento não Aprovado');
      }

      const transacao = new Transacao();
      transacao.infoPayment = transacaoData;

      if (!appointment.transacao) {
        transacao.consulta = appointment;
      }

      await this.transactionRepository.save(transacao);

      appointment.type = TypePayment.CARD;
      appointment.chaveERP = keyERP;
      appointment.situacaoDoPagamento = transacaoData ? true : false;
      appointment.transacao = transacao;

      await this.consultaRepository.save(appointment);

      const result = await this.findAppointmentStatus(user_id, appointment_id);
      return result;
    } catch (error) {
      console.log(error);

      throw new HttpException(
        {
          error: 'Erro ao processar pagamento',
          message: error?.response?.data,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

    const URL_INQUIRY_CONTSELF = `https://app.contself.com.br/ApiEcommerce/ConsultaPagamento?ChavePessoa=${process.env.CHAVE_PESSOA}&ChaveERP=${findAppointment?.chaveERP}`;

    let AuthToken: any;

    const LoginUser = {
      username: process.env.USER_CONTSELF,
      password: process.env.PASSWORD_CONTSELF,
    };

    try {
      const login = await axios.post(
        'https://app.contself.com.br/ApiMobile/Login',
        LoginUser,
      );

      AuthToken = login.data.Token;

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${AuthToken}`,
      };

      const response = await axios.get(URL_INQUIRY_CONTSELF, {
        headers,
      });

      const transacaoData: AxiosResponse = response?.data;

      if (transacaoData) {
        return response?.data?.descricaostatustransacao;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error) {
        console.log('Erro:', error.message);
      } else {
        console.error('Erro:', error);
      }
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

  async emiteBoleto(user_id: string, appointment_id: string, data: ClienteDTO) {
    const appointment = await this.findAppointmentStatus(
      user_id,
      appointment_id,
    );

    if (!appointment) {
      throw new BadRequestException('Agendamento não encontrado');
    }

    let AuthToken: any;

    const LoginUser = {
      username: process.env.USER_CONTSELF,
      password: process.env.PASSWORD_CONTSELF,
    };

    try {
      const login = await axios.post(
        'https://app.contself.com.br/ApiMobile/Login',
        LoginUser,
      );

      AuthToken = login.data.Token;
    } catch (err) {
      throw new err();
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${AuthToken}`,
    };

    const URL_BOLETO_CONTSELF = `http://apiecommerce.contself.com.br/ApiBoleto/EmiteBoleto`;

    const paymentPayload: ClienteDTO = {
      urlretorno: ``,
      chavepessoa: process.env.CHAVE_PESSOA,
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
      boleto_datavencimento: data.boleto_datavencimento,
      boleto_taxamulta: data.boleto_taxamulta,
      boleto_taxamora: data.boleto_taxamora,
    };

    try {
      const response = await axios.post(URL_BOLETO_CONTSELF, paymentPayload, {
        headers,
      });

      if (response.data) {
        const transacaoData = response.data;
        return transacaoData;
      }
    } catch (error) {
      throw new HttpException(
        {
          error: 'Erro ao processar pagamento',
          message: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

    const URL_FIND_BOLETO_CONTSELF = `http://app.contself.com.br/ApiEcommerce/ConsultaBoleto?&ChavePessoa=${process.env.CHAVE_PESSOA}&ChaveERP=${appointment.chaveERP}`;

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

  public async cancelPayment(user_id: string, appointment_id: string) {
    const appointment = await this.consultaRepository.findOne({
      where: {
        id: appointment_id,
        patient_name: user_id,
      },
    });

    if (!appointment) {
      throw new BadRequestException('Agendamento não encontrado');
    }

    let AuthToken: any;

    const LoginUser = {
      username: process.env.USER_CONTSELF,
      password: process.env.PASSWORD_CONTSELF,
    };

    try {
      const login = await axios.post(
        'https://app.contself.com.br/ApiMobile/Login',
        LoginUser,
      );

      AuthToken = login.data.Token;
    } catch (error) {
      throw error;
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${AuthToken}`,
    };

    const URL_DELETE_PAYMENT_CONTSELF = `http://apphml.contself.com.br/ApiEcommerce/CancelaPagamento?ChavePessoa=${process.env.CHAVE_PESSOA}&ChaveERP=${appointment?.chaveERP}`;

    try {
      const response = await axios.get(URL_DELETE_PAYMENT_CONTSELF, {
        headers,
      });

      const transacaoData: AxiosResponse = response.data;

      if (transacaoData) {
        return transacaoData;
      }
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
}
