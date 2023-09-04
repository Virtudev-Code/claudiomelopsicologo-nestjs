import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import Patient from 'src/database/typeorm/Patient.entities';

export class loginResponseSwagger {
  @IsObject()
  @ApiProperty({
    description: 'JWT gerado pelo login',
    example: {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    },
  })
  token: object;

  @ApiProperty({
    description: 'Dados do usuário autenticado',
  })
  user: Patient;
}
