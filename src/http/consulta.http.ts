import {
  Controller,
  Post,
  Bind,
  UseInterceptors,
  UploadedFiles,
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
        const consulta = {
          data: row.getCell(1).toString(),
          patient_name: row.getCell(2).toString(),
          servicos: row.getCell(3).toString(),
          convenio: row.getCell(4).toString(),
          preco: row.getCell(5).toString(),
          estado: row.getCell(7).toString(),
          comentarios: row.getCell(8).toString(),
          situacaoDoPagamento: false,
        };
        consultasImportadas.push(consulta);
      }
    });

    const createdConsultas = await this.consultaService.createConsultas(
      consultasImportadas,
    );

    return {
      message: 'Consultas importadas com sucesso',
      createdConsultas,
    };
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
}
