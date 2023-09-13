import {
  Controller,
  Post,
  Bind,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Param,
  UseGuards,
  Get,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Routes } from 'src/common/constant/constants';
import { ConsultaService } from 'src/service/consulta.service';
import { createConsultaSwagger } from 'src/common/doc/createConsultaSwagger';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/common/guards/auth.guard';
import * as ExcelJS from 'exceljs';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enum/enum';
import { isBefore } from 'date-fns';
import { parse } from 'date-fns';
import Patient from 'src/database/typeorm/Patient.entities';
import Consulta from 'src/database/typeorm/Consulta.entities';
import { handleError } from 'src/shared/error/handle-error.util';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

@ApiTags(Routes.CONSULTA)
@Controller(Routes.CONSULTA)
@ApiBearerAuth()
export class ConsultaController {
  constructor(private readonly consultaService: ConsultaService) {}

  @UsePipes(ValidationPipe)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('upload')
  @Bind(UploadedFiles())
  @ApiBody({ type: createConsultaSwagger })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Cria um agendamento pelo arquivo Excel.',
  })
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(files: any) {
    const uploadedFile = files[0];

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(uploadedFile.buffer);

    const worksheet = workbook.getWorksheet(1);
    const consultasImportadas = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) {
        const dateCell = row.getCell('A');
        const date =
          dateCell && dateCell.value
            ? parse(dateCell.toString(), 'dd/MM/yyyy', new Date())
            : null;
        const precoCell = row.getCell('E');
        const preco =
          precoCell && precoCell.value
            ? parseFloat(precoCell.toString().replace(',', '.'))
            : null;
        const consulta = {
          date,
          patient_name: row.getCell('B').toString(),
          servicos: row.getCell('C').toString(),
          convenio: row.getCell('D').toString(),
          preco,
          estado: row.getCell('G').toString(),
          comentarios: row.getCell('H').toString(),
          situacaoDoPagamento: false,
        };
        consultasImportadas.push(consulta);
      }
    });

    const createdConsultas = await this.consultaService.createConsultas(
      consultasImportadas,
    );

    return {
      createdConsultas,
    };
  }

  // @UsePipes(ValidationPipe)
  // @Post('import')
  // @Bind(UploadedFiles())
  // //@ApiBody({ type: createConsultaSwagger })
  // @ApiConsumes('multipart/form-data')
  // @ApiOperation({
  //   summary: 'Cria um agendamento pelo arquivo Excel.',
  // })
  // @UseInterceptors(AnyFilesInterceptor())
  // async importExcel(file: any) {
  //   const uploadedFile = file[0];
  //   const workbook = new ExcelJS.Workbook();
  //   await workbook.xlsx.load(uploadedFile.buffer);
  //   const consulta = [];

  //   const worksheet = workbook.getWorksheet(1);

  //   for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
  //     const row = worksheet.getRow(rowNumber);

  //     // Verifique se a célula da coluna A está vazia
  //     const dataCellValue = row.getCell(1).value;
  //     if (!dataCellValue) {
  //       // Se a célula estiver vazia, pule esta linha e vá para a próxima
  //       continue;
  //     }

  //     const valeu = {
  //       date: dataCellValue,
  //       patient_name: row.getCell(2).value,
  //       servicos: row.getCell(3).value,
  //       convenio: row.getCell(4).value,
  //       preco: row.getCell(5).value,
  //       pagamento: row.getCell(6).value,
  //       estado: row.getCell(7).value,
  //       comentarios: row.getCell(8).value,
  //     };

  //     consulta.push(valeu);
  //   }

  //   const createdConsultas = [];
  //   for (const consultaData of consulta) {
  //     const appointmentDate = new Date(consultaData.data);

  //     if (isBefore(appointmentDate, Date.now())) {
  //       throw handleError(new Error('Agendamentos com datas passadas'));
  //     }
  //   }

  //   for (const consultaData of consulta) {
  //     const { patient_name, ...consultaInfo } = consultaData;
  //     console.log(patient_name);

  //     const user = await this.consultaService.findOne(patient_name);

  //     if (!user) {
  //       const hashPassword = await bcrypt.hash(uuid(), 10);

  //       const newUser = new Patient();
  //       newUser.name = patient_name;
  //       newUser.role = Role.PATIENT;
  //       newUser.password = hashPassword;

  //       const consulta = new Consulta();
  //       consulta.patient = newUser;
  //       Object.assign(consulta, consultaInfo);
  //       createdConsultas.push(consulta);
  //     }

  //     const consulta = new Consulta();
  //     consulta.patient = user;
  //     Object.assign(consulta, consultaInfo);
  //     createdConsultas.push(consulta);
  //   }

  //   return createdConsultas;
  // }

  @Get('all/appointment')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Retorna todas as consultas',
  })
  async findAllAppointment() {
    return this.consultaService.findAllAppointment();
  }

  @Get('all/page/:id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Retorna consulta por página, id é o numero da página',
  })
  async findAppointmentByPage(@Param('id') id: number) {
    return this.consultaService.findAppointmentByPage(id);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Deleta um agendamento.',
  })
  @Delete('delete/:id')
  async deleteAppointment(@Param('id') id: string): Promise<void> {
    return this.consultaService.deleteAppointment(id);
  }

  @Get('all/paid-appointment')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Retorna todas as consultas pagas.',
  })
  async findAllPaidAppointment() {
    return this.consultaService.findAllPaidAppointment();
  }

  @Get('all/unpaid-appointment')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Retorna todas as consultas não pagas.',
  })
  async findAllUnPaidAppointment() {
    return this.consultaService.findAllUnPaidAppointment();
  }

  @Get('all/appointment-month/:year/:month')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Retorna todas as consultas do mês.',
  })
  async getAllAppointmentforMonth(
    @Param('year') year: number,
    @Param('month') month: number,
  ) {
    return this.consultaService.getAllAppointmentforMonth({
      month,
      year,
    });
  }

  @Get('total-value-by-month')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Retorna a contagem e valor total de consultas por mês.',
  })
  async getCountAndTotalValueByMonth() {
    return this.consultaService.getCountAndTotalValueByMonth();
  }

  @Get(':patient_id/day-appointment-patient/:year/:month')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Retorna todas as consultas do mês de um paciente.',
  })
  async getAppointmentforPatientMonth(
    @Param('patient_name') patient_name: string,
    @Param('year') year: number,
    @Param('month') month: number,
  ) {
    return this.consultaService.getAppointmentforPatientMonth({
      patient_name,
      month,
      year,
    });
  }

  @Get(':patient_name/day-appointment-patient/:year/:month/:day')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Retorna todas as consultas do dia de um paciente',
  })
  async getAppointmentforPatientDay(
    @Param('patient_name') patient_name: string,
    @Param('year') year: number,
    @Param('month') month: number,
    @Param('day') day: number,
  ) {
    return this.consultaService.getAppointmentforPatientDay({
      patient_name,
      day,
      month,
      year,
    });
  }
}
