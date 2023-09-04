import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class IFindAllInDay {
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID do usuário',
    example: 'e1d7af5d-9d23-4876-b020-5066f5f66e5a',
  })
  user_id: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Dia do mês',
    example: 12,
  })
  day: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Mês',
    example: 6,
  })
  month: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Ano',
    example: 2023,
  })
  year: number;
}
