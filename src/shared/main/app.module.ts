import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerBehindProxyGuard } from 'src/common/utils/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PatientModule } from 'src/module/patient.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/module/auth.module';
import { SecurityTokenModule } from 'src/module/security-token.module';
import { AdminModule } from 'src/module/admin.module';
import { typeOrmAsyncConfig } from 'src/common/config/typeorm.config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { TypeOrmFeaturedModule } from 'src/module/typeorm.module';
import { ConsultaModule } from 'src/module/consulta.module';
import { PaymentModule } from 'src/module/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    EventEmitterModule.forRoot(),
    //TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ThrottlerModule.forRoot({
      ttl: 1000, // Tempo de vida padrão das contagens de limite de taxa (em segundos)
      limit: 1000, // Número máximo de solicitações permitidas dentro do intervalo de tempo especificado
    }),
    AuthModule,
    AdminModule,
    PatientModule,
    SecurityTokenModule,
    PaymentModule,
    TypeOrmFeaturedModule,
    ConsultaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
