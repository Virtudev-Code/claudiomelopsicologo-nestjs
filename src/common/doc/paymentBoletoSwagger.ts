import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class DivisaoDTO {
  @ApiProperty({ example: '074.789.996-70' })
  @IsString()
  @IsOptional()
  identificador: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @IsOptional()
  valordivisao: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  emitenotaourecibo: number;

  @ApiProperty({ example: 'Serviço Médico' })
  @IsString()
  @IsOptional()
  nomeservico: string;
}

export class ClienteDTO {
  @ApiProperty({ example: 'https://www.urlcliente.com.br?chaveerp=5568' })
  @IsString()
  @IsOptional()
  urlretorno: string;

  @ApiProperty({ example: '1b3893b3-1f9b-4a12-a2f7-555122caed61' })
  @IsString()
  @IsOptional()
  chavepessoa: string;

  @ApiProperty({ example: '5668' })
  @IsString()
  @IsOptional()
  chaveerp: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  valor: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  numeroparcela: number;

  @ApiProperty({ example: 'João Ferreira' })
  @IsString()
  @IsOptional()
  nome: string;

  @ApiProperty({ example: '155.726.850-97' })
  @IsString()
  @IsOptional()
  identificador: string;

  @ApiProperty({ example: 'venceslau@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '31994553025' })
  @IsString()
  @IsOptional()
  telefone: string;

  @ApiProperty({ example: 'MG' })
  @IsString()
  @IsOptional()
  uf: string;

  @ApiProperty({ example: 'Belo Horizonte' })
  @IsString()
  @IsOptional()
  cidade: string;

  @ApiProperty({ example: 'Rua Alagoas' })
  @IsString()
  @IsOptional()
  logradouro: string;

  @ApiProperty({ example: 'Centro' })
  @IsString()
  @IsOptional()
  bairro: string;

  @ApiProperty({ example: '455' })
  @IsString()
  @IsOptional()
  numero: string | null;

  @ApiProperty({ example: null })
  @IsString()
  @IsOptional()
  complemento: string | null;

  @ApiProperty({ example: '30130-160' })
  @IsString()
  @IsOptional()
  cep: string;

  @ApiProperty({ example: 'Venceslau Ferreira' })
  @IsString()
  @IsOptional()
  nomebeneficiario: string;

  @ApiProperty({ example: '922.482.690-30' })
  @IsString()
  @IsOptional()
  cpfbeneficiario: string;

  @ApiProperty({ example: '2017-05-10 17:32:19' })
  @IsString()
  @IsOptional()
  boleto_datavencimento: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  boleto_taxamulta: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  boleto_taxamora: number;

  @ApiProperty({
    example: [],
  })
  @IsArray()
  @Type(() => DivisaoDTO)
  listadivisao: DivisaoDTO[];
}
