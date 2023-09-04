import { ApiProperty } from '@nestjs/swagger';
import {
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
