import { Module } from '@nestjs/common';
import { AdminRepository } from 'src/database/infra/repositories/AdminRepositories';
import { AdminService } from 'src/service/admin.service';
import { AuthModule } from './auth.module';
import { TypeOrmFeaturedModule } from './typeorm.module';
import { AdminController } from 'src/http/admin.http';
import { PatientService } from 'src/service/patient.service';
import { PatientRepository } from 'src/database/infra/repositories/PatientRepositories';

@Module({
  imports: [AuthModule, TypeOrmFeaturedModule],
  providers: [AdminRepository, AdminService, PatientRepository, PatientService],
  controllers: [AdminController],
  exports: [AdminRepository, AdminService],
})
export class AdminModule {}
