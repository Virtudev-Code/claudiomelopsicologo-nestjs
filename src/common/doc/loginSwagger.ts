import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class loginSwagger {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'e-mail do Usuário',
    example: 'biahlages@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Senha do Usuário',
    example: 'Abc@1234',
  })
  password: string;
}
