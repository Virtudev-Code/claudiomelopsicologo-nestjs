import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ICreateAppointment {
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID do paciente',
    example: 'e1d7af5d-9d23-4876-b020-5066f5f66e5a',
  })
  id_patient: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'ID do doutor',
    example: 'e1d7af5d-9d23-4876-b020-5066f5f66e5b',
  })
  id_doctor: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Data do agendamento',
    example: '2023-06-13T22:00:00',
  })
  date: Date;
}
