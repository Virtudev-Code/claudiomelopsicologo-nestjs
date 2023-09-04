import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedUser } from 'src/common/decorators/user.decorator';
import { Throttle } from '@nestjs/throttler';
import { Routes } from 'src/common/constant/constants';
import { RolesGuard } from 'src/common/guards/auth.guard';
import { Role } from 'src/common/enum/enum';
import { Roles } from 'src/common/decorators/role.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { PaymentSwagger } from 'src/common/doc/paymentSwagger';
import { PaymentService } from 'src/service/payment.service';
import Patient from 'src/database/typeorm/Patient.entities';

@ApiTags(Routes.PAYMENT)
@Controller(Routes.PAYMENT)
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/test/:id')
  @Roles(Role.PATIENT)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({
    summary:
      'Busca as informações de uma transação de um User através do id do agendamento',
  })
  async find(@LoggedUser() user: Patient, @Param('id') id: string) {
    console.log(id);

    const info = await this.paymentService.findAppointment(user.id, id);

    return info;
  }

  @Throttle(30, 60) // Permite no máximo 30 solicitações a cada 60 segundos
  @Post('/makePay/:appointmen_id')
  @Roles(Role.PATIENT)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({
    summary: 'Realizar pagamentos para a Api da Contself',
  })
  async makePayment(
    @LoggedUser() user: Patient,
    @Body() data: PaymentSwagger,
    @Param('appointmen_id') appointmen_id: string,
  ) {
    const payment = await this.paymentService.makePayment(
      user.id,
      appointmen_id,
      data,
    );

    return payment;
  }

  @Post('/urlRetornoContself')
  @ApiOperation({
    summary: 'Retorna o histórico de atendimento do Doutor ',
  })
  async infoReturnPay(@Body() data: any) {
    console.log(data);
  }

  @Get('/cancelPay/:id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.PATIENT)
  @ApiOperation({
    summary: 'Cancela o Pagamento de um Agendamento',
  })
  async cancelPay(
    @LoggedUser() user: Patient,
    @Param('id') patient_id: string,
  ) {
    return this.paymentService.cancelPayment(user.id, patient_id);
  }
}
