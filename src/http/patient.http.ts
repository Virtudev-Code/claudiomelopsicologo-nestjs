import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Routes } from 'src/common/constant/constants';
import { PatientService } from 'src/service/patient.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/common/guards/auth.guard';
import { Role } from 'src/common/enum/enum';
import { Roles } from 'src/common/decorators/role.decorator';
import Consulta from 'src/database/typeorm/Consulta.entities';
import { LoggedUser } from 'src/common/decorators/user.decorator';
import Patient from 'src/database/typeorm/Patient.entities';

@ApiTags(Routes.PATIENT)
@Controller(Routes.PATIENT)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.PATIENT)
  @Get('/my-Appointments')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retorna o histórico de agendamentos de Paciente autenticado',
    description:
      'Esta Rota retorna o histórico de agendamentos de Paciente autenticado.',
  })
  async myAppointments(@LoggedUser() patient: Patient): Promise<Consulta[]> {
    return await this.patientService.myAppointments(patient.id);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.PATIENT)
  @ApiBearerAuth()
  @Get('/my-PaidAppointments')
  @ApiOperation({
    summary:
      'Retorna o histórico de agendamentos pagos de um Paciente autenticado',
    description:
      'Esta Rota retorna o histórico de agendamentos pagos de um Paciente autenticado.',
  })
  async myPaidAppointments(
    @LoggedUser() patient: Patient,
  ): Promise<Consulta[]> {
    return await this.patientService.myPaidAppointments(patient.id);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.PATIENT)
  @Get('/my-UnPaidAppointments')
  @ApiOperation({
    summary:
      'Retorna o histórico de agendamentos não pagos de Paciente autenticado',
    description:
      'Esta Rota retorna o histórico de agendamentos não pagos de Paciente autenticado.',
  })
  async myUnPaidAppointments(
    @LoggedUser() patient: Patient,
  ): Promise<Consulta[]> {
    return await this.patientService.myUnPaidAppointments(patient.id);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.PATIENT)
  @Get('Appointment/:id')
  @ApiOperation({
    summary:
      'Retorna o histórico de agendamentos não pagos de Paciente autenticado',
    description:
      'Esta Rota retorna o histórico de agendamentos não pagos de Paciente autenticado.',
  })
  async findAppointmentById(
    @Param('id') id: string,
    @LoggedUser() patient: Patient,
  ): Promise<Consulta> {
    return await this.patientService.findAppointmentById(id, patient.id);
  }
}
