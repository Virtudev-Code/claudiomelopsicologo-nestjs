import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'postgres',
      host: configService.get('POSTGRES_DB_HOST'),
      port: configService.get('POSTGRES_DB_PORT'),
      username: configService.get('POSTGRES_DB_USERNAME'),
      password: configService.get('POSTGRES_DB_PASSWORD'),
      database: configService.get('POSTGRES_DB_DATABASE'),
      entities: ['dist/**/*.entities{.js,.ts}'],
      migrations: [`dist/database/migrations/*{.ts,.js}`],
      synchronize: false,
      autoLoadEntities: false,
      migrationsRun: false,
      migrationsTableName: 'migrations',
      logging: true,
    };
  },
};

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 35432,
  username: 'postgres',
  database: 'virtudev',
  password: '123456789',
  entities: ['dist/**/*.entities{.js,.ts}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: false,
  autoLoadEntities: false,
  logging: false,
};
