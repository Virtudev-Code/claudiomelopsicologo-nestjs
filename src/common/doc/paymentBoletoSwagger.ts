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
  @ApiProperty()
  @IsString()
  @IsOptional()
  identificador: string;

  @ApiProperty()
  @IsNumber()
  valordivisao: number;

  @ApiProperty()
  @IsNumber()
  emitenotaourecibo: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  nomeservico: string;
}

export class ClienteDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  urlretorno: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  chavepessoa: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  chaveerp: string;

  @ApiProperty()
  @IsNumber()
  valor: number;

  @ApiProperty()
  @IsNumber()
  numeroparcela: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  nome: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  identificador: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  telefone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  uf: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  cidade: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  logradouro: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bairro: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  numero: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  complemento: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  cep: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  nomebeneficiario: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  cpfbeneficiario: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  boleto_datavencimento: string;

  @ApiProperty()
  @IsNumber()
  boleto_taxamulta: number;

  @ApiProperty()
  @IsNumber()
  boleto_taxamora: number;

  @ApiProperty({ type: [DivisaoDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DivisaoDTO)
  listadivisao: DivisaoDTO[];
}
