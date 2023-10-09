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
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Routes } from 'src/common/constant/constants';
import { ConsultaService } from 'src/service/consulta.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enum/enum';
import { parse } from 'date-fns';
import * as ExcelJS from 'exceljs';
import { utcToZonedTime } from 'date-fns-tz';
const saoPauloTimeZone = 'America/Sao_Paulo';

@ApiTags(Routes.CONSULTA)
@Controller(Routes.CONSULTA)
@ApiBearerAuth()
export class ConsultaController {
  constructor(private readonly consultaService: ConsultaService) {}

  //@ApiBody({ type: createConsultaSwagger })
  @UsePipes(ValidationPipe)
  @Post('upload')
  @Bind(UploadedFiles())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Cria um agendamento pelo arquivo Excel.',
  })
  @UseInterceptors(AnyFilesInterceptor())
  async importExcel(file: any) {
    const uploadedFile = file[0];
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(uploadedFile.buffer);
    const consulta = [];

    const worksheet = workbook.getWorksheet(1);

    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);

      const dataCellValue = row.getCell(1).value;

      if (!dataCellValue) {
        continue;
      }

      let pagamento: any;
      let situacaoDoPagamento: any;

      console.log('====================================');
      console.log('oq vem aqui row.getCell -->', row.getCell(6).value);
      console.log('====================================');

      console.log('====================================');
      console.log('oq vem aqui status-->', row.getCell(6).value === 'Pago');
      console.log('====================================');

      if (row.getCell(6).value === 'Pago') {
        pagamento = true;
        situacaoDoPagamento = true;
      } else {
        pagamento = false;
        situacaoDoPagamento = false;
      }

      const dataCellString = dataCellValue.toString();

      console.log('====================================');
      console.log('data que vem da planilha -->', dataCellString);
      console.log('====================================');
      const date = parse(
        dataCellString,
        'dd/MM/yyyy',
        utcToZonedTime(new Date(), saoPauloTimeZone),
      );

      const value = {
        date,
        patient_name: row.getCell(2).value,
        servicos: row.getCell(3).value,
        convenio: row.getCell(4).value,
        preco: row.getCell(5).value,
        pagamento,
        situacaoDoPagamento,
        estado: row.getCell(7).value,
        comentarios: row.getCell(8).value,
      };

      console.log('====================================');
      console.log('data -->', value);
      console.log('====================================');

      consulta.push(value);
    }

    const createdConsultas = await this.consultaService.createConsultas(
      consulta,
    );

    return createdConsultas;
  }

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

  @Get('total-value-by-month/:year/:month')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({
    summary:
      'Retorna o total de valor de consultas para um mês e ano específicos.',
  })
  async getTotalValueByMonth(
    @Param('year') year: number,
    @Param('month') month: number,
  ) {
    return this.consultaService.getTotalValueByMonth({ year, month });
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
