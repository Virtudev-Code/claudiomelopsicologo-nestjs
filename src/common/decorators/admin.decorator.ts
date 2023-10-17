import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import Patient from 'src/database/typeorm/Patient.entities';

export const LoggedAdmin = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const user: Patient = request.user;

  console.log('====================================');
  console.log('oq vem aqui admin', user);
  console.log('====================================');

  if (user.role !== 'admin') {
    throw new UnauthorizedException('User do not have permisssions!');
  }

  return user;
});
