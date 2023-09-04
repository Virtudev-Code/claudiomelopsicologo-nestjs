import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IFindAppointments {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id do usuário',
    example: 'e1d7af5d-9d23-4876-b020-5066f5f66e5a',
  })
  user_id: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Data do agendamento',
    example: '2023-06-12T10:00:00',
  })
  date: Date;
}
