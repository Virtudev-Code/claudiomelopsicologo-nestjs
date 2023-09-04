import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class EmailSwagger {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email do Usuário utilizado no login. Deve ser único',
    example: 'user@email.com',
  })
  email: string;
}

export class ResetPasswordSwagger {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Token Id',
    example: 'ebe90b89-6e97-41fe-9855-fc57d5c7b29c',
  })
  token: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,}$/)
  @ApiProperty({
    description:
      'Senha do usuário para login. Deve ter 8 caracteres, um maiúsculo e um caractere especial',
    example: 'Abc@1234',
  })
  password: string;
}
