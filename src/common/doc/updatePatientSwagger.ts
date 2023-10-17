import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Frequency } from '../constant/constants';
import { createAddressSwagger } from 'src/common/doc/createAddressSwagger';

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

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Informações de endereço do paciente.',
    type: createAddressSwagger,
  })
  address: createAddressSwagger;
}

export class updateEmailSwagger {
  @IsEmail()
  @ApiProperty({
    description: 'Nome do usuário.',
    example: 'humberto.araripe12@gmail.com',
  })
  email: string;
}
