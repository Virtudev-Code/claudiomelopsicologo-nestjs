// excel.service.ts
import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
const saoPauloTimeZone = 'America/Sao_Paulo';

@Injectable()
export class ExcelService {
  async exportData(data: any[]) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Dados');

    worksheet.columns = [
      { header: 'Nome do Paciente', key: 'patient_name', width: 32 },
      { header: 'Serviços', key: 'servicos', width: 32 },
      { header: 'Convênio', key: 'convenio', width: 20 },
      { header: 'Preço', key: 'preco', width: 20 },
      {
        header: 'Situação do Pagamento',
        key: 'situacaoDoPagamento',
        width: 20,
      },
      { header: 'Estado', key: 'estado', width: 20 },
      { header: 'Data', key: 'date', width: 20 },
    ];

    data.forEach((item) => {
      worksheet.addRow({
        patient_name: item.patient.name,
        servicos: item.servicos && item.servicos,
        convenio: item.convenio && item.convenio,
        preco: item.preco,
        situacaoDoPagamento: item.situacaoDoPagamento ? 'Pago' : 'Pendente',
        estado: item.estado,
        date: format(utcToZonedTime(item.date, saoPauloTimeZone), 'dd/MM/yyyy'),
      });
    });

    const filePath = path.join(__dirname, '..', '..', 'public', 'dados.xlsx');
    await workbook.xlsx.writeFile(filePath);
    return filePath;
  }
}
