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
    example: 's215',
  })
  chaveerp: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Payment amount',
    example: '0,10',
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
    description: '',
    example: '',
  })
  telefone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '',
    example: '',
  })
  uf: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '',
    example: '',
  })
  cidade: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '',
    example: '',
  })
  logradouro: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '',
    example: '',
  })
  bairro: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '',
    example: '',
  })
  numero: string;

  @IsOptional()
  @IsOptional()
  @ApiProperty({
    description: '',
    example: '',
  })
  complemento: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '',
    example: '',
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
    example: [
      {
        identificador: '59.929.666/0001-71',
        identificadorsocio: null,
        valordivisao: 0.05,
        nomeServico: '',
        emitenotaourecibo: 0,
      },
      {
        identificador: '14.234.508/0001-69',
        identificadorsocio: null,
        valordivisao: 0.05,
        nomeServico: '',
        emitenotaourecibo: 0,
      },
    ],
  })
  listadivisao: Array<{
    identificador: string;
    identificadorsocio: string | null;
    valordivisao: number;
    nomeServico: string;
    emitenotaourecibo: number;
  }>;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Allows credit card payment',
    example: '1',
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
