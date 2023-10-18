import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConsultasQueueConsumer } from 'src/common/bull/consultas-queue.consumer';
import { ConsultaService } from 'src/service/consulta.service';
import { ConsultaRepository } from 'src/database/infra/repositories/ConsultaRepositories';
import { TypeOrmFeaturedModule } from './typeorm.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'consultas',
    }),
    TypeOrmFeaturedModule,
  ],
  providers: [ConsultasQueueConsumer, ConsultaService, ConsultaRepository],
  exports: [ConsultaRepository, ConsultaService],
})
export class ConsultasQueueModule {}
