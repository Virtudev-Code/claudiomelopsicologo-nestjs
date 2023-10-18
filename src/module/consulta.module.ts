import { Module } from '@nestjs/common';
import { TypeOrmFeaturedModule } from './typeorm.module';
import { ConsultaRepository } from 'src/database/infra/repositories/ConsultaRepositories';
import { ConsultaService } from 'src/service/consulta.service';
import { ConsultaController } from 'src/http/consulta.http';
import { ConsultasQueueModule } from './consultas-queue.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmFeaturedModule,
    ConsultasQueueModule,
    BullModule.registerQueue({
      name: 'consultas',
    }),
  ],
  providers: [ConsultaRepository, ConsultaService],
  controllers: [ConsultaController],
  exports: [ConsultaRepository, ConsultaService],
})
export class ConsultaModule {}
