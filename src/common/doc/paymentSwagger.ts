import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class PaymentSwagger {
  @IsString()
  @ApiProperty({
    description: 'URL for redirect after payment',
    example: '',
  })
  urlretorno: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ERP key',
    example: 's215',
  })
  chaveerp: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Payment amount',
    example: '0,10',
  })
  valor: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Number of installments',
    example: 1,
  })
  numeroparcela: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the payer',
    example: 'João Ferreira',
  })
  nome: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Payer's identification (CPF)",
    example: '155.726.850-97',
  })
  identificador: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Payer's email",
    example: 'venceslau@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Payer's phone number",
    example: '31994553025',
  })
  telefone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'State',
    example: 'MG',
  })
  uf: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'City',
    example: 'Belo Horizonte',
  })
  cidade: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Street name',
    example: 'Rua Alagoas',
  })
  logradouro: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Neighborhood',
    example: 'Centro',
  })
  bairro: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Street number',
    example: '455',
  })
  numero: string;

  @IsOptional() // Indica que o campo pode ser nulo
  @IsString()
  @ApiProperty({
    description: 'Additional address info',
    example: null,
  })
  complemento: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Postal code (CEP)',
    example: '30130-160',
  })
  cep: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Beneficiary's name",
    example: 'Venceslau Ferreira',
  })
  nomebeneficiario: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Beneficiary's CPF",
    example: '922.482.690-30',
  })
  cpfbeneficiario: string;

  @IsArray()
  @IsNotEmpty()
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
  @IsNotEmpty()
  @ApiProperty({
    description: 'Allows credit card payment',
    example: '1',
  })
  permitepagamentocartao: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Allows boleto payment',
    example: '0',
  })
  permitepagamentoboleto: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Allows debit card payment',
    example: '1',
  })
  permitepagamentodebito: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Allows PIX payment',
    example: '1',
  })
  permitepagamentopix: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Card tokenization',
    example: '0',
  })
  tokenizacartao: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Cardholder name',
    example: 'Joao Ferreira',
  })
  cartaonome: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Card number',
    example: '5362859291999142',
  })
  cartaonumero: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Card expiration date',
    example: '01/28',
  })
  cartaovencimento: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Card security code',
    example: '848',
  })
  cartaocodigoseguranca: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'IP address of the payer',
    example: '187.20.141.134',
  })
  ippagamento: string;
}