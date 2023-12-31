import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedUser } from 'src/common/decorators/user.decorator';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { Routes } from 'src/common/constant/constants';
import { RolesGuard } from 'src/common/guards/auth.guard';
import { Role } from 'src/common/enum/enum';
import { Roles } from 'src/common/decorators/role.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import {
  PaymentSwagger,
  StatusPaymentSwagger,
} from 'src/common/doc/paymentSwagger';
import { PaymentService } from 'src/service/payment.service';
import Patient from 'src/database/typeorm/Patient.entities';
import { ClienteDTO } from 'src/common/doc/paymentBoletoSwagger';

@ApiTags(Routes.PAYMENT)
@Controller(Routes.PAYMENT)
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // @Throttle(30, 60) // Permite no máximo 30 solicitações a cada 60 segundos
  @SkipThrottle(true)
  @Post('/makePay/:appointment_id')
  @Roles(Role.PATIENT)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({
    summary: 'Realizar pagamentos para a Api da Contself',
  })
  async makePayment(
    @LoggedUser() user: Patient,
    @Body() data: PaymentSwagger,
    @Param('appointment_id') appointment_id: string,
  ) {
    const payment = await this.paymentService.makePayment(
      user.id,
      appointment_id,
      data,
    );

    return payment;
  }

  @SkipThrottle(true)
  @Delete('/cancelPayment/:appointment_id')
  @Roles(Role.PATIENT)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({
    summary: 'Cancela pagamentos a Api da Contself',
  })
  async cancelPayment(
    @LoggedUser() user: Patient,
    @Param('appointment_id') appointment_id: string,
  ) {
    const payment = await this.paymentService.cancelPayment(
      user.id,
      appointment_id,
    );

    return payment;
  }

  @Get('/paymentInquiry/:id')
  @Roles(Role.PATIENT)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({
    summary:
      'Busca as informações de uma transação de um User através do id do agendamento',
  })
  async paymentInquiry(@LoggedUser() user: Patient, @Param('id') id: string) {
    return await this.paymentService.paymentInquiry(user.id, id);
  }

  // @Get('/cancelPay/:id')
  // @UseGuards(AccessTokenGuard, RolesGuard)
  // @Roles(Role.PATIENT)
  // @ApiOperation({
  //   summary: 'Cancela o Pagamento de um Agendamento',
  // })
  // async cancelPay(
  //   @LoggedUser() user: Patient,
  //   @Param('id') patient_id: string,
  // ) {
  //   return this.paymentService.cancelPay(user.id, patient_id);
  // }

  // @Throttle(30, 60)
  @SkipThrottle(true)
  @Put('/update-status-payment/:appointment_id/:user_id')
  @Roles(Role.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({
    summary:
      'Atualiza o status de pagamento de um paciente, pode mudar para true ou para false',
  })
  async updateStatusPayment(
    @Param('appointment_id') appointment_id: string,
    @Param('user_id') user_id: string,
    @Body() status: StatusPaymentSwagger,
  ) {
    const paymentStatus = await this.paymentService.updateStatusPayment(
      user_id,
      appointment_id,
      status.status,
    );

    return paymentStatus;
  }

  @Post('/urlRetornoContself')
  @ApiOperation({
    summary: 'Retorna o histórico de atendimento do Doutor ',
  })
  async infoReturnPay(@Body() data: any) {
    console.log(data);
  }

  @Post('/emiteBoleto/:id')
  @Roles(Role.PATIENT)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({
    summary: 'API utilizada para realizar requisições de emissão de boleto',
  })
  async emiteBoleto(
    @LoggedUser() user: Patient,
    @Param('id') id: string,
    @Body() data: ClienteDTO,
  ) {
    return await this.paymentService.emiteBoleto(user.id, id, data);
  }

  @Get('/consultaBoleto/:id')
  @Roles(Role.PATIENT)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({
    summary:
      'Busca as informações de uma consulta de um boleto através do id do agendamento',
  })
  async consultaBoleto(@LoggedUser() user: Patient, @Param('id') id: string) {
    return await this.paymentService.consultaBoleto(user.id, id);
  }
}
