import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
// import { EmailService } from './email.service';
import { ConsultaService } from 'src/service/consulta.service';

@Processor('consultas')
export class ConsultasQueueConsumer {
  constructor(private consultaService: ConsultaService) {}

  @Process('exportAndEmail')
  async handleExportAndEmail(job: Job<any>) {
    const { filters, email } = job.data;

    const csvFilePath = await this.consultaService.exportToCsv(filters);

    console.log('====================================');
    console.log('csvFilePath -->', csvFilePath);
    console.log('====================================');
    // await this.emailService.sendEmail(
    //   email,
    //   'Exported CSV',
    //   'Find attached the exported CSV file.',
    //   csvFilePath,
    // );

    return;
  }
}
