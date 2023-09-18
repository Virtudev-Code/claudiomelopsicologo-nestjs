import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class DivisaoDTO {
  @ApiProperty()
  @IsString()
  identificador: string;

  @ApiProperty()
  @IsNumber()
  valordivisao: number;

  @ApiProperty()
  @IsNumber()
  emitenotaourecibo: number;

  @ApiProperty()
  @IsString()
  nomeservico: string;
}

export class ClienteDTO {
  @ApiProperty()
  @IsString()
  urlretorno: string;

  @ApiProperty()
  @IsString()
  chavepessoa: string;

  @ApiProperty()
  @IsString()
  chaveerp: string;

  @ApiProperty()
  @IsNumber()
  valor: number;

  @ApiProperty()
  @IsNumber()
  numeroparcela: number;

  @ApiProperty()
  @IsString()
  nome: string;

  @ApiProperty()
  @IsString()
  identificador: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  telefone: string;

  @ApiProperty()
  @IsString()
  uf: string;

  @ApiProperty()
  @IsString()
  cidade: string;

  @ApiProperty()
  @IsString()
  logradouro: string;

  @ApiProperty()
  @IsString()
  bairro: string;

  @ApiProperty()
  @IsString()
  numero: string | null;

  @ApiProperty()
  @IsString()
  complemento: string | null;

  @ApiProperty()
  @IsString()
  cep: string;

  @ApiProperty()
  @IsString()
  nomebeneficiario: string;

  @ApiProperty()
  @IsString()
  cpfbeneficiario: string;

  @ApiProperty()
  @IsString()
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
