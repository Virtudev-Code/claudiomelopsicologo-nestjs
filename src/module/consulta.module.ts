import { Module } from '@nestjs/common';
import { TypeOrmFeaturedModule } from './typeorm.module';
import { ConsultaRepository } from 'src/database/infra/repositories/ConsultaRepositories';
import { ConsultaService } from 'src/service/consulta.service';
import { ConsultaController } from 'src/http/consulta.http';

@Module({
  imports: [TypeOrmFeaturedModule],
  providers: [ConsultaRepository, ConsultaService],
  controllers: [ConsultaController],
  exports: [ConsultaRepository, ConsultaService],
})
export class ConsultaModule {}
