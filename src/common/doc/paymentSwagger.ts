import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class PaymentSwagger {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'URL for redirect after payment',
    example: '',
  })
  urlretorno: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'ERP key',
    example: '',
  })
  chaveerp: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Payment amount',
    example: '0,01',
  })
  valor: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Number of installments',
    example: 1,
  })
  numeroparcela: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Name of the payer',
    example: 'João Ferreira',
  })
  nome: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "Payer's identification (CPF)",
    example: '155.726.850-97',
  })
  identificador: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "Payer's email",
    example: 'venceslau@gmail.com',
  })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "Payer's phone number",
    example: '31994553025',
  })
  telefone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'State',
    example: 'MG',
  })
  uf: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'City',
    example: 'Belo Horizonte',
  })
  cidade: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Street name',
    example: 'Rua Alagoas',
  })
  logradouro: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Neighborhood',
    example: 'Centro',
  })
  bairro: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Street number',
    example: '455',
  })
  numero: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Additional address info',
    example: null,
  })
  complemento: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Postal code (CEP)',
    example: '30130-160',
  })
  cep: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '',
    example: '',
  })
  nomebeneficiario: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '',
    example: '',
  })
  cpfbeneficiario: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    description: 'List of divisions',
    example: [],
  })
  listadivisao: [];
  //Array<{
  //   identificador: string | null;
  //   identificadorsocio: string | null;
  //   valordivisao: number | null;
  //   nomeServico: string | null;
  //   emitenotaourecibo: number | null;
  // }>;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Allows credit card payment',
    example: 1,
  })
  permitepagamentocartao: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Allows boleto payment',
    example: '0',
  })
  permitepagamentoboleto: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Allows debit card payment',
    example: '1',
  })
  permitepagamentodebito: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Allows PIX payment',
    example: '1',
  })
  permitepagamentopix: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Card tokenization',
    example: '0',
  })
  tokenizacartao: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Cardholder name',
    example: 'Joao Ferreira',
  })
  cartaonome: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Card number',
    example: '5362859291999142',
  })
  cartaonumero: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Card expiration date',
    example: '01/28',
  })
  cartaovencimento: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Card security code',
    example: '848',
  })
  cartaocodigoseguranca: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'IP address of the payer',
    example: '187.20.141.134',
  })
  ippagamento: string;
}

export class StatusPaymentSwagger {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Booleano ser true o false dependendo do status',
    example: true,
  })
  status: boolean;
}
