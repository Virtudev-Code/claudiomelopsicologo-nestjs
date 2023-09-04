import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Role } from '../enum/enum';
import Patient from 'src/database/typeorm/Patient.entities';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { patient }: { patient: Patient } = context
      .switchToHttp()
      .getRequest();

    if (!requiredRoles.some((role) => patient.role?.includes(role))) {
      throw new ForbiddenException({
        statusCode: 401,
        message: 'Forbidden resource',
        error: `You don't have permissions to access this route`,
      });
    } else {
      return requiredRoles.some((role) => patient.role?.includes(role));
    }
  }
}
