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

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Identificador do usuário.',
    example: '00000000000',
  })
  identificador: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Telefone do usuário.',
    example: '11999999999',
  })
  telefone: string;

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
