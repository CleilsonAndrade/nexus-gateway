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

  @IsString({ message: 'JWT_SECRET is required.' })
  @MinLength(32, {
    message:
      'JWT_SECRET must be at least 32 characters for security. Current length is too short.',
  })
  JWT_SECRET: string;

  @IsString({ message: 'JWT_EXPIRATION_TIME is required.' })
  JWT_EXPIRATION_TIME: string;

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
