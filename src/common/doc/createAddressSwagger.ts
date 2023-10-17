import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class createAddressSwagger {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Id endereço.',
    example: '00000000000000000',
  })
  id?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'UF do endereço do paciente.',
    example: 'SP',
  })
  uf: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Cidade do endereço do paciente.',
    example: 'São Paulo',
  })
  cidade: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Logradouro do endereço do paciente.',
    example: 'Rua Exemplo',
  })
  logradouro: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Bairro do endereço do paciente.',
    example: 'Bairro Exemplo',
  })
  bairro: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Número do endereço do paciente.',
    example: '123',
  })
  numero: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Complemento do endereço do paciente.',
    example: 'Apartamento 10',
  })
  complemento: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'CEP do endereço do paciente.',
    example: '12345-678',
  })
  cep: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Id do paciente.',
    example: '0000000000000',
  })
  patient_id: string;
}
