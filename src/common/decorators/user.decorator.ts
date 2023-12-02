import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import Patient from 'src/database/typeorm/Patient.entities';

export const LoggedUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const user: Patient = request.user;

  // console.log('====================================');
  // console.log('oq vem aqui user ', user);
  // console.log('====================================');

  if (!user) {
    throw new UnauthorizedException('User do not exists!');
  }

  return user;
});
