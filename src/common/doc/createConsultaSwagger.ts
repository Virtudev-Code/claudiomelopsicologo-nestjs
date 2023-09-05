import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class createConsultaSwagger {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Data da consulta',
    example: '2023-06-13T22:00:00',
  })
  data: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nome do paciente',
    example: 'Larissa Oliveira Aragão Werneck',
  })
  patient_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Serviço para consultar.',
    example: 'Consulta Psicanálise',
  })
  servicos: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Convenio do paciente.',
    example: 'Particular',
  })
  convenio: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Preço da consulta',
    example: '225,00',
  })
  preco: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Situação do pagamento da consulta',
    example: 'Pago',
  })
  situacaoDoPagamento: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Estado da consulta',
    example: 'Programado',
  })
  estado: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Comentarios sobre consulta',
    example: 'Teste',
  })
  comentarios: string;
}
