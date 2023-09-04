import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { PatientRepository } from 'src/database/infra/repositories/PatientRepositories';
import { PatientController } from 'src/http/patient.http';
import { PatientService } from 'src/service/patient.service';
import { TypeOrmFeaturedModule } from './typeorm.module';

@Module({
  imports: [TypeOrmFeaturedModule, AuthModule],
  providers: [PatientRepository, PatientService],
  controllers: [PatientController],
  exports: [PatientRepository, PatientService],
})
export class PatientModule {}
