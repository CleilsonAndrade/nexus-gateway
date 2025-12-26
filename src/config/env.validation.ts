import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
}

export class EnvironmentVariables {
  @IsEnum(Environment, {
    message: 'NODE_ENV must be one of: development, production, staging.',
  })
  NODE_ENV: Environment;

  @IsNumber()
  @Min(1024, { message: 'PORT must be grater than 1024.' })
  @Max(65535, { message: 'PORT must be less than 65535.' })
  PORT: number;

  @IsString({ message: 'DB_HOST is required' })
  DB_HOST: string;

  @IsNumber()
  @Min(1, { message: 'DB_PORT must be a valid port number.' })
  @Max(65535, { message: 'DB_PORT must be less than 65535.' })
  DB_PORT: number;

  @IsString({ message: 'DB_USERNAME is required.' })
  DB_USERNAME: string;

  @IsString({ message: 'DB_PASSWORD is required' })
  @MinLength(6, {
    message: 'DB_PASSWORD must be at least 6 characters for security.',
  })
  DB_PASSWORD: string;

  @IsString({ message: 'DB_SERVICE_NAME is required.' })
  DB_SERVICE_NAME: string;

  @IsNumber()
  @Min(1000, { message: 'DB_QUERY_TIMEOUT must be at least 1000ms (1 second)' })
  @Max(300000, {
    message: 'DB_QUERY_TIMEOUT should not exceed 300000ms (5 minutes)',
  })
  @IsOptional()
  DB_QUERY_TIMEOUT?: number = 300000;

  @IsNumber()
  @Min(1, { message: 'DB_POOL_MIN must be at least 2' })
  @Max(50, { message: 'DB_POOL_MIN should bot exceed 50' })
  DB_POOL_MIN?: number = 2;

  @IsNumber()
  @Min(1, { message: 'DB_POOL_MAX must be at least 2' })
  @Max(100, { message: 'DB_POOL_MAX should not exceed 100' })
  DB_POOL_MAX?: number = 10;

  @IsString({ message: 'JWT_SECRET is required.' })
  @MinLength(32, {
    message:
      'JWT_SECRET must be at least 32 characters for security. Current length is too short.',
  })
  JWT_SECRET: string;

  @IsString({ message: 'JWT_EXPIRATION_TIME is required.' })
  JWT_EXPIRATION_TIME: string;

  @IsNumber()
  @Min(1, { message: 'RATE_LIMIT_TTL must be at least 1 second' })
  @Max(3600, {
    message: 'RATE_LIMIT_TTL should be not exceed 3600 seconds (1 hour)',
  })
  @IsOptional()
  RATE_LIMIT_TTL?: number = 60;

  @IsNumber()
  @Min(1, { message: 'RATE_LIMIT_MAX must be at least 1' })
  @Max(1000, { message: 'RATE_LIMIT_MAX should not exceed 10000' })
  @IsOptional()
  RATE_LIMIT_MAX?: number = 100;

  @IsNumber()
  @IsOptional()
  AUTH_REQUIRED_COD_SECTION?: number;

  @IsString()
  @IsOptional()
  AUTH_REQUIRED_AREA_ACTING?: string;
}

export function validate(config: Record<string, unknown>) {
  const validateConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validateConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const messages = errors
      .map(error => {
        const constraints = error.constraints || [];
        const property = error.property;
        return Object.values(constraints).map(msg => `${property}: ${msg}`);
      })
      .flat();

    throw new Error(
      `\n${'='.repeat(60)}\n` +
        `CONFIGURATION VALIDATION FAILED \n` +
        `${'='.repeat(60)}\n` +
        `${messages.join('\n')}` +
        `${'='.repeat(60)}\n` +
        `Check your .env file and compare with .env.example\n` +
        `${'='.repeat(60)}\n`,
    );
  }

  return validateConfig;
}
