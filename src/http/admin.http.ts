import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Get,
  Put,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Routes } from 'src/common/constant/constants';
import { Roles } from 'src/common/decorators/role.decorator';
import { createAdminSwagger } from 'src/common/doc/createAdminSwagger';
import { createPatientSwagger } from 'src/common/doc/createPatientSwagger';
import { updatePatientSwagger } from 'src/common/doc/updatePatientSwagger';
import { Role } from 'src/common/enum/enum';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/common/guards/auth.guard';
import Patient from 'src/database/typeorm/Patient.entities';
import { AdminService } from 'src/service/admin.service';

@ApiTags(Routes.ADMIN)
@Controller(Routes.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UsePipes(ValidationPipe)
  @Post('/creat-admin')
  @ApiOperation({
    summary: 'Cria um Paciente através do Admin Autenticado',
  })
  async createAdmin(@Body() data: createAdminSwagger): Promise<Patient> {
    return await this.adminService.createAdmin(data);
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.PATIENT)
  @Post('/creat-patient')
  @ApiOperation({
    summary: 'Cria um Paciente através do Admin Autenticado',
  })
  async createPatient(@Body() data: createPatientSwagger): Promise<Patient> {
    return await this.adminService.createPatient(data);
  }

  @Get('/find-patient/:email')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Retorna um Paciente pelo e-mail',
    description: 'Esta Rota retorna um Paciente pelo e-mail',
  })
  async findPatientByEmail(@Param('email') email: string): Promise<Patient> {
    return await this.adminService.findPatientByEmail(email);
  }

  @Get('/find-patient/:id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Retorna um Paciente pelo Id',
    description: 'Esta Rota retorna um Paciente pelo Id',
  })
  async getUserById(@Param('id') id: string): Promise<Patient> {
    return await this.adminService.findPatientById(id);
  }

  @Get('/find-patients')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Retorna todos os pacientes, somente admin tem acesso',
    description:
      'Esta Rota retorna todos os pacientes.Somente admin tem acesso',
  })
  async getAllPatients(): Promise<Patient[]> {
    return await this.adminService.getAllPatients();
  }

  @Put('/update-patient/:id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Atualiza um paciente através do Id',
    description: 'Esta Rota atualiza um paciente através do Id',
  })
  async updateOnePatient(
    @Param('id') id: string,
    @Body() data: updatePatientSwagger,
  ): Promise<Patient> {
    return await this.adminService.updateOnePatient(id, data);
  }

  @Get('/find-patients-without-email')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Retorna todos os pacientes sem e-mail, somente admin tem acesso',
    description:
      'Esta Rota retorna todos os pacientes sem e-mail. Somente admin tem acesso',
  })
  async getPatientWithoutEmail(): Promise<Patient[]> {
    return await this.adminService.getPatientWithoutEmail();
  }

  @Put('/update-patient-without-email/:id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Atualiza paciente sem email, e manda a confirmação no email dele',
  })
  async updatePatientWithoutEmail(
    @Param('id') id: string,
    @Body() patient: any,
  ): Promise<Patient> {
    return await this.adminService.updatePatientWithoutEmail({ id, patient });
  }
}
