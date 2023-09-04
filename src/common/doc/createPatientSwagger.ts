import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { Frequency } from '../constant/constants';

export class createPatientSwagger {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nome do usuário.',
    example: 'User',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email do Usuário utilizado no login. Deve ser único',
    example: 'user@email.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,}$/, {
    message:
      'A senha deve ter 8 caracteres, um maiúsculo e um caractere especial',
  })
  @ApiProperty({
    description: 'Senha do usuário para login.',
    example: 'Abc@1234',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,}$/, {
    message:
      'A senha deve ter 8 caracteres, um maiúsculo e um caractere especial',
  })
  @ApiProperty({
    description: 'Confirmação da senha do usuário para login.',
    example: 'Abc@1234',
  })
  confirmPassword: string;

  @IsEnum(Frequency)
  @IsNotEmpty()
  @ApiProperty({
    description: 'frequência de consulta',
    enum: Frequency,
  })
  frequency: Frequency;
}
