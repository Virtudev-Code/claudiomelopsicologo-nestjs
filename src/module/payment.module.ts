import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';

import { TypeOrmFeaturedModule } from './typeorm.module';
import { PaymentService } from 'src/service/payment.service';
import { PaymentController } from 'src/http/payment.http';

@Module({
  imports: [TypeOrmFeaturedModule, AuthModule],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
