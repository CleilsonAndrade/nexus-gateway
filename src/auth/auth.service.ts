import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from 'src/modules/erp-shared/employees/entity/employee.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './interfaces/jwt-payload.interface';

export function mapEmployeeToJwtPayload(entity: EmployeeEntity): JwtPayload {
  const status = entity.situation === 'A' ? 'ativo' : 'inativo';
  const roles: string[] = [entity.codSector.toString(), entity.areaActing];

  return {
    registration: entity.registration,
    name: entity.nameWar,
    roles: roles,
    status: status,
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(EmployeeEntity, 'winthor_conn')
    private readonly userRepository: Repository<EmployeeEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    cpf: string,
    nameWar: string,
  ): Promise<EmployeeEntity | null> {
    const user = await this.userRepository.findOne({
      where: {
        cpf,
      },
    });

    if (!user) {
      return null;
    }

    const nameInformed = nameWar?.trim().toLowerCase();
    const nameRegistered = user.nameWar?.trim().toLowerCase();

    if (nameInformed !== nameRegistered) {
      return null;
    }

    const requiredCodSection = this.configService.get<number>(
      'AUTH_REQUIRED_COD_SECTION',
    );
    const requiredAreaActing = this.configService.get<number>(
      'AUTH_REQUIRED_AREA_ACTING',
    );

    const isDeveloper =
      user.codSector === Number(requiredCodSection) &&
      user.areaActing === String(requiredAreaActing);

    if (!isDeveloper) {
      throw new ForbiddenException(
        'Restricted access. User does not belong to the required sector/area.',
      );
    }

    return user;
  }

  async login(
    cpf: string,
    nameWar: string,
  ): Promise<{ accessToken: string; userName: string }> {
    const user = await this.validateUser(cpf, nameWar);

    try {
      if (!user) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      const payload: JwtPayload = mapEmployeeToJwtPayload(user);

      return {
        accessToken: this.jwtService.sign(payload),
        userName: payload.name,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      const erroStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(
        `Error logging in user ${nameWar}: ${errorMessage}`,
        erroStack,
      );

      throw new InternalServerErrorException(
        'Could not log in due to an internal error.',
      );
    }
  }
}
