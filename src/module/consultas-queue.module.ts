import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
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
  providers: [ConsultaService, ConsultaRepository],
  exports: [ConsultaRepository, ConsultaService],
})
export class ConsultasQueueModule {}
