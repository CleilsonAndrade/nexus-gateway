import { Injectable } from '@nestjs/common';
import { ConfigService, registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    // const isDevelopment = this.configService.get<string>('NODE_ENV') === 'development'

    return {
      name: 'winthor_conn',
      type: 'oracle',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      serviceName: process.env.DB_SERVICE_NAME,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],

      synchronize: false,

      logging:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],

      extra: {
        poolMin: Number(process.env.DB_POOL_MIN) || 2,
        poolMax: Number(process.env.DB_POOL_MAX) || 10,
        poolIncrement: 1,
        poolTimeout: 60,
      },

      migrations: [__dirname + '../database/migrations/*{.ts,.js}'],
      migrationsRun: false,
    };
  }
}

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    name: 'winthor_conn',
    type: 'oracle',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    serviceName: process.env.DB_SERVICE_NAME,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],

    synchronize: false,

    logging:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],

    extra: {
      poolMin: Number(process.env.DB_POOL_MIN) || 2,
      poolMax: Number(process.env.DB_POOL_MAX) || 10,
      poolIncrement: 1,
      poolTimeout: 60,
    },

    migrations: [__dirname + '../database/migrations/*{.ts,.js}'],
    migrationsRun: false,
  }),
);
