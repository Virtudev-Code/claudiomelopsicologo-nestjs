import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Frequency } from '../constant/constants';

export class updatePatientSwagger {
  @IsString()
  @ApiProperty({
    description: 'Nome do usuário.',
    example: 'User',
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    description: 'Nome do usuário.',
    example: 'User',
  })
  email: string;

  @IsNotEmpty()
  @IsEnum(Frequency)
  frequency: Frequency;

  @IsPhoneNumber('BR')
  @ApiProperty({
    description: 'Nome do usuário.',
    example: 'User',
  })
  phoneNumber: string;
}

export class updateEmailSwagger {
  @IsEmail()
  @ApiProperty({
    description: 'Nome do usuário.',
    example: 'humberto.araripe12@gmail.com',
  })
  email: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Ativo.',
    example: true,
  })
  active: true;
}
