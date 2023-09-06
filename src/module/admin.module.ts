import { Module } from '@nestjs/common';
import { AdminRepository } from 'src/database/infra/repositories/AdminRepositories';
import { AdminService } from 'src/service/admin.service';
import { AuthModule } from './auth.module';
import { TypeOrmFeaturedModule } from './typeorm.module';
import { AdminController } from 'src/http/admin.http';

@Module({
  imports: [AuthModule, TypeOrmFeaturedModule],
  providers: [AdminRepository, AdminService],
  controllers: [AdminController],
  exports: [AdminRepository, AdminService],
})
export class AdminModule {}
