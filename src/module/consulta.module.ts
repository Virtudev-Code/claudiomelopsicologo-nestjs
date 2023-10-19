import { Module } from '@nestjs/common';
import { TypeOrmFeaturedModule } from './typeorm.module';
import { ConsultaRepository } from 'src/database/infra/repositories/ConsultaRepositories';
import { ConsultaService } from 'src/service/consulta.service';
import { ConsultaController } from 'src/http/consulta.http';
import { ConsultasQueueModule } from './consultas-queue.module';
import { BullModule } from '@nestjs/bull';
import { ExcelService } from 'src/service/excel.service';

@Module({
  imports: [
    TypeOrmFeaturedModule,
    ConsultasQueueModule,
    BullModule.registerQueue({
      name: 'consultas',
    }),
  ],
  providers: [ConsultaRepository, ConsultaService, ExcelService],
  controllers: [ConsultaController],
  exports: [ConsultaRepository, ConsultaService, ExcelService],
})
export class ConsultaModule {}
